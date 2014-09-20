var grunt = require('grunt');

var files = {};
files['dist/' + global.pkg.name + '.' + global.pkg.version + '.min.js'] = [ 'dist/' + global.pkg.name + '.' + global.pkg.version + '.js' ];

module.exports = {
  options : {
    preserveComments : 'some'
  },
  core : {
    files : files
  }
};
