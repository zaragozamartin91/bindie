var SessionFactory = require('./SessionFactory');
var _ = require('underscore');
var bcrypt = require('bcryptjs');

/* ------------------------------------------------------------------------------------------- */

const TABLE_NAME = 'users';

const User = function (id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password
};

User.fromObject = function (obj) {
    return new User(obj.id, obj.name, obj.email, obj.password);
};

User.createTable = function () {
    let con = SessionFactory.createConnection();
    con.connect(err => {
        if (err) throw err;
        let sql = `CREATE TABLE ${TABLE_NAME} (
            id MEDIUMINT NOT NULL AUTO_INCREMENT, 
            name VARCHAR(64) NOT NULL, 
            email VARCHAR(64) NOT NULL, 
            password VARCHAR(255),
            PRIMARY KEY (id)
        )`;
        con.query(sql, (err, results) => {
            try {
                if (err) throw err;
                console.log(results);
            } finally {
                con.end();
            }
        });
    });
};

User.dropTable = function () {
    let con = SessionFactory.createConnection();
    con.connect(err => {
        if (err) throw err;
        let sql = `DROP TABLE ${TABLE_NAME}`;
        con.query(sql, (err, results) => {
            try {
                if (err) throw err;
                console.log(results);
            } finally {
                con.end();
            }
        });
    });
};

User.getByEmail = function (email, callback) {
    let sql = `SELECT * FROM ${TABLE_NAME} WHERE email='${email}'`;
    SessionFactory.query(sql, (err, results) => {
        if (err) {
            callback(err, []);
        } else {
            callback(err, _.map(results, User.fromObject));
        }
    });
};

User.prototype.create = function (callback) {
    User.getByEmail(this.email, (err, users) => {
        if (err) {
            callback(err);
        } else if (users.length) {
            callback(new Error(`Ya existe un usuario con el email ${this.email}`));
        } else {
            //let salt = bcrypt.genSaltSync(10);
            //let hash = bcrypt.hashSync("B4c0/\/", salt);
            let hash = bcrypt.hashSync(this.password, 10);
            let sql = `INSERT INTO ${TABLE_NAME}(name,email,password) 
                VALUES('${this.name}', '${this.email}', '${hash}')`;
            SessionFactory.query(sql, callback);
        }
    });
};

module.exports = User;