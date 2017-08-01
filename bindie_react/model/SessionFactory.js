var mysql = require('mysql');

function getConnectionParams() {
    return {
        host: "localhost",
        user: "root",
        password: "root",
        database: "bindie"
    };
};

exports.getConnectionParams = getConnectionParams;

/** Crea una conexion con la BBDD */
function createConnection() {
    return mysql.createConnection(getConnectionParams());
}

/**
 * Realiza una query y cierra sesion.
 * @param {string} sql La query a ejecutar. 
 * @param {function} callback funcion a ejecutar.
 */
exports.query = function (sql, callback) {
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
};


exports.createConnection = createConnection;

