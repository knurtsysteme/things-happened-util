'use strict';

/**
 * global configuration. override it in your code before things-happened.js to
 * change configuration.
 */
var things = {};
/**
 * only for private usage internal things
 */
things._intern = {};

/**
 * configuration object
 */
things.config = {};

// use things-happened as default
things.config.serviceurl = things.config.serviceurl || 'http://things-happened.org';

// use this as global secret for every post and get request made.
things.config.secret = things.config.secret || false;
