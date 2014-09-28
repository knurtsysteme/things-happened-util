'use strict';

/**
 * global configuration. override it in your code before things-happened.js to
 * change configuration.
 */
var ThingsConfig = ThingsConfig || {};

// use this database
ThingsConfig.serviceurl = ThingsConfig.serviceurl || 'http://localhost:3000';

// use this as global secret for every post and get request made.
ThingsConfig.secret = ThingsConfig.secret || false;
