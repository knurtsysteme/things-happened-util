var grunt = require('grunt');

module.exports = {
  copy : {
    main : {
      files : [ {
        src : 'dist/' + global.pkg.name + '.' + global.pkg.version + '.min.js',
        dest : 'dist/',
        rename : function(dest, src) {
          return 'dist/' + global.pkg.name + '.min.js';
        }
      }, {
        src : 'dist/' + global.pkg.name + '.' + global.pkg.version + '.js',
        dest : 'dist/',
        rename : function(dest, src) {
          return 'dist/' + global.pkg.name + '.js';
        }
      } ]
    }
  }
};
