/*! things-happened-util v0.3.0 | (c) 2013-2014 KNURT Systeme | MIT License */
/* Copyright (c) 2013-2014 KNURT Systeme

things-happened-util JavaScript Library v0.3.0

build: Sat Sep 20 2014 15:00:53 GMT+0200 (CEST)

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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



/**
 * build a query.
 * 
 * only build (string based) urls. do not query anything!
 * 
 * do use your own methods and requests to whatever server the way you want
 * (e.g. the things-happened angular module).
 */

var ThingsQuery = {};
ThingsQuery._produce = function(things, options) {
  var options = options || {};
  options.action = options.action || 'get';
  options.criteria = options.criteria || {};

  var me = this;

  // default construct with "things" (/get/things.json)
  things = things || 'things';

  // validate given things
  if (typeof things != 'string' || !things.match(/^[a-z]+$/)) {
    // TODO meldung genauer muss string sein bzw. buchstaben von a-z (auf url
    // verweisen, wie es angular so schön macht)
    throw new Error('must have "things" (@see mongo\'s collection name)');
  }

  this.thatHaveNoChildIn = function(things) {
    return this.whose('_id').isNotIn(things, '_pid');
  }
  this.thatAreRoot = function() {
    return this.whose('_pid').is(null);
  }
  this.thatHaveAChildIn = function(things) {
    return this.whose('_id').isIn(things, '_pid');
  }
  this.inSameForestAs = function(things) {
    return this.whose('_rid').isIn(things, '_rid');
  }
  this.inSameTreeAs = function(thing) {
    return this.whose('_rid').is(thing._rid);
  }
  this.branchOf = function(thing) {
    var branch = thing._branch || '0';
    var branchNodes = [ '0' ];
    while (branch.length > 1) {
      branchNodes.push(branch);
      branch = branch.substr(0, branch.lastIndexOf(','));
    }
    return this.inSameTreeAs(thing).whose('_branch').isIn(branchNodes);
  }

  /**
   * set the status ("happen {{movieRated}} ed") of query
   */
  this.that = function(happened) {
    // validate given happened
    if (typeof happened != 'string' || !happened.match(/^[a-z\-]+$/)) {
      // TODO meldung genauer muss string sein bzw. buchstaben von a-z (auf
      // url
      // verweisen, wie es angular so schön macht)
      throw new Error('must have "things" (@see mongo\'s collection name)');
    } else {
      options.happened = happened;
    }
    return me;
  }

  this.hasCriterion = function(criterion) {
    return typeof options.criteria[criterion] != 'undefined';
  }

  this.setSecret = function(secret) {
    options.criteria._secret = secret;
    return me;
  }

  /**
   * only request things in the same tree as the given thing.
   * 
   * @param thing
   *          that is part of the tree a thing-object having a root id (_rid) or
   *          a thing string - the directly the _rid
   */
  this.inSameTreeAs = function(thing) {
    var rootId = thing;
    if (thing && typeof thing == 'object' && thing._rid) {
      rootId = thing._rid;
    }
    options.criteria._rid = rootId;
    return me;
  };

  /**
   * query dates between from (inclusive) and to (exclusive).
   * 
   * @param from
   *          the date "between" is starting at (inclusive)
   * @param to
   *          the date "between" is ending (exclusive)
   * @param fromField
   *          (optional) the parameter to take "from" from. default: _date like
   *          mongos $gte, the criteria assumes that the value exists.
   * @param toField
   *          (optional) the parameter to take "to" from. default: _date like
   *          mongos $lt, the criteria assumes that the value exists.
   * @see http://docs.mongodb.org/manual/reference/method/db.collection.find/
   */
  this.whoseDateIsBetween = function(from, to, fromField, toField) {
    fromField = fromField || '_date';
    toField = toField || '_date';
    return this.whose(fromField).isGreaterOrEqualThan(from).whose(toField).isLowerThan(to);
  };

  this.whose = function(criterion) {
    var possibilities = {};
    var getComparsionQueryOptions = function(values, key, operator) {
      if (key) {
        var tmpvalues = [];
        if (options.criteria[criterion] && options.criteria[criterion][operator]) {
          tmpvalues = options.criteria[criterion][operator];
        }
        for (var i = 0; i < values.length; i++) {
          var tmpvalue = values[i][key];
          if (tmpvalue && tmpvalues.indexOf(tmpvalue) < 0) {
            tmpvalues.push(tmpvalue);
          }
        }
        values = tmpvalues;
      }
      var result = {};
      result[operator] = values;
      return result
    }

    // @see http://docs.mongodb.org/manual/reference/operator/query/in/
    possibilities.isIn = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$in');
      return me;
    }
    possibilities.isGreaterThan = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$gt');
      return me;
    }
    possibilities.isLowerThan = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$lt');
      return me;
    }
    possibilities.isGreaterOrEqualThan = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$gte');
      return me;
    }
    possibilities.isLowerOrEqualThan = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$lte');
      return me;
    }
    possibilities.exists = function() {
      options.criteria[criterion] = {
        $exists : true
      };
      return me;
    }
    // @see http://docs.mongodb.org/manual/reference/operator/query/nin/
    possibilities.isNotIn = function(values, key) {
      options.criteria[criterion] = getComparsionQueryOptions(values, key, '$nin');
      return me;
    }
    possibilities.is = function(value) {
      options.criteria[criterion] = value;
      return me;
    }
    return possibilities;
  }

  /**
   * get the count of the select
   */
  this.count = function() {
    options.action = 'count';
    return me;
  }
  this.url = function() {
    var happened = options.happened ? '/' + options.happened : '';

    // url for criteria
    var criteria = JSON.stringify(options.criteria);
    if (criteria == '{}') {
      criteria = '';
    } else {
      criteria = '?criteria=' + criteria;
    }
    return '/' + options.action + '/' + things + happened + '.json' + criteria;
  }
};
ThingsQuery.select = function(things) {
  return new ThingsQuery._produce(things, {
    action : 'get'
  });
};
ThingsQuery.count = function(things) {
  return new ThingsQuery._produce(things, {
    action : 'count'
  });
};
/**
 * return the given thing without data in it but with needed data for an update
 * of the thing (only properties starting with an underscore).
 */
ThingsQuery.getCopyForUpdate = function(thing) {
  var result = {};
  var keys = Object.keys(thing);
  var i = keys.length;
  while (--i) {
    if (keys[i].match(/^_/)) {
      result[keys[i]] = thing[keys[i]];
    }
  }
  return result;
};
