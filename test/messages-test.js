import async from 'async'
import chai from 'chai'
var messages = require('../scripts/messages.js').messages


describe('auth and messages test', function () {
    this.timeout(15000);
    it('authenticate', function(done) {
        let testPromise = new Promise(function(resolve, reject) {
            messages.setAuth(function (err, res) {
                resolve(res)
            })
        })

        testPromise.then(function(res) {
            try {
                chai.expect(res[1]).to.exist;
                done()
            } catch(err) {
                done(err);
            }
        }, done)
    })
    it('message send', function (done) {
        let testPromise = new Promise(function(resolve, reject) {
            messages.setAuth(function (err, res) {
                resolve(res)
            })
        })

        testPromise.then(function(res) {
            messages.sendMessage({
                            text: "+todo @assignees some text",
                            user: {
                                name: "Artem (weirdGuy)",
                                login: "weirdGuy"
                            }
                        }, (r) => {
                            chai.expect(r.content).to.exist;
                            done()
                        })
        }, done)
    })

})
