var mysql = require('mysql');
var globalCfg = require('../GlobalConfig');

/** Obtiene los parametros de conexion del SERVER donde se aloja la BBDD. */
function getServerConnectionParams() {
    let connParams = {
        host: "localhost",
        user: "root",
        password: "root"
    };
    return connParams;
};

/** Obtiene los parametros de conexion de la BBDD principal */
function getDatabaseConnectionParams() {
    let connParams = getServerConnectionParams();
    if (globalCfg.profile) connParams.database = `bindie_${globalCfg.profile}`;
    return connParams;
};

/** Crea una conexion con el SERVIDOR de la bbdd. */
function createServerConnection() {
    return mysql.createConnection(getServerConnectionParams());
}

/** Crea una conexion con la BBDD del servidor */
function createDatabaseConnection() {
    return mysql.createConnection(getDatabaseConnectionParams());
}

/**
 * Realiza una query y cierra sesion.
 * @param {string} sql La query a ejecutar. 
 * @param {function} callback funcion a ejecutar.
 */
function query(sql, callback) {
    let con = createDatabaseConnection();
    con.connect(err => {
        if (err) return callback(err);
        con.query(sql, (err, results) => {
            try {
                callback(err, results);
            } finally {
                con.end();
            }
        });
    });
}


function createDatabase(callback) {
    let conParams = getServerConnectionParams();
    let database = getDatabaseConnectionParams().database;
    let sql = `CREATE DATABASE ${database}`;
    let con = createServerConnection();
    con.connect(err => {
        if (err) return callback(err);
        con.query(sql, (err, results) => {
            try {
                callback(err, results);
            } finally {
                console.log("CERRANDO SESION");
                con.end();
            }
        });
    });
}

function dropDatabase(callback) {
    let conParams = getDatabaseConnectionParams();
    query(`DROP DATABASE ${conParams.database}`, callback);
}

exports.query = query;

exports.createDatabaseConnection = createDatabaseConnection;

exports.createDatabase = createDatabase;

exports.dropDatabase = dropDatabase;

exports.getDatabaseConnectionParams = getDatabaseConnectionParams;