
var express = require('express');
var	fs = require('fs');
var	http = require('http');
var	bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');

var adhs_config = {};
adhs_config.app_key = 'akuzrazljdqgttli3fv569zttgg5iyhh';
adhs_config.app_secret = 'af5gtgkiopv8bzlbmcpf6pvnytm9rklt';
adhs_config.ewebrtc_domain = 'attwebrtc.com';
adhs_config.api_env = 'sandbox';

console.info('-----------------------------------------------------------');
console.info('...Attempting to use configuration...');
console.info('-----------------------------------------------------------');
console.info('       App Key: ', adhs_config.app_key);
console.info('    App Secret: ', adhs_config.app_secret);
console.info('eWebRTC Domain: ', adhs_config.ewebrtc_domain);
console.info('-----------------------------------------------------------');

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 9001;

adhs_config.host = host;
adhs_config.port = port;

var app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(__dirname + '/public'));

app.get('/locate', function(req, res) {

	var google_geocoding = require('google-geocoding');

	google_geocoding.geocode(req.query.address, function(err, location) {
	    if (err || !location)
        {
	        console.log('Error: ' + err);
	        res.status(500).send(err);
	    }
        else
        {
	        console.log('Latitude: ' + location.lat + ' ; Longitude: ' + location.lng);

			var api = require("sunlight-congress-api");

			var success = function(data){
				console.log(data);
				res.send(data);
			}

			api.init("a72e271c2c704854b6359dba4b9e5485");
			api.legislatorsLocate().filter("latitude", location.lat).filter("longitude", location.lng).call(success);
	    }
	});

});

app.get('/message', function(req, res) {

    try
    {
        var message = "Hi, I am a constituent. Please call me back at your convenience." +
            "My message is time sensitive. I am calling to ask you to attend " +
            "a Congressional briefing on Sep.21st, International Peace Day, " +
            "on my behalf ask your constituent. Children from Palestinian villages " +
            "at risk of demolition in the West Bank will be presenting their 'Pinwheels for Peace'  . " +
            "Please hear what peace means to them and then make two calls on my behalf " +
            "to halt demolitions and press for due process to keep their homes and their villages standing.";

        if (!req.query.lang || req.query.lang === 'en')
        {
            res.send({message: message, lang: 'en'});
            return;
        }

        var translation = require('./translation');

        translation(message, req.query.lang, function (err, result)
        {
            if (err)
            {
                console.log('error:', err);
                res.status(500).send({error: err});
            }
            else
            {
                console.log(JSON.stringify(result, null, 2));
                res.send({message: result.translations[0].translation, lang: req.query.lang});
            }
        })
    }
    catch (err)
    {
        res.status(500).send({error: err});
    }
});

var adhs = require('att-dhs'); // Note the hyphen in require
adhs.configure(adhs_config);
adhs.use('router', {server: app}); // 2nd arg will change to {app: app} in next release

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen( port, host, function() {
	console.log('server listening on port ' , port);
});
