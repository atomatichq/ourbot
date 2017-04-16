import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
let messages = require('../scripts/messages.js').messages

let expect = chai.expect


let helper = new Helper('../scripts/main.coffee')

describe('Messages parsing', function () {
    let save
    beforeEach(function () {
        this.room = helper.createRoom()

    })

    afterEach(function () {
        this.room.destroy()
    })

    it('+todo message', function () {
        save = sinon.stub(messages, 'sendGist').callsFake(function (mess, dest, callback) {
            sinon.assert.calledOnce(save)
        })
        this.room.user.say('alice', '+todo @test do this')
    })

    it('+standup message', function () {
        save = sinon.stub(messages, 'sendMessage').callsFake(function (mess, dest, callback) {
            sinon.assert.calledOnce(save)
        })
        this.room.user.say('alice', '+standup @test do this')
    })
});
