import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
import assert from 'assert'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting

let expect = chai.expect


let helper = new Helper('../scripts/main.coffee')

describe('Messages parsing', function () {
    let msg
    let room
    let a
    let b
    beforeEach(function () {
        a = sinon.stub(messages, "sendMessage")
        b = sinon.stub(messages, "sendGist")
        room = helper.createRoom()
        msg = "+todo do @test this one"
    })

    afterEach(function () {
        room.destroy()
        a.restore()
        b.restore()
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
        let t = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        messages.formatMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.message, "do this")
        })
        t.restore()
    })

    it('Message Formatting, with tag in middle', function () {
        let t = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        messages.formatMessage({"text": "do +todo this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
        t.restore()
    })

    it('Message Formatting, with tag in the end', function () {
        let t = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        messages.formatMessage({"text": "do this +todo", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
        t.restore()
    })

    it('Gist formatting', function () {
        messages.formatGist({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.substr(0, 6), "todo, ")
        })
    })

    it('Typo in tag', function () {
        room.user.say('weirdguy', "+tod do this one").then(function () {
            assert.equal(a.callCount, 0)
            assert.equal(b.callCount, 0)
        })
    })

    it('Without typo in tag', function () {
        room.user.say('weirdguy', "+todo do this one").then(function () {
            assert.equal(a.callCount, 1)
            assert.equal(b.callCount, 1)
        })
    })

    it('Without any tag', function () {
        room.user.say('weirdguy', "do this one").then(function () {
            assert.equal(a.callCount, 0)
            assert.equal(b.callCount, 0)
        })
    })

    it('Tag in middle', function () {
        room.user.say('weirdguy', "do +todo this one").then(function () {
            assert.equal(a.callCount, 1)
            assert.equal(b.callCount, 1)
        })
    })

    it('Tag in the end', function () {
        room.user.say('weirdguy', "do this one +todo").then(function () {
            assert.equal(a.callCount, 1)
            assert.equal(b.callCount, 1)
        })
    })
});
