import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';
import Gists from 'gists';

let doc = new GoogleSpreadsheet(process.env.GOOGLE_WORKSHEET)
let worksheetinfo

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

let sendGist = function (message, callback) {
    gists.download({id: process.env.GIST_WORKSHEET }, function(err, res) {
        gists.edit({"description": "the description for this gist", "files": {"log.txt": { "content": res.files["log.txt"].content + "\n" + formatGist(message) }}, "id": process.env.GIST_WORKSHEET }, function (err, inf) {
            callback({"updated": res.updated_at})
        })
    });
}

let sendMessage = function (message, callback) {
    let messageObj = formatMessage(message)
    if (messageObj) {

        doc.addRow(worksheetinfo.worksheets[0].id, messageObj, function (err, info) {
            if (err) console.log(err)
            callback(info)
        })
    }
    return "Specify parameters"
}

let formatGist = function (message) {
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

    return action.trim().substring(1) + " | " + new Date().toISOString() + " | " + "@" + message.user.login + " ("+ name +")" + " | " + assignees + " | " + msg

}

let formatMessage = function (message) {
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

    return {
        "action": action.trim().substring(1),
        "timestamp": new Date().toISOString(),
        "poster": "@" + message.user.login + " ("+ name +")",
        "assignees": assignees,
        "message": msg
    }
}

exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage,
    sendGist: sendGist
};
