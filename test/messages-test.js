import Gists from 'gists'
import GoogleSpreadsheet from 'google-spreadsheet'
import async from 'async'
import chai from 'chai'
import sinon from 'sinon'
let messages = require('../scripts/messages.js').messages


describe('Google Docs and Gists Logging', function () {
    let save

    beforeEach(function () {
        save = null
    })

    it('Formatting message', function () {
        save = sinon.stub(messages, 'getRoom').callsFake(function (roomId, callback) {
            sinon.assert.calledOnce(save)
            callback("testname")
        })

        messages.formatMessage({"text": "+todo @test this", "room": "testingName", "user": {"name": "test", "login": "test"}}, function (data) {
        })
        save.reset()
    })

    it('GDoc Logging', function () {
        save = sinon.stub(messages, 'formatMessage').callsFake(function (message, callback) {
            sinon.assert.calledOnce(save)
        })
        messages.sendMessage({"text": "+todo @test this", "user":{"name": "test", "login": "test"}}, "gdoc", function (data) {

        })
        save.reset()
    })

    it('Gists Logging', function () {
        save = sinon.stub(new Gists(), 'download').callsFake(function (dest, callback) {
            sinon.assert.calledOnce(save)
        })

        messages.sendGist({"text": "+todo @test this", "user":{"name": "test", "login": "test"}}, "gdoc", function (data) {

        })
        save.reset()
    })

})
