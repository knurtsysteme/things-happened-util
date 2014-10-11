'use strict';

/**
 * build a query.
 * 
 * only build (string based) urls. do not query anything!
 * 
 * do use your own methods and requests to whatever server the way you want
 * (e.g. the things-happened angular module).
 */

things.query = {};
things._intern.GetRequest = function(cn, options) {
  things.config.serviceurl = things.config.serviceurl.replace(/\/$/, '');
  var options = options || {};
  options.serviceurl = options.serviceurl || things.config.serviceurl;
  options.action = options.action || 'get';
  options.criteria = options.criteria || {};
  options.projection = options.projection || {};
  // take care about the global secret
  if (options.criteria._secret == false) {
    delete options.criteria._secret;
  } else if (things.config.secret && typeof options.criteria._secret == 'undefined') {
    options.criteria._secret = things.config.secret;
  }

  var me = this;

  // default construct with "things" (/get/things.json)
  cn = cn || 'things';

  // validate given cn
  if (typeof cn != 'string' || !cn.match(/^[a-z]+$/)) {
    // TODO meldung genauer muss string sein bzw. buchstaben von a-z (auf url
    // verweisen, wie es angular so schön macht)
    throw new Error('must have "things" (@see mongo\'s collection name)');
  }

  this.thatHaveNoChildIn = function(cn) {
    return this.whose('_id').isNotIn(cn, '_pid');
  }
  this.thatAreRoot = function() {
    return this.whose('_pid').is(null);
  }
  this.thatHaveAChildIn = function(cn) {
    return this.whose('_id').isIn(cn, '_pid');
  }
  this.inSameForestAs = function(cn) {
    return this.whose('_rid').isIn(cn, '_rid');
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
  var that = function(diathesisActiveVoice) {
    return function(happened) {
      // TODO set diathesis to criteria on specific mode
      if (things.query.validForInsertion(happened).happened()) {
        options.happened = happened;
      } else {
        throw new Error('must have "things" (@see mongo\'s collection name)');
      }
      return me;
    };
  };
  /**
   * set the status ("happened") of query
   */
  this.that = that(true);
  /**
   * alias for that with active voice
   */
  this.have = that(true);
  /**
   * alias for that with passive voide
   */
  this.haveBeen = that(false);
  /**
   * alias for that with passive voice
   */
  this.got = that(false);

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
    options.criteria[criterion] = options.criteria[criterion] || {};
    
    // return the values of something is or not in something else's key values
    var getComparsionQueryValues = function(values, key, operator) {
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
      return values;
    }

    // @see http://docs.mongodb.org/manual/reference/operator/query/in/
    possibilities.isIn = function(values, key) {
      options.criteria[criterion]['$in'] = getComparsionQueryValues(values, key, '$in');
      return me;
    }
    possibilities.isGreaterThan = function(value) {
      options.criteria[criterion]['$gt'] = value;
      return me;
    }
    possibilities.isLowerThan = function(value) {
      options.criteria[criterion]['$lt'] = value;
      return me;
    }
    possibilities.isGreaterOrEqualThan = function(value) {
      options.criteria[criterion]['$gte'] = value;
      return me;
    }
    possibilities.isLowerOrEqualThan = function(value) {
      options.criteria[criterion]['$lte'] = value;
      return me;
    }
    possibilities.exists = function() {
      options.criteria[criterion]["$exists"] = true;
      return me;
    }
    // @see http://docs.mongodb.org/manual/reference/operator/query/nin/
    possibilities.isNotIn = function(values, key) {
      options.criteria[criterion]['$nin'] = getComparsionQueryValues(values, key, '$nin');
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
    var projection = JSON.stringify(options.projection);
    var urlquery = '';
    if (criteria != '{}') {
      urlquery = '?criteria=' + criteria;
    }
    if (projection != '{}') {
      urlquery += urlquery == '' ? '?' : '&';
      urlquery += 'projection=' + projection;
    }
    return options.serviceurl + '/' + options.action + '/' + cn + happened + '.json' + urlquery;
  }
};
things.query.select = function(cn, options) {
  options = options || {};
  options.action = 'get';
  return new things._intern.GetRequest(cn, options);
};
things.query.count = function(cn, options) {
  options = options || {};
  options.action = 'count';
  return new things._intern.GetRequest(cn, options);
};
things.query.happened = {
  to : function(cn, options) {
    options = options || {};
    options.action = 'get/happened/to';
    return new things._intern.GetRequest(cn, options);
  }
};
/**
 * return the given thing without data in it but with needed data for an update
 * of the thing (only properties starting with an underscore).
 */
things.query.getCopyForUpdate = function(thing) {
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

things.query.validForInsertion = function(subject) {
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
 * Validation: things.query.add({some:"thing"}).to('trees', 'cut').isValid();
 */
things.query.add = function(subject, options) {
  var result = {};
  options = options || {};
  options.serviceurl = options.serviceurl || things.config.serviceurl;
  result.to = function(cn, happened) {
    var that = function(diathesisActiveVoice) {
      // TODO subject._diathesis = diathesisActiveVoice ? 'active' : 'passive';
      return function(happened) {
        var result = {};
        result.isValid = function() {
          return things.query.validForInsertion(happened).happened() && things.query.validForInsertion(cn).things() && things.query.validForInsertion(subject).json();
        };
        result.url = function() {
          return result.isValid() ? options.serviceurl + '/addto/' + cn + '/' + happened + '.json' : false;
        };
        result.getThing = function() {
          if (typeof subject == 'string') {
            subject = JSON.parse(subject);
          }
          if (things.config.secret) {
            subject._secret = things.config.secret;
          }
          return result.isValid() ? subject : false;
        };
        return result;
      }
    };
    if (happened) {
      return that(true)(happened);
    } else {
      return {
        that : that(true),
        being : that(false),
        getting : that(false)
      }
    }
  }
  return result;
}