'use strict';

var port = process.env.PORT || 3000 ;
var server = process.env.SERVER_BASE || 'http://localhost:' + port;
var logOutputFile = 'app.log';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/' + (process.env.DB_NAME || 'jean'),
	envName: 'production',
	log4js: {
		logFile: logOutputFile,
		config: {
			replaceConsole: true,
			appenders: [
				{ type: 'console', category: 'server'},
				{ type: 'file', filename: logOutputFile }
			]
		}
	}
};
