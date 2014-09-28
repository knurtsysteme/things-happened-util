var grunt = require('grunt');

var files = {};
files['dist/' + global.pkg.name + '.min.js'] = [ 'dist/' + global.pkg.name + '.js' ];

module.exports = {
  options : {
    preserveComments : 'some'
  },
  core : {
    files : files
  }
};
