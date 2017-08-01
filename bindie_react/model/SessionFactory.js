var mysql = require('mysql');

/** Crea una conexion con la BBDD */
function createConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bindie"
    })
}

/** Realiza una query y cierra sesion. */
exports.query = function (sql, callback) {
    let con = createConnection();
    con.connect(err => {
        if (err) {
            callback(err);
        } else con.query(sql, (err, results) => {
            try {
                callback(err, results);
            } finally {
                con.end();
            }
        });
    });
};

exports.createConnection = createConnection;