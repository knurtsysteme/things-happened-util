'use strict';

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
  // take care about the global secret
  if (options.criteria._secret == false) {
    delete criteria._secret;
  } else if (ThingsConfig.secret && typeof options.criteria._secret == 'undefined') {
    options.criteria._secret = ThingsConfig.secret;
  }

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

ThingsQuery.validForInsertion = function(subject) {
  var result = {};
  result.things = function() {
    var disallowedThings = [ 'things', 'everything' ];
    return !!subject.match(/^[a-z]+$/) && disallowedThings.indexOf(subject) < 0;
  };
  result.happened = function() {
    return !!subject.match(/^[a-z]+$/);
  };
  result.json = function(isString) {
    isString = typeof isString == 'undefined' ? false : !!isString;
    var result = true;
    try {
      // convert to jsonstr
      if (isString) {
        subject = JSON.parse(subject);
      }
      var jsonstr = JSON.stringify(subject);
      // check, if it is a single object
      result = !!jsonstr.match(/^\{.+\}$/);
      // check, if there are more attributes then allowed
      var keys = [];
      if (result) {
        keys = Object.keys(subject);
        result = keys.length <= 20;
      }
      // check if there is another object as attribute
      if (result) {
        var i = keys.length;
        while (i--) {
          if (typeof subject[keys[i]] == 'object' && JSON.stringify(subject[keys[i]]).match(/^\{/)) {
            result = false;
            break;
          }
        }
      }
    } catch (e) {
      result = false;
    }
    return result;
  };
  return result;
};
/**
 * support for adding things query.
 * 
 * Validation: ThingsQuery.add({some:"thing"}).to('trees', 'cut').isValid();
 */
ThingsQuery.add = function(subject) {
  var result = {};
  result.to = function(things, happened) {
    var result = {};
    result.isValid = function() {
      return ThingsQuery.validForInsertion(happened).happened() && ThingsQuery.validForInsertion(things).things() && ThingsQuery.validForInsertion(subject).json();
    };
    result.url = function() {
      return result.isValid() ? '/addto/' + things + '/' + happened + '.json' : false;
    };
    result.getThing = function() {
      if (typeof subject == 'string') {
        subject = JSON.parse(subject);
      }
      if (ThingsConfig.secret) {
        subject._secret = ThingsConfig.secret;
      }
      return result.isValid() ? subject : false;
    };
    return result;
  }
  return result;
}