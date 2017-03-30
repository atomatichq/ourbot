import GoogleSpreadsheet from 'google-spreadsheet';
import async from 'async';

let doc = new GoogleSpreadsheet(process.env.workSheet)
let worksheetinfo
let conf = {
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}

let setAuth = function (callback) {
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth(conf, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                worksheetinfo = info
                step(null, worksheetinfo)
            });
        }
    ], callback);
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

let formatMessage = function (message) {
    let messageText = message.text.indexOf(' ')+1
    let msg = message.text.substr(messageText)
    if (!messageText) return null
    let assignees = message.text.substr(messageText).match(/@[^*\s]+/)
    if (!assignees)
      assignees = "none"
    else {
      assignees = assignees[0].trim()
      msg = message.text.substr(messageText).replace(assignees, '').trim()
    }

    let name = message.user.name.substr(0, message.user.name.indexOf(' '))

    return {
        "action": message.text.substr(1, messageText-2),
        "timestamp": new Date().toISOString(),
        "poster": "@" + message.user.login + " ("+ name +")",
        "assignees": assignees,
        "message": msg
    }
}

exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage
};
