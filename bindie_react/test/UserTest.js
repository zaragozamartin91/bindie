var assert = require('assert');

var globalCfg = require('../GlobalConfig');
globalCfg.setProfile('test');

var SessionManager = require('../model/SessionManager');
SessionManager.connectionPool.build(10);
var User = require('../model/User');

/* NO SE RECOMIENDA PASAR ARROW FUNCTIONS A MOCHA:
http://mochajs.org/#arrow-functions
 */

describe('User', function () {
    before(function (done) {
        SessionManager.createDatabase(function (err) {
            if (err) return done(err);
            User.createTable(function (err) {
                if (err) return done(err);
                done();
            })
        })
    });

    describe('#create()', function () {
        it('debe crear un usuario en la BBDD', function (done) {
            let user = User.fromObject({ 
                name: "martin", email: "mzaragoza@accusys", password: "pepe" 
            });

            user.create(function (err, result) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe("#getByEmail()", function () {
        it('debe obtener un usuario de la BBDD', function (done) {
            User.getByEmail('mzaragoza@accusys', function (err, users) {
                if (err) return done(err);
                assert.equal(1, users.length);
                assert.equal('mzaragoza@accusys', users[0].email);
                done();
            });
        });

        it('no debe encontrar usuarios con mail equivocado', function (done) {
            User.getByEmail('asd@asd', function (err, users) {
                if (err) return done(err);
                assert.equal(0, users.length);
                done();
            });
        });
    });

    after(function (done) {
        SessionManager.dropDatabase(function (err) {
            if (err) return done(err);
            done();
        });
    });
});