var SessionFactory = require('./SessionFactory');
var _ = require('underscore');
var bcrypt = require('bcryptjs');

/* ------------------------------------------------------------------------------------------- */

const TABLE_NAME = 'users';


/**
 * Crea un usuario.
 * @class
 * 
 * @param {number} id Id del usuario.
 * @param {string} name Nombre.
 * @param {string} email  Email.
 * @param {string} password  Password.
 */
function User(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password
};

/**
 * Crea un usuario a partir de un objeto.
 * 
 * @param {any} obj Objeto con propiedades de usuario.
 * @return {User} Nuevo usuario.
 */
User.fromObject = function (obj) {
    return new User(obj.id, obj.name, obj.email, obj.password);
};


User.createTable = function () {
    let sql = `CREATE TABLE ${TABLE_NAME} (
            id MEDIUMINT NOT NULL AUTO_INCREMENT, 
            name VARCHAR(64) NOT NULL, 
            email VARCHAR(64) NOT NULL, 
            password VARCHAR(255),
            PRIMARY KEY (id)
        )`;

    SessionFactory.query(sql, (err, results) => {
        if (err) console.error(err);
        else console.log(results);
    });
};

User.dropTable = function () {
    let sql = `DROP TABLE ${TABLE_NAME}`;

    SessionFactory.query(sql, (err, results) => {
        if (err) console.error(err);
        else console.log(results);
    });
};

/**
 * Obtiene usuarios a partir de un correo.
 * 
 * @param {string} email Correo de los usuarios buscados.
 * @param {function} callback Funcion a invocar con los resultados.
 * @return {Array.<User>} {{description}}{{}}
 */
User.getByEmail = function (email, callback) {
    let sql = `SELECT * FROM ${TABLE_NAME} WHERE email='${email}'`;
    SessionFactory.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(err, _.map(results, User.fromObject));
    });
};


User.prototype.create = function (callback) {
    User.getByEmail(this.email, (err, users) => {
        if (err) return callback(err);
        if (users.length) return callback(
            new Error(`Ya existe un usuario con el email ${this.email}`));

        let hash = bcrypt.hashSync(this.password, 10);
        let sql = `INSERT INTO ${TABLE_NAME}(name,email,password) 
                VALUES('${this.name}', '${this.email}', '${hash}')`;
        SessionFactory.query(sql, callback);
    });
};

/**
 * Elimina el password del usuario.
 * @return {User} this.
 */
User.prototype.passwordLess = function () {
    this.password = null;
    return this;
};

User.prototype.authenticate = function (callback) {
    User.getByEmail(this.email, (err, users) => {
        if (err) return callback(err);

        let hash = users[0].password;
        let isValid = bcrypt.compareSync(this.password, hash);

        if (isValid) return callback(err, users[0]);
        else return callback(new Error('El password es invalido'));
    });
};

module.exports = User;