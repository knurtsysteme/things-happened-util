var getVendors = function() {
  var result = [];
  result.push('bower_components/jasmine/lib/jasmine-core/jasmine.js');
  result.push('bower_components/jasmine/lib/jasmine-core/jasmine-html.js');
  result.push('bower_components/jasmine/lib/jasmine-core/boot.js');
  return result;
}

module.exports = {
  core : {
    src : [ 'src/main/*.js' ],
    options : {
      specs : 'src/test/spec/*.js',
      helpers : [ 'src/test/helpers/grunt-run.js', 'src/test/mock/*.js', 'src/test/helpers/matchers/*.js' ],
      vendor : getVendors()
    }
  }
};
