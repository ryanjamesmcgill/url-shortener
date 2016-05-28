var validator = require('validator');
var shorthash = require('shorthash');
var Url = require('../models/urls');

function UrlShorter(db){

    this.addNewUrl = function(req, res){
        var original_url = req.url.slice(5);
        if (!validator.isURL(original_url)) {
            res.send({error: 'Wrong url format, make sure you have a valid protocol and real site',
                original_url: original_url,
                short_url:null});
            return;
        }
        var hash_id = shorthash.unique(original_url);

        var url = new Url({
            original_url: original_url,
            hash_id: hash_id
        });

        var returnJson = {original_url: original_url, short_url: req.baseUrl+hash_id};
        Url.count({original_url: original_url, hash_id: hash_id},
            function(err, count){
                if (err) return console.error(err);
                if (count > 0){
                    res.send(returnJson);
                } else {
                    url.save(function(err, url){
                        if (err) return console.error(err);
                        res.send(returnJson);
                    });
                }

            });
    };


    this.getUrls = function(req, res){
        Url.find(function(err, urls){
            if (err) return consoel.error(err);
            res.send(urls);
        });
        
    };

    this.redirectUrl = function(req, res){
        var hash_id = req.params.hash_id;
        Url.findOne({hash_id: hash_id},
            function(err, url_model){
                if (err) return console.error(err);
                if (url_model){
                    res.redirect(url_model.original_url);
                } else {
                    res.status(404).send({error:"This url is not in the database."});
                }
            });
    };

};

module.exports = UrlShorter;