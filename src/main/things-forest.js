'use strict';

/**
 * do something with a set of things typically done for things you got from a
 * things-happened dbs.
 * 
 * @param things
 *          being part of different trees
 */

var ThingsForest = function(things) {

  var result = {};

  var rootsOfThings = false;

  var getValuesOf = function(things, key) {
    var result = [];
    var i = things.length;
    while (i--) {
      if (typeof things[i][key] != 'undefined') {
        result.push(things[i][key]);
      }
    }
    return result;
  }

  var getRootIds = function(ofThings) {
    ofThings = ofThings || things;
    return getValuesOf(ofThings, '_rid');
  }

  /**
   * return true, if given thing is part of a same tree then a thing describing
   * the forest. in other words: return true, if the root id of the given thing
   * is one of the root ids in the forest.
   */
  result.containsTree = function(thingInTree) {
    return getRootIds().indexOf(thingInTree._rid) >= 0;
  }

  result.without = function(otherThings) {
    if (typeof otherThings._rid != 'undefined') {
      otherThings = [ otherThings ];
    }
    var result = [];
    var rootsOfOtherThings = getRootIds(otherThings);
    var i = things.length;
    while (i--) {
      if (rootsOfOtherThings.indexOf(things[i]._rid) < 0) {
        result.push(things[i]);
      }
    }
    return result;
  }

  /**
   * @param property
   *          (optional) must have the format yyyymmdd(hhmmss). if nothing
   *          given, _date is used. values must be later equal 1st january 1000
   *          A.C. ...
   */
  result.getLatest = function(property) {
    property = property || '_date';
    var result = false;
    var i = things.length;
    while (i--) {
      if (things[i][property]) {
        var dateOfCandidate = things[i][property];
        while (dateOfCandidate < 10000000000000) {
          dateOfCandidate *= 10;
        }
        if (!result || dateOfCandidate > result[property]) {
          result = things[i];
        }
      }
    }
    return result;
  };

  return result;
};
