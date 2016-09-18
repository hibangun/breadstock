module.exports = function(grunt) {

  /* Dynamically load npm tasks */
  require("load-grunt-tasks")(grunt, {
    scope: "devDependencies"
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        script: "app.js"
      }
    },
    watch: require('./grunt/watch'),
    stylus: require('./grunt/stylus'),
    autoprefixer: require('./grunt/autoprefixer'),
    cssmin: require('./grunt/cssmin'),
    concat: require('./grunt/concat'),
    uglify: require('./grunt/uglify'),
    clean: require('./grunt/clean'),
    concurrent: {
      dev: [
        'stylus',
        'autoprefixer',
        'cssmin',
        'concat',
        'watch',
        'nodemon',
      ],
      options: {
        logConcurrentOutput: true
      }
    },
    imagemin: {
      dynamic: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 7
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'public/images/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'public/images/'                  // Destination path prefix
        }]
      }
    }
  });

  grunt.registerTask("default", [
    "concurrent:dev"
  ]);

  grunt.registerTask("production", [
    "stylus",
    "autoprefixer",
    "cssmin",
    "concat",
    "uglify",
    "clean"
  ]);

  grunt.registerTask("compress", [
    "imagemin"
  ]);
};