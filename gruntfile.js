'use strict';

module.exports = function(grunt) {

  // Unified Watch Object
  var watchFiles = {
    //serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'app/**/*.js', 'config/**/*.js'],
    nodeFiles: ['server.js', 'app/**/*.js'],
    mochaTests: ['./app/tests/_globals.js','app/tests/integration/**/*.js', 'app/tests/unit/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta:{
      reports: '.reports',
      files: watchFiles
    },
    watch: {
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    },
    jshint: {
      all: {
        src: watchFiles.serverJS,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch:watchFiles.serverJS
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      docs: ['doxx:shell', 'plato'],
      test: ['test:server'],
      options: {
        logConcurrentOutput: true,
        limit: 6
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development',
        COVERAGE: 'true'
      },
      localdev: {
        NODE_ENV: 'development',
        PORT: 4000
      }
    },
    clean: {
      docs: ['<%= meta.reports %>/docs'],
      coverage: ['<%= meta.reports %>/coverage'],
      istanbul:['<%= meta.reports %>/coverage/server/app', '<%= meta.reports %>/coverage/server/server.js']
    },
    plato: {
      server: {
        options:{
          jshint : grunt.file.readJSON('.jshintrc'),
          exclude: /app\/tests/,
        },
        files: {
          '<%= meta.reports %>/plato/server': ['server.js', 'app/**/*.js']
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: '<%= pkg.repository.url %>',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },
    changelog:{
      options: {
        // Task-specific options go here.
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  require('./config/grunt/customTasks')(grunt);

  // Making grunt default to force in order not to break the project.
  //grunt.option('force', true);

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);
  grunt.registerTask('serve', ['env:localdev', 'lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint']);

  // Test task.
  grunt.registerTask('test', ['setTestEnvVars','clean:coverage', 'lint', 'test:server']);
  grunt.registerTask('test:server', ['istanbul:mocha:cover', 'clean:istanbul']);

  grunt.registerTask('docs', ['clean:docs', 'concurrent:docs' ]);

  //release
  grunt.registerTask('pre-release', ['changelog', 'bump:prerelease']);
  grunt.registerTask('patch-release', ['changelog', 'bump']);
  grunt.registerTask('minor-release', ['changelog', 'bump:minor']);
  grunt.registerTask('major-release', ['changelog', 'bump:major']);

};
