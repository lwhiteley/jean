'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	jwt = require('jsonwebtoken'),
	User = mongoose.model('User');

var jwtUtil = require('../../util/jwtAuth');

var filterUserSensitiveData = function(user){
	if(_.isObject(user)){
		var filteredUser = _.omit(user, ['password', 'salt']);
		return filteredUser;
	}
	return user;
};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user = filterUserSensitiveData(user);

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					//console.log(req.user);
					jwtUtil.createSendToken(req, res);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user = filterUserSensitiveData(user);

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					//res.jsonp(user);
					//return done(null, user);
					//console.log(req.user);
					jwtUtil.createSendToken(req, res);
				}
			});
		}
	})(req, res, next);
};
