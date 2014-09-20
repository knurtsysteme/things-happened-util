'use strict';

describe('ThingsForest:', function() {
  it('should be defined', function() {
    expect(ThingsForest(mocks.diseases)).toBeDefined();
  });
  describe('get something out of the forest', function() {
    it('should return a latest thing', function() {
      expect(ThingsForest(mocks.diseases).getLatest()._date).toBe('20140806182845');
    });
    it('should return a latest thing of another property', function() {
      expect(ThingsForest(mocks.diseases).getLatest('birthdate').birthdate).toBe('20140706');
    });
  });
  describe('check contained elements', function() {
    it('should return true if thing in a tree of the forest', function() {
      var sameTreeThing = {};
      sameTreeThing._rid = mocks.diseases[0]._rid;
      expect(ThingsForest(mocks.diseases).containsTree(sameTreeThing)).toBeTruthy();
    });
    it('should return false on thing is not in a tree of the forest', function() {
      var otherTreeThing = {};
      otherTreeThing._rid = '555-shoe';
      expect(ThingsForest(mocks.diseases).containsTree(otherTreeThing)).toBeFalsy();
    });

  });
  describe('get something without', function() {
    it('should return the difference on giving an array', function() {
      var without = {};
      without._rid = mocks.diseases[0]._rid;
      without._pid = mocks.diseases[0]._id;
      without._id = 'idNotImportant';
      expect(ThingsForest(mocks.diseases).without([ without ]).length).toBe(mocks.diseases.length - 1);
    });
    it('should return the difference on giving a single object', function() {
      var without = {};
      without._rid = mocks.diseases[0]._rid;
      without._pid = mocks.diseases[0]._id;
      without._id = 'idNotImportant';
      expect(ThingsForest(mocks.diseases).without(without).length).toBe(mocks.diseases.length - 1);
    });
  });
});
