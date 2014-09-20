'use strict';

/**
 * adapt the things happened specific date format.
 * 
 * things happened working with a date format yyyymmddhhMMss. this is nice,
 * because you can easily compare things by: thing1._date < thing2._date
 * 
 * but this is awful too, because this does not match any convention like:
 * http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15 or
 * http://tools.ietf.org/html/rfc2822#page-14
 */

var ThingsDate = {};
/**
 * return a js object date of key of thing.
 * 
 * @param thing
 *          key is taken from
 * @param key
 *          (optional) the key to use (default: '_date')
 */
ThingsDate.getDate = function(thing, key) {
  key = key || '_date';
  var datestr = thing[key];
  var year = datestr.length > 3 ? datestr.substr(0, 4) - 0 : 0;
  var month = datestr.length > 5 ? datestr.substr(4, 2) - 1 : 0;
  var day = datestr.length > 7 ? datestr.substr(6, 2) - 0 : 0;
  var hour = datestr.length > 9 ? datestr.substr(8, 2) - 0 : 0;
  var minute = datestr.length > 11 ? datestr.substr(10, 2) - 0 : 0;
  var second = datestr.length > 13 ? datestr.substr(12, 2) - 0 : 0;
  return new Date(year, month, day, hour, minute, second);
}
