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
    beforeEach(function () {
        this.room = helper.createRoom()
        msg = "+todo do @test this one"
    })

    afterEach(function () {
        this.room.destroy()
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
        sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        messages.formatMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.message, "do this")
        })

    })
});
