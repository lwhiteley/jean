'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/config');
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');

	// Setting up the users profile api
	app.route(config.apiBase + '/users/me').get(users.me);
	app.route(config.apiBase + '/users').put(users.update);

	// Setting up the users password api
	app.route(config.apiBase + '/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
