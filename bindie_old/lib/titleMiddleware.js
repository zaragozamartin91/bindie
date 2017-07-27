/*Establece un titulo por defecto en caso que no haya uno existente*/
module.exports = function(req, res, next) {
    if (req.title || res.locals.title) {
        return next();
    }

    req.title = res.locals.title = "Bindie";
    next();
};