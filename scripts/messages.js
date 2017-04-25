import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';
import Gists from 'gists';
import Gitter from 'node-gitter';
let formatting = require('./formatting.js').formatting

let doc
let worksheetinfo

let gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)

let gists = new Gists({
    username: process.env.GIST_USERNAME,
    password: process.env.GIST_PASSWORD
})



let setAuth = (callback) => {
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth({
                "private_key": process.env.GOOGLE_PRIVATE_KEY,
                "client_email": process.env.GOOGLE_CLIENT_EMAIL
            }, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                worksheetinfo = info
                step(null, worksheetinfo)
            });
        }
    ], callback);
}

let sendGist = (message, dest, callback) => {
    gists.download({id: dest }, function(err, res) {
        formatGist(message, function (data) {
            gists.edit({"description": "the description for this gist", "files": {"log.txt": { "content": res.files["log.txt"].content + "\n" + data }}, "id": dest }, function (err, inf) {
                callback({"updated": res.updated_at})
            })
        })
    });
}

let sendMessage = (message, dest, callback) => {
    formatMessage(message, function (res) {
        doc = new GoogleSpreadsheet(dest)
        setAuth(function (err, info) {
            if(!err) {
                console.log(doc)
                doc.addRow(info.worksheets[0].id, res, function (err, info) {
                    if (err) console.log(err)
                    callback(info)
                })
            }
        })
    })
}

let formatGist = (message, callback) => {
    let action = formatting.getDataMask(message.text, /\+[^*\s]+/)
    let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
    let name = formatting.getName(message.user.name)
    let msg = formatting.removeFromMessage(message.text, action)

    formatting.getRoom(message.room).then(function (room) {
        callback(action.substr(1) + ", " + new Date().toISOString() + ", " + "@" + message.user.login + " ("+ name +")" + ", " + room.name +", " + assignees + ", " + formatting.removeFromMessage(msg, assignees))
    })
}

let formatMessage = (message, callback) => {
    let action = formatting.getDataMask(message.text, /\+[^*\s]+/)
    let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
    let name = formatting.getName(message.user.name)
    let msg = formatting.removeFromMessage(message.text, action)

    formatting.getRoom(message.room).then(function (room) {
        callback({
            "action": action.substr(1),
            "timestamp": new Date().toISOString(),
            "poster": "@" + message.user.login + " ("+ name +")",
            "assignees": assignees,
            "message": formatting.removeFromMessage(msg, assignees),
            "room": room.name
        })
    })
}


exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage,
    sendGist: sendGist,
    formatMessage: formatMessage,
    formatGist: formatGist
};
