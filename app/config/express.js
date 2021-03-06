'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	helmet = require('helmet'),
	passport = require('passport'),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path');

var log4js = require('log4js');
var logger = log4js.getLogger('express');

var jwt = require('express-jwt');
var jwtCheck = jwt({
	secret: config.sessionSecret
});


module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	//var jwtUtil = require('../util/jwtAuth');


	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});


	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: ':method :status :url ' }));
		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
		//app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: ':method :status :url ' }));
	}

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());


	// Enable jsonp
	app.enable('jsonp callback');

	app.use(passport.initialize());

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

		next();
	});
	app.use(cors());

	// connect flash for flash messages

	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Set up JWT for Express
	app.use(config.apiBase, jwtCheck);

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error object
		res.status(500).jsonp({
			error: err
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).jsonp({
			url: req.originalUrl,
			error: 'Not Found'
		});
	});
	return app;
};
