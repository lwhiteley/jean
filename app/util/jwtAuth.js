'use strict';

var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = require('../config/config');
var users = require('../../app/controllers/users');

module.exports.createSendToken = function (req, res) {
  var filteredUser = _.omit(req.user, ['password', 'salt']);
  var options = {
    expiresInMinutes: config.tokenExpiryInMinutes
    //audience: audience
  };
  var token = jwt.sign(filteredUser, config.sessionSecret, options);

  var responsePayload = {
    token: token
  };
  res.status(200).send(responsePayload);
};

module.exports.filterUserSensitiveData = function(user, fields){
  if(_.isObject(user) && _.isArray(fields)){
    var filteredUser = _.omit(user, fields);
    return filteredUser;
  }
  return user;
};
