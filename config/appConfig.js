/*these are the configurations for process.env.NODE_ENV == 'development'*/
//-------------------------------------------------------------------------------

/*The express-session module
will use a cookie-stored, signed identifier to identify the current user. To sign the
session identifier, it will use a secret string, which will help prevent malicious session
tampering. For security reasons, it is recommended that the cookie secret be different
for each environment*/

/*la URL de conexion de mongo es de la forma: mongodb://username:password@hostname:port/database*/

module.exports = {
    db: 'mongodb://localhost/bindie',
    sessionSecret: 'developmentSessionSecret'
};