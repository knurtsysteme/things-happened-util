// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-16 using
// generator-karma 0.8.2

module.exports = function(config) {
  config.set({
    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch : true,

    // base path, that will be used to resolve files and exclude
    basePath : '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks : [ 'jasmine' ],

    // list of files / patterns to load in the browser
    files : [ 'bower_components/jasmine/lib/jasmine-core/jasmine.css', 'bower_components/jasmine/lib/jasmine-core/jasmine.js', 'bower_components/jasmine/lib/jasmine-core/jasmine-html.js', 'bower_components/jasmine/lib/jasmine-core/boot.js', 'src/main/*.js', 'src/test/mock/**/*.js', 'src/test/spec/**/*.js', 'src/test/_SpecRunner.html' ],

    // list of files / patterns to exclude
    exclude : [],

    // web server port
    port : 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers : [ 'PhantomJS' ],

    // Which plugins to enable
    plugins : [ 'karma-phantomjs-launcher', 'karma-jasmine' ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun : false,

    colors : true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO ||
    // LOG_DEBUG
    logLevel : config.LOG_INFO,
  });
};
