var assert = require('assert');

var globalCfg = require('../GlobalConfig');
globalCfg.setProfile('test');

var SessionFactory = require('../model/SessionFactory');

var User = require('../model/User');

/* NO SE RECOMIENDA PASAR ARROW FUNCTIONS A MOCHA:
http://mochajs.org/#arrow-functions
 */

describe('User', function () {
    before(function () {
        SessionFactory.dropDatabase();
        SessionFactory.createDatabase();
    });

    describe('#create()', function () {
        it('debe crear un usuario en la BBDD', function () {
            let user = User.fromObject({ name: "martin", email: "mzaragoza@accusys", password: "pepe" });

            user.create(function (err, result) {
                if (err) return assert.fail('Error al dar de alta el usuario');
                
                User.getByEmail("mzaragoza@accusys", function (err, users) {
                    assert.equal(1, users[0].length);
                    assert.equal(users[0].email, "mzaragoza@accusys");
                    done();
                });
            });
        });
    });

    after(function () {
        SessionFactory.dropDatabase();
    });
});