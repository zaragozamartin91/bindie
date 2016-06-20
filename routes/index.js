exports.config = function(app) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        console.log("RENDERING TITLE...");

        res.render('index', {
            title: 'Bindie'
        });
    });

};