# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = (robot) ->

  GoogleSpreadsheet = require('google-spreadsheet')
  async = require('async')
  doc = new GoogleSpreadsheet('15dxhLpRnc1_g2nWISYx7FpQfakbSXrh93cMRIuwsFow')
  creds = {
    "client_email": "941963576311-compute@developer.gserviceaccount.com","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDQwgYKPQLZmIKv\nnTpkplIIdfUPYs6BfLw8BZ6PBrLEUmh8zhAaVY4MHIHojd9flj72VOKY8heaFL4X\n0ifXXD+SnvOwsK1Dw/03DqlcuL6wHZGrKmHP+32aRMWEIsu0NaMAaxiBIglGOk8i\nl6o0EYwzRCpwXqIITF6C/CGSsjOtr4csx+3OMlpUXGoNh3i1VaEX59Ok6r/3Zj6N\ndxRJbAQOx7wctjKF37J6NWA41Qa/j7TI5kQcNmCkg2Wvns8/aS+v8VnxHiArzaFK\nsENmvgYWdpUM+sdwaTv7CPre/UnJRhhtqZmLpa2XduOUFkgUpwrH3C7MYehhtgU4\nMJpt+nH7AgMBAAECggEBAM0nwHPTXbemT9hyNe6wHTI/aiRCwBs1EHAUPazlsk2J\nhzIP+HdI2R5B7dEzi/AOYbYH2eDhGhzMgbw7Rfg5qihXmbltB/nu5Cx1di+vR4cg\nqAWE0zdoOhmfuFSRNYvWomhI134giui/aQHf9t7Q1+2R8fsYpThuhPtI+V2HT45B\nib5Cf8GenOl0k73cZVPMSrs1uDdwI3uVrAWgpjBYYvtXXhohQM3RWcCnbvPqzlzb\n2vNu3UsdpPr7xQ81G5fi+a6JbSlcCp/oqqbcCJpSX0QjWEdmMVBXGmY9KJAIJjyI\nyCC3pPMtdY6jCdjfsc5NsrWqbP2r9l9LUCzNYrZ1dWECgYEA6E/Sf339lcqaZVV7\nlY1Az8X9b4QlOhvLLuN3wnyi2JRjbCAK9Fa3RH2HfEbCiMAi/uPP6dD0aO3Vqtni\n3c3UKKYNR6IwwtnDpKXLIlNEWxbv+H6o4YTk6aEKjcUpGzte0pDWj0Nd+e/uhiq2\nmP0sHBgaVr9jYQb2gA55+C7Z84kCgYEA5gtcAQ/YTd3dyhriBSn/qWg8dvrTrWp+\noIw5OZTj3f6lv2DcIxJpYyTP2j/sX3TzQfwqaBYopdq4EGh7iFSclNAuOe8M9Mio\nSNGbz/0yWqA/b/jHV5zUk93W15KcnQC/LjsDBGNxMAp8js+C/Dv+muJ8oePT3Pt1\nN7fACDdiJGMCgYAf5UW7Z2r3s/d6zj/HirtJS5++PeB2l/ZPm7+HnmElZ0o3QDcA\n0R8ccje14mk3KVoksNaM/blw5qadbIjvdyEX66SLH0OenRN1eaXoMpKCByYvcgRx\n4jMjuI6gZF9+c6pTMruis9clR8Hx/c9QNgJmYRDMtD5Kxg/2CQbKAnS+MQKBgQCW\nZ/zqkNKK7rHRL0xxtej7eTR3Uj3OF1/dVnEfzdJCVflGrGyh3arb8LiZaMwCCXP2\nw4lybnJ7JgrMZ5PFKhUKUya2KC7faMZmfe2Symf+yuFPM2gaR2bRmuyaG7icCl31\nOw4Y82+Qynpv4QsyIYOw/r4gFtZxmFMmb9R1Ssi3IwKBgQCFMxtxnmn11S26YF5v\nFr+KUMIXx6uSTvEL2jBygJ1J6MKDudSWgHJbkrNcu7oE9wMzeJjoE6XpSkOfQxWX\nUekD0aXEED97ZiLTGdLksk5qSX7ARywexdo8564F1ol/Qhsh/uxksTMORJssc+fs\naARDTj9kcn4YDgdytfq8PLue6w==\n-----END PRIVATE KEY-----\n"}

  setAuth = () ->
    		doc.useServiceAccountAuth(creds, (err) -> console.log(err))

  setAuth()

  addRowDoc = (data) ->
    doc.addRow('od6', data, (err, info) -> console.log(err))

  robot.hear /\+todo/i, (res) ->
    messageText = res.message.text.indexOf(' ')+1
    assignees = res.message.text.substr(messageText).match(/(@.*\s)/)
    if !assignees
      assignees = "none"
    else
      assignees = assignees[0].trim()
    if messageText
      addRowDoc({"action": " +todo", "timestamp": new Date().toLocaleString(), "poster": res.message.user.name, "assignees": assignees, "message": res.message.text.substr(messageText)})
      res.send "Todo saved with text: " + res.message.text.substr(messageText)
    else
      res.send "No parameter specified"
      # data = JSON.stringify({
      #   "description": "TODO",
      #   "public": true,
      #   "files": {
      #     "file1.txt": {
      #       "content": res.message.text.substr(res.message.text.indexOf(' ')+1)
      #     }
      #   }
      # })
      # robot.http("https://api.github.com/gists")
      #   .header('Content-Type', 'application/json')
      #   .header('Accept', 'application/vnd.github.v3+json')
      #   .post(data) (err, resp, body) ->
      #     this.body = JSON.parse(body)
      #     if err
      #       res.send "Encountered an error :( #{err}"
      #       return


  robot.hear /badger/i, (res) ->
    res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.respond /open the (.*) doors/i, (res) ->
    doorType = res.match[1]
    if doorType is "pod bay"
      res.reply "I'm afraid I can't let you do that."
    else
      res.reply "Opening #{doorType} doors"

  robot.hear /I like pie/i, (res) ->
    res.emote "makes a freshly baked pie"

  lulz = ['lol', 'rofl', 'lmao']

  robot.respond /lulz/i, (res) ->
    res.send res.random lulz

  robot.topic (res) ->
    res.send "#{res.message.text}? That's a Paddlin'"


  enterReplies = ['Hi', 'Target Acquired', 'Firing', 'Hello friend.', 'Gotcha', 'I see you']
  leaveReplies = ['Are you still there?', 'Target lost', 'Searching']

  robot.enter (res) ->
    res.send res.random enterReplies
  robot.leave (res) ->
    res.send res.random leaveReplies

  answer = process.env.HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING

  robot.respond /what is the answer to the ultimate question of life/, (res) ->
    unless answer?
      res.send "Missing HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING in environment: please set and try again"
      return
    res.send "#{answer}, but what is the question?"

  robot.respond /you are a little slow/, (res) ->
    setTimeout () ->
      res.send "Who you calling 'slow'?"
    , 60 * 1000

  annoyIntervalId = null

  robot.respond /annoy me/, (res) ->
    if annoyIntervalId
      res.send "AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH"
      return

    res.send "Hey, want to hear the most annoying sound in the world?"
    annoyIntervalId = setInterval () ->
      res.send "AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH"
    , 1000

  robot.respond /unannoy me/, (res) ->
    if annoyIntervalId
      res.send "GUYS, GUYS, GUYS!"
      clearInterval(annoyIntervalId)
      annoyIntervalId = null
    else
      res.send "Not annoying you right now, am I?"


  robot.router.post '/hubot/chatsecrets/:room', (req, res) ->
    room   = req.params.room
    data   = JSON.parse req.body.payload
    secret = data.secret

    robot.messageRoom room, "I have a secret: #{secret}"

    res.send 'OK'

  robot.error (err, res) ->

    console.log(err)
    robot.logger.error "DOES NOT COMPUTE"

    if res?
      res.reply "DOES NOT COMPUTE"

  robot.respond /have a soda/i, (res) ->
    # Get number of sodas had (coerced to a number).
    sodasHad = robot.brain.get('totalSodas') * 1 or 0

    if sodasHad > 4
      res.reply "I'm too fizzy.."

    else
      res.reply 'Sure!'

      robot.brain.set 'totalSodas', sodasHad+1

  robot.respond /sleep it off/i, (res) ->
    robot.brain.set 'totalSodas', 0
    res.reply 'zzzzz'
