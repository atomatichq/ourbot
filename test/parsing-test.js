import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
import assert from 'assert'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting
let milestone = require('../scripts/milestone.js')

let expect = chai.expect

let scriptHelper = new Helper('./scripts/specific-script.coffee')
let helper = new Helper('../scripts/main.js')

describe('Messages parsing', function () {
    let msg
    let room
    let sendMsg
    let sendGst
    let getRoom
    let createMilestone
    let createMilestoneAll
    let closeMilestone
    let closeMilestoneAll
    beforeEach(function () {
        createMilestone = sinon.stub(milestone, "createMilestone")
        createMilestoneAll = sinon.stub(milestone, "createMilestoneAll")
        closeMilestone = sinon.stub(milestone, "closeMilestone")
        closeMilestoneAll = sinon.stub(milestone, "closeMilestoneAll")
        sendMsg = sinon.stub(messages, "sendMessage")
        sendGst = sinon.stub(messages, "sendGist")
        getRoom = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        room = helper.createRoom()
        msg = "+todo do @test this one"
    })

    afterEach(function () {
        room.destroy()
        createMilestone.restore()
        createMilestoneAll.restore()
        closeMilestone.restore()
        closeMilestoneAll.restore()
        sendMsg.restore()
        sendGst.restore()
        getRoom.restore()
    })
  
    it('create milestion', function () {
        return room.user.say('mikanebu', "bot create milestone 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(createMilestone.callCount, 1)
        })
    })
    it('create milestion with typo', function () {
        return room.user.say('mikanebu', "bot create milestones 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('create milestion with invalid format', function () {
        return room.user.say('mikanebu', "bot milestone 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('create milestion with invalid title format', function () {
        return room.user.say('mikanebu', "bot create milestone 13 XYZ 2018 datahq/docs").then(function () {
            assert.equal(createMilestone.callCount, 0)
            assert.equal(room.messages[1][1], "@mikanebu Title format is invalid")
            assert.equal((room.messages).length, 2)
        })
    })
    
    it('create milestion all', function () {
        return room.user.say('mikanebu', "bot create milestone 13 Jan 2018").then(function () {
            assert.equal(createMilestoneAll.callCount, 1)
        })
    })
    it('create milestion all with typo', function () {
        return room.user.say('mikanebu', "bot created milestone 13 Jan 2018").then(function () {
            assert.equal(createMilestoneAll.callCount, 0)
        })
    })
    it('create milestion all with invalid format', function () {
        return room.user.say('mikanebu', "bot milestone 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(createMilestoneAll.callCount, 0)
        })
    })
    it('create milestion All with invalid title format', function () {
        return room.user.say('mikanebu', "bot create milestone 13 XYZ 2018").then(function () {
            assert.equal(createMilestoneAll.callCount, 0)
            assert.equal(room.messages[1][1], "@mikanebu Title format is invalid")
            assert.equal((room.messages).length, 2)
        })
    })
    it('close milestion', function () {
        return room.user.say('mikanebu', "bot close milestone 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(closeMilestone.callCount, 1)
        })
    })
    it('close milestion with typo', function () {
        return room.user.say('mikanebu', "bot2 close milestone 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(closeMilestone.callCount, 0)
        })
    })
    it('close milestion with invalid format', function () {
        return room.user.say('mikanebu', "bot close milestone test 13 Jan 2018 datahq/docs").then(function () {
            assert.equal(closeMilestone.callCount, 0)
        })
    })
    it('close milestion with invalid title format', function () {
        return room.user.say('mikanebu', "bot create milestone 13 XYZ 2018").then(function () {
            assert.equal(closeMilestone.callCount, 0)
            assert.equal(room.messages[1][1], "@mikanebu Title format is invalid")
            assert.equal((room.messages).length, 2)
        })
    })
    it('close milestion all', function () {
        return room.user.say('mikanebu', "bot close milestone 13 Jan 2018").then(function () {
            assert.equal(closeMilestoneAll.callCount, 1)
        })
    })
    it('close milestion all with typo', function () {
        return room.user.say('mikanebu', "bot closing milestone 13 Jan 2018").then(function () {
            assert.equal(createMilestoneAll.callCount, 0)
        })
    })
    it('create milestion all with invalid format', function () {
        return room.user.say('mikanebu', "bot milestone 13 Jan 2018 datahq/docs all").then(function () {
            assert.equal(createMilestoneAll.callCount, 0)
        })
    })
    it('close milestion all with invalid title format', function () {
        return room.user.say('mikanebu', "bot create milestone 13 XYZ 2018").then(function () {
            assert.equal(closeMilestoneAll.callCount, 0)
            assert.equal(room.messages[1][1], "@mikanebu Title format is invalid")
            assert.equal((room.messages).length, 2)
        })
    })
    
    it('return +todo gdocs url', function () {
      return room.user.say('mikanebu', "bot todos").then(function () {
        assert.equal(room.messages[1][1].substr(0, 14), "@mikanebu http")
        assert.equal((room.messages).length, 2)
      })
    })
    it('starting with bot should reply help message', function () {
      return room.user.say('mikanebu', "bot help").then(function () {
        assert.equal(room.messages[1][1].substr(0, 12), "@mikanebu Hi")
        assert.equal((room.messages).length, 2)
      })
    })

    it('starting with /bot should reply help message', function () {
      return room.user.say('mikanebu', "/bot help").then(function () {
        assert.equal(room.messages[1][1].substr(0, 12), "@mikanebu Hi")
        assert.equal((room.messages).length, 2)
      })
    })

    it('only word bot should reply help message', function () {
      return room.user.say('mikanebu', "bot").then(function () {
        assert.equal(room.messages[1][1].substr(0, 12), "@mikanebu Hi")
        assert.equal((room.messages).length, 2)
      })
    })

    it('only word /bot should reply help message', function () {
      return room.user.say('mikanebu', "/bot").then(function () {
        assert.equal(room.messages[1][1].substr(0, 12), "@mikanebu Hi")
        assert.equal((room.messages).length, 2)
      })
    })

    it('containing not only bot should not reply help message', function () {
      return room.user.say('mikanebu', "bot test").then(function () {
        assert.equal((room.messages).length, 1)
      })
    })

    it('ending with bot should not reply help message', function () {
      return room.user.say('mikanebu', "our friend is bot").then(function () {
        assert.equal((room.messages).length, 1)
      })
    })

    it('having bot in the middle of sentence should not reply help message', function () {
      return room.user.say('mikanebu', "this is our bot for DataHub").then(function () {
        assert.equal((room.messages).length, 1)
      })
    })

    it('Action getting', function () {
        assert.equal(formatting.getDataMask(msg, /\+[^*\s]+/), "+todo")
    })

    it('Action remove from message', function () {
        assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\+[^*\s]+/)), "do @test this one")
    })

    it('Assignees getting', function () {
        assert.equal(formatting.getDataMask(msg, /\@[^*\s]+/), "@test")
    })

    it('Assignees removing from message', function () {
        assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/)), "+todo do this one")
    })

    it('Action and Assignees removing from message', function () {
        let tmp = formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/))
        assert.equal(formatting.removeFromMessage(tmp, formatting.getDataMask(tmp, /\+[^*\s]+/)), "do this one")
    })

    it('Name getting', function () {
        assert.equal(formatting.getName("Test (@test)"), "Test")
    })

    it('Message Formatting', function () {
        messages.formatMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.message, "do this")
        })
    })

    it('Message Formatting, with tag in middle', function () {
        messages.formatMessage({"text": "do +todo this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
    })

    it('Message Formatting, with tag in the end', function () {
        messages.formatMessage({"text": "do this +todo", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
    })

    it('Gist formatting', function () {
        messages.formatGist({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.substr(0, 5), "todo,")
        })
    })

    it('Typo in tag', function () {
        return room.user.say('weirdguy', "+tod do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Without typo in tag', function () {
        return room.user.say('weirdguy', "+todo do this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Without any tag', function () {
        return room.user.say('weirdguy', "do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Tag in middle', function () {
        return room.user.say('weirdguy', "do +todo this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Tag in the end', function () {
        return room.user.say('weirdguy', "do this one +todo").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
});