module.exports = function(grunt) {

  //Load up all the grunt tasks
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: process.env.PORT || 3000,
          hostname: '*',
          base: ['app'],
          open: {
            target: 'http://localhost:3000'
          },
          livereload: true,
          keepalive: true
        }
      }
    },
    
    //Resource injection
    injector: {
      options: {
        addRootSlash: false,
        ignorePath: ['app/']
      },
      js: {
        files: {
          'app/index.html': ['app/scripts/*.js', 'app/scripts/**/*.js']
        }
      },
      css: {
        files: {
          'app/index.html': ['app/styles/**/*.css']
        }
      }
    },

    //Watch task
    watch: {
      sass: {
        files: 'app/styles/sass/**/*.{scss,sass}',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['app/scripts/**/*.js', 'app/scripts/**/**/*.js'],
        tasks: ['injector:js'],
        options: {
          livereload: true
        }
      }
    },

     // SASS Task
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'app/styles/sass',
          src: ['*.scss'],
          dest: 'app/styles',
          ext: '.css'
        }]
      }
    },

    //Inject bower dependencies
    wiredep: {
      task: {
        options: {
          directory: '.bowerrc'.directory,
          bowerJson: require('./bower.json')
        },
        src: [
          'app/index.html'
        ]
      }
    },

    //Configs for concurrent task
    concurrent: {
      build: ['wiredep', 'injector', 'sass'],
      run: {
        tasks: ['watch', 'connect:server'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });


  //Register grunt tasks.
  grunt.registerTask('serve', ['concurrent:build', 'concurrent:run']);
};