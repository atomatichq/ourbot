import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
import assert from 'assert'
let messages = require('../scripts/messages.js').messages

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
        assert.equal(messages.getAction(msg), "+todo")
    })

    it('Action remove from message', function () {
        assert.equal(messages.removeFromMessage(msg, messages.getAction(msg)), "do @test this one")
    })

    it('Assignees getting', function () {
        assert.equal(messages.getAssignees(msg), "@test")
    })

    it('Assignees removing from message', function () {
        assert.equal(messages.removeFromMessage(msg, messages.getAssignees(msg)), "+todo do this one")
    })

    it('Action and Assignees removing from message', function () {
        let tmp = messages.removeFromMessage(msg, messages.getAction(msg))
        assert.equal(messages.removeFromMessage(tmp, messages.getAssignees(tmp)), "do this one")
    })

    it('Name getting', function () {
        assert.equal(messages.getName("Test (@test)"), "Test")
    })

    // it('+todo message', function () {
    //     save = sinon.stub(messages, 'sendGist').callsFake(function (mess, dest, callback) {
    //         sinon.assert.calledOnce(save)
    //     })
    //     this.room.user.say('alice', '+todo @test do this')
    // })
    //
    // it('+todo message not parsed', function () {
    //     save = sinon.stub(messages, 'sendGist').callsFake(function (mess, dest, callback) {
    //
    //     })
    //     this.room.user.say('alice', '@test do this')
    //     sinon.assert.notCalled(save)
    // })
    //
    // it('+standup message', function () {
    //     save = sinon.stub(messages, 'sendMessage').callsFake(function (mess, dest, callback) {
    //         sinon.assert.calledOnce(save)
    //     })
    //     this.room.user.say('alice', '+standup @test do this')
    // })
});
