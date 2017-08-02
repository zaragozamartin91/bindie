var mysql = require('mysql');
var globalCfg = require('../GlobalConfig');

/** Obtiene los parametros de conexion de la BBDD principal */
function getConnectionParams() {
    let connParams = {
        host: "localhost",
        user: "root",
        password: "root",
        database: "bindie"
    };
    if (globalCfg.profile) connParams.database = `bindie_${globalCfg.profile}`;
    return connParams;
};


/** Crea una conexion con la BBDD */
function createConnection() {
    return mysql.createConnection(getConnectionParams());
}

/**
 * Realiza una query y cierra sesion.
 * @param {string} sql La query a ejecutar. 
 * @param {function} callback funcion a ejecutar.
 */
function query(sql, callback) {
    let con = createConnection();
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


function createDatabase() {
    let conParams = getConnectionParams();
    let sql = `CREATE DATABASE ${conParams.database}`;
    query(sql, (err, results) => {
        if (err) return console.error(err);
        console.log(results);
    })
}

function dropDatabase() {
    let conParams = getConnectionParams();
    query(`DROP DATABASE ${conParams.database}`, (err, results) => {
        if (err) return;
        console.log(results);
    });
}

exports.query = query;

exports.createConnection = createConnection;

exports.createDatabase = createDatabase;

exports.dropDatabase = dropDatabase;

exports.getConnectionParams = getConnectionParams;