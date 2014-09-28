var grunt = require('grunt');

var banner = function() {
  var currentYear = "" + new Date().getFullYear();
  var data = {};
  data.pkg = global.pkg;
  data.currentYear = currentYear;
  data.currentDateTime = "" + new Date();
  return grunt.template.process(grunt.file.read("grunt/templates/banner.js.jst"), {
    data : data
  });
};

var process = function(src, filepath) {
  // kill 'use strict' statements;
  return '\n\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
};

module.exports = {
  thingsHappenedUtil : {
    src : [ 'src/main/*.js' ],
    dest : 'dist/' + global.pkg.name + '.js'
  },
  options : {
    banner : banner(),
    process : process
  }
};
