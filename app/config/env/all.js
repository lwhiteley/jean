'use strict';

module.exports = {
	app: {
		title: 'JEAN.JS',
		description: 'JWT, Express, API using Node.js',
		keywords: 'jwt, mongodb, express, node.js, mongoose, passport'
	},
	apiBase: '/api',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: process.env.APP_SECRET || 'JEAN has a big secret!',
	tokenExpiryInMinutes: 60*5
};
