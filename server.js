'use strict';

require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var routes = require('./app/routes/index');
var app = express();

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HelloMongoose';


mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('[url-shortener] connected to databse! Now starting server');
    app.use(express.static(process.cwd() + '/public'));
    
    routes(app, db);

    app.listen((process.env.PORT || 3000), function () {
        if(process.env.PORT){
            console.log('[url-shortener] Node.js listening on port ' + process.env.PORT + '...');
        } else {
            console.log('[url-shortener] Node.js listening on port 3000...');
        }
    });
});

