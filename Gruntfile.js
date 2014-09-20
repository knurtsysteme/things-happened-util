'use strict';

module.exports = function(grunt) {
  global.pkg = require('./package.json');

  // Define the configuration for all the tasks
  grunt.initConfig({
    jshint : require('./grunt/config/jshint.js'),
    concat : require('./grunt/config/concat.js'),
    uglify : require('./grunt/config/uglify.js'),
    jasmine : require('./grunt/config/jasmine.js'),
    copy : require('./grunt/config/copy.js')
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', [ 'jshint', 'jasmine', 'concat', 'uglify', 'copy' ]);
  grunt.registerTask('test', [ 'jshint', 'jasmine']);
};
