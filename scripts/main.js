// Description:
//   Example scripts for you to examine and try out.
//
// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md


module.exports = (robot) => {
    let config = require('../config.json')
    let messages = require('./messages.js').messages
    let formatting = require('./formatting.js').formatting
    let {createMilestone, createMilestoneAll,closeMilestone,closeMilestoneAll} = require("./milestone.js")
    let moment = require('moment')
    robot.hear(/.*/i, (res) => {
        let key, val, de, ref
        let message = formatting.getDataMask(res.message.text, /\+[^*\s]+/)
        for(key in config.monitor) {
            val = config.monitor[key]
            if(message !== null) {
                if(key === message) {
                    for(de in config.monitor[message].dest) {
                        ref = config.monitor[message].dest[de]
                        messages[config.docs[ref].fun](res.message, config.docs[ref].dest, (info) => {
                            console.log("Added at: " + info.updated)
                        })
                    }
                }
            }
        }
    })
    
    robot.hear(/bot create milestone|bot close milestone/i, (res) => {
        var message = res.message.text
        message = message.split(' ')
        if(message.length === 7 && message[0] === "bot" && message[1] === "create" && message[2] === "milestone") {
          var repos = message[6]
          repos = repos.split('/')
          var title = message[3]+" "+message[4]+" "+message[5]
          const myDate = moment(title, 'DD-MMM-YYYY').toDate()
          if(myDate == "Invalid Date") {
            res.reply("Title format is invalid")
          }
          else {
            createMilestone(repos[0], repos[1], title, myDate)
            res.reply("Milestone successfully created at 'https://github.com/"+repos[0]+"/"+repos[1]+"/milestones")
          }
        }
        else if(message.length === 7 && message[0] === "bot" && message[1] === "close" && message[2] === "milestone") {
          var repos = message[6]
          repos = repos.split('/')
          var title = message[3]+" "+message[4]+" "+message[5]
          title = "Sprint - "+title
          const myDate = moment(title, 'DD-MMM-YYYY').toDate()
          if(myDate == "Invalid Date") {
            res.reply("Title format is invalid")
          }
          else {
            closeMilestone(repos[0], repos[1], title)
            res.reply("Milestone successfully closed at 'https://github.com/"+repos[0]+"/"+repos[1]+"/milestones")
          }
        }
        
        else if(message.length === 6 && message[0] === "bot" && message[1] === "close" && message[2] === "milestone") {
          var title = message[3]+" "+message[4]+" "+message[5]
          title = "Sprint - "+title
          const myDate = moment(title, 'DD-MMM-YYYY').toDate()
          if(myDate == "Invalid Date") {
            res.reply("Title format is invalid")
          }
          else {
            closeMilestoneAll(title)
            res.reply("Milestones successfully closed")
          }
        }
        else if(message.length === 6 && message[0] === "bot" && message[1] === "create" && message[2] === "milestone"){
          var title = message[3]+" "+message[4]+" "+message[5]
          const myDate = moment(title, 'DD-MMM-YYYY').toDate()
          if(myDate == "Invalid Date") {
            res.reply("Title format is invalid")
          }
          else {
            createMilestoneAll(title, myDate)
            res.reply("Milestones successfully created")
          }
        }
    })
    
 
    
    robot.hear(/bot help|bot/i, (res) => {
        var message = res.message.text
        message = message.split(' ')
        if(message.length === 1 && (message[0] === "bot" || message[0] === "/bot")){
            res.reply("Hi, I'm your helpful chatops bot! Please, see README for the usage https://github.com/datopian/ourbot#commands\n+todo - get logged to the Google doc, Gist\n +standup - get logged to the Google doc, Gist")
          }
        else if(message.length == 2 && (message[0] === "bot" && message[1] === "help") || (message[0] === "/bot" && message[1] === "help")){
            res.reply("Hi, I'm your helpful chatops bot! Please, see README for the usage https://github.com/datopian/ourbot#commands\n+todo - get logged to the Google doc, Gist\n +standup - get logged to the Google doc, Gist")
          }
    })
    robot.hear(/bot todos/i, (res) => {
        var message = res.message.text
        message = message.split(' ')
        if(message.length === 2) {
            res.reply("https://docs.google.com/spreadsheets/d/"+process.env.GOOGLE_WORKSHEET)
        }
    })
    robot.error((err, res) => {
        console.log(err)
        robot.logger.error("DOES NOT COMPUTE")

        if(res !== null) {
            res.reply("DOES NOT COMPUTE")
        }
    })
}
