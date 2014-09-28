var vows = require('vows');
var assert = require('assert');
var things = require(__dirname + '/../../../dist/things-happened-util.js').things;
vows.describe('utils work for node.js as well:').addBatch({
  'create a query' : {
    'the query should' : {
      'exist' : function() {
        var thing = {by:"things-happened-db"};
        assert.isTrue(things.query.add(thing).to('utils').being('used').isValid());
      }
    }
  }
}).exportTo(module); // Run it
