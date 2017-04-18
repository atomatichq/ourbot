import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';
import Gists from 'gists';
import Gitter from 'node-gitter';

let doc
let worksheetinfo

let gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)

let gists = new Gists({
    username: process.env.GIST_USERNAME,
    password: process.env.GIST_PASSWORD
})



let setAuth = function (callback) {
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

let sendGist = function (message, dest, callback) {
    gists.download({id: dest }, function(err, res) {
        formatGist(message, function (data) {
            gists.edit({"description": "the description for this gist", "files": {"log.txt": { "content": res.files["log.txt"].content + "\n" + data }}, "id": dest }, function (err, inf) {
                callback({"updated": res.updated_at})
            })
        })
    });
}

let sendMessage = function (message, dest, callback) {
    let messageObj = formatMessage(message, function (res) {
        doc = new GoogleSpreadsheet(dest)
        setAuth(function (err, info) {
            console.log(err)
            if(!err) {
                doc.addRow(worksheetinfo.worksheets[0].id, res, function (err, info) {
                    if (err) console.log(err)
                    callback(info)
                })
            }
        })
    })
}

let formatGist = function (message, callback) {
    let msg = message.text
    let action = message.text.match(/\+[^*\s]+/)[0]
    msg = msg.replace(action, '').trim()
    if(!msg) return null
    let assignees = message.text.match(/@[^*\s]+/)
    if (!assignees)
      assignees = "none"
    else {
      assignees = assignees[0].trim()
      msg = msg.replace(assignees, '').trim()
    }

    let name = message.user.name.substr(0, message.user.name.indexOf(' '))

    getRoom(message.room, function (roomid) {
        callback(action.trim().substring(1) + ", " + new Date().toISOString() + ", " + "@" + message.user.login + " ("+ name +")" + ", " + roomid +", " + assignees + ", " + msg)
    })

}

let formatMessage = function (message, callback) {
    let action = getAction(message.text)
    let assignees = getAssignees(messages.text)
    let name = getName(message.user.name)
    let msg = removeFromMessage(message.text, action)

    getRoom(message.room, function (roomid) {
        callback({
            "action": action,
            "timestamp": new Date().toISOString(),
            "poster": "@" + message.user.login + " ("+ name +")",
            "assignees": assignees,
            "message": removeFromMessage(msg, assignees),
            "room": roomid
        })
    })
}

let getRoom = function (roomId, callback) {
    gitter.rooms.find(roomId)
    .then(function(room) {
        callback(room.name)
    })
}

let getAction = function (text) {
    let act = text.match(/\+[^*\s]+/)
    if(act != null) return act[0].trim()
    return null
}

let getAssignees = function (text) {
    let ass = text.match(/@[^*\s]+/)
    if(ass != null) return ass[0].trim()
    return "none"
}

let getName = function (text) {
    return text.substr(0, text.indexOf(' '))
}

let removeFromMessage = function (text, rem) {
    return text.replace(rem, '').trim().replace(/\s+/g, " ")
}

exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage,
    sendGist: sendGist,
    formatMessage: formatMessage,
    formatGist: formatGist,
    getRoom: getRoom,
    getAction: getAction,
    getAssignees: getAssignees,
    getName: getName,
    removeFromMessage: removeFromMessage
};
