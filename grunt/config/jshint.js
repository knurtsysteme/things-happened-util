var grunt = require('grunt');

module.exports = {
  jshint : {
    options : {
      jshintrc : '.jshintrc',
      reporter : require('jshint-stylish')
    },
    all : {
      src : [ 'Gruntfile.js', 'src/{,*/}*.js' ]
    }
  }
};
