import Gists from 'gists'
import GoogleSpreadsheet from 'google-spreadsheet'
import Gitter from 'node-gitter'
import async from 'async'
import chai from 'chai'
import sinon from 'sinon'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting


describe('Google Docs and Gists Logging', function () {

    // let format
    // let auth
    // let log
    // beforeEach(function () {
    //     format = sinon.stub(formatting, "getRoom").resolves({"name": "test"})
    //     auth = sinon.stub(async, "series").callsFake(function (arr, cb) {
    //         cb(null, {"worksheets":[{"id":"1"}]})
    //     })
    //     log = sinon.stub(GoogleSpreadsheet)
    // })
    //
    // afterEach(function () {
    //     format.restore()
    //     auth.restore()
    //     log.restore()
    // })
    //
    // it('Message sending', function () {
    //
    //     messages.sendMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, "me", function (info) {
    //         console.log(info)
    //     })
    // })
    // let save
    //
    // beforeEach(function () {
    //     save = null
    // })
    //
    // afterEach(function () {
    //     save.restore()
    // })
    //
    // it('Formatting gist', function () {
    //
    //     console.log(Gitter.prototype)
    //     save = sinon.stub(Gitter.prototype.rooms, 'find').callsFake(function (id, cb) {
    //         cb({"name": "testRoom"})
    //     })
    //
    //     messages.formatMessage({"text": "+todo @test this", "room": "testingName", "user": {"name": "test", "login": "test"}}, function (data) {
    //         console.log(data)
    //     })
    // })
    //
    // it('Formatting message', function () {
    //     save = sinon.stub(messages, 'getRoom').callsFake(function (roomId, callback) {
    //         //sinon.assert.calledOnce(save)
    //         callback("testname")
    //     })
    //
    //     messages.formatMessage({"text": "+todo @test this", "room": "testingName", "user": {"name": "test", "login": "test"}}, function (data) {
    //         console.log(data)
    //     })
    // })
    //
    // it('GDoc Logging', function () {
    //     save = sinon.stub(messages, 'formatMessage').callsFake(function (message, callback) {
    //         sinon.assert.calledOnce(save)
    //     })
    //     messages.sendMessage({"text": "+todo @test this", "user":{"name": "test", "login": "test"}}, "gdoc", function (data) {
    //
    //     })
    // })
    //
    // it('Gists Logging', function () {
    //     save = sinon.stub(new Gists(), 'download').callsFake(function (dest, callback) {
    //         sinon.assert.calledOnce(save)
    //     })
    //
    //     messages.sendGist({"text": "+todo @test this", "user":{"name": "test", "login": "test"}}, "gdoc", function (data) {
    //
    //     })
    // })

})
