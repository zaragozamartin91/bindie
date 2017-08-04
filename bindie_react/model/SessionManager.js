const mysql = require('mysql');
const globalCfg = require('../GlobalConfig');

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

/** CLASE QUE MANEJARA EL POOL DE CONEXIONES */
function ConnectionPool() {
    this.pool = null;
}
/**
 * Construye la connection pool. Esta funcion debe invocarse la primera vez que se 
 * importa el modulo de manejo de sesiones.
 * @param {number} connectionLimit Limite de conexiones que manejara el pool.
 */
ConnectionPool.prototype.build = function (connectionLimit) {
    /* SI EL POOL YA FUE CREADO, NO SE CREA NUEVAMENTE */
    if (this.pool) return;

    connectionLimit = connectionLimit || 10;

    let connParams = getDatabaseConnectionParams();
    this.pool = mysql.createPool({
        connectionLimit: connectionLimit,
        host: connParams.host,
        user: connParams.user,
        password: connParams.password,
        database: connParams.database
    });
};
const connectionPool = new ConnectionPool();


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
    /* SI HAY UN POOL DE CONEXIONES DISPONIBLE, LO USO */
    if (connectionPool.pool) {
        let pool = connectionPool.pool;
        pool.query(sql, callback);
    } else {
        /* SI NO HAY POOL ABRO Y CIERRO LAS CONEXIONES */
        let con = createDatabaseConnection();
        con.connect(err => {
            if (err) return callback(err);
            con.query(sql, (err, results) => {
                con.end();
                callback(err, results);
            });
        });
    }
}


function createDatabase(callback) {
    let conParams = getServerConnectionParams();
    let database = getDatabaseConnectionParams().database;
    let sql = `CREATE DATABASE ${database}`;
    let con = createServerConnection();

    con.connect(err => {
        if (err) return callback(err);
        con.query(sql, (err, results) => {
            con.end();
            callback(err, results);
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

exports.connectionPool = connectionPool;