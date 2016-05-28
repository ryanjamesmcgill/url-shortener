'use strict';

var UrlShorter = require(process.cwd()+'/app/controllers/urlshorter');

var routes = function(app, db){
    var urlShorter = new UrlShorter(db);

    app.route('/')
        .get(function(req, res){
            res.sendFile(process.cwd() + '/index.html');
        });

    app.use(function(req,res,next){
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        });
        next();
    });

    app.route('/api/version')
        .get(function(req, res){
            res.send(JSON.stringify(process.versions));
        });

    app.route('/api/geturls')
        .get(urlShorter.getUrls);

    app.use(function(req, res, next){
        var baseUrl = req.protocol + '://' + req.get('host') + '/';
        req.baseUrl = baseUrl;
        next();
    });

    app.route('/new/*')
        .get(urlShorter.addNewUrl);

    app.route('/:hash_id')
        .get(urlShorter.redirectUrl);

    app.use(function(req, res) {
        res.status(404).send("uh-oh! Could not find that..");
    });
};

module.exports = routes;