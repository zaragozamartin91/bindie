var assert = require('assert');

var globalCfg = require('../GlobalConfig');
globalCfg.setProfile('test');

var SessionManager = require('../model/SessionManager');
var User = require('../model/User');

/* NO SE RECOMIENDA PASAR ARROW FUNCTIONS A MOCHA:
http://mochajs.org/#arrow-functions
 */

describe('User', function () {
    before(function (done) {
        SessionManager.createDatabase(function (err) {
            if (err) {
                console.error(err);
                done();
            } else User.createTable(function (err) {
                if (err) console.error(err);
                done();
            })
        })
    });

    describe('#create()', function () {
        it('debe crear un usuario en la BBDD', function (done) {
            let user = User.fromObject({ name: "martin", email: "mzaragoza@accusys", password: "pepe" });

            user.create(function (err, result) {
                if (err) {
                    console.error(err);
                    assert.fail("error al dar de alta usuario");
                }
                done();
            });
        });
    });

    describe("#getByEmail()", function () {
        it('debe obtener un usuario de la BBDD', function (done) {
            User.getByEmail('mzaragoza@accusys', function (err, users) {
                if (err) return assert.fail("Error la obtener el usuario de la BBDD");
                assert.equal(1, users.length);
                done();
            });
        });
    });

    after(function (done) {
        SessionManager.dropDatabase(function (err) {
            if (err) console.error(err);
            done();
        });
    });
});