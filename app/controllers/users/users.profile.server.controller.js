'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

var jwtUtil = require('../../util/jwtAuth');
/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	req.body = _.omit(req.body, ['roles']);

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						user = jwtUtil.filterUserSensitiveData(req.user,
							['password', 'salt', 'iat', 'exp', 'aud', 'iss']);
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	var user = jwtUtil.filterUserSensitiveData(req.user,
																		['password', 'salt', 'iat', 'exp', 'aud', 'iss']);

	res.jsonp(user);
};

exports.getUserByID = function(id){
	//console.log(id);
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) console.log(err);
		return user;
	});

};
