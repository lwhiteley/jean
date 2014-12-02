'use strict';

var shelljs = require('shelljs');
var format = require('string-template');
var request = require('request');
var _ = require('lodash');

module.exports = function(grunt){

  var getPort = function(){
    var port = grunt.option( 'port' ) || 3000;
    if(grunt.option( 'host' ) && !grunt.option( 'port' )){
      port = 80;
    }
    return port;
  };

  // A task for generating documentation using doxx CLI
  grunt.task.registerTask('doxx:shell', 'documentation', function() {
    var options = {
      ignore: 'tests,views',
      source: 'app',
      dest: grunt.config.process('<%= meta.reports %>') + '/docs/doxx',
      title: 'Documentation'
    };

    var template = './node_modules/doxx/bin/doxx --source {source} --target \'{dest}\' --ignore \'{ignore}\' -t \'{title}\'';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Documentation created successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: something went wrong!');
    }
  });

  // A task for running tests with mocha CLI and doing code coverage with istanbul CLI
  grunt.task.registerTask('istanbul:mocha:cover', 'nodejs code coverage', function() {
    var options = {
      configFile: 'config/.istanbul.yml',
      testFiles: 'app/tests/**/*.js',
    };

    var template = 'istanbul cover --config={configFile} node_modules/.bin/_mocha {testFiles}';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Coverage done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }
  });

  grunt.registerTask('setTestEnvVars', 'updates url in waitServer.', function() {
      var port = getPort();
      var envName = grunt.option( 'env' ) || 'dev';
      var dbName = grunt.option( 'dbname' ) || ('jean-' + port);
      var gruntConfigProp = 'env';
      var env = {
        DB_NAME: dbName,
        PORT: port
      };
      var prop = grunt.config.get(gruntConfigProp);
      prop[envName] = _.extend(prop[envName], env);
      grunt.config.set(gruntConfigProp, prop);
      grunt.log.write('Complete. env vars \n' , prop[envName]);
  });

};
