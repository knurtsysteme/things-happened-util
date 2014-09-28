'use strict';

describe('things.date:', function() {
  it('should be defined', function() {
    expect(things.date).toBeDefined();
  });
  describe('get date out of things', function() {
    it('should return a valid date object on yyyymmddhhMMss', function() {
      var date = things.date.getDate({
        _date : '20140917114834'
      });
      expect(date + '').toMatch(/^Wed Sep 17 2014 11:48:34/);
    });
    it('should return a valid date object on yyyymmddhhMM', function() {
      var date = things.date.getDate({
        _date : '201409171148'
      });
      expect(date + '').toMatch(/^Wed Sep 17 2014 11:48:00/);
    });
    it('should return a valid date object on yyyymmddhh', function() {
      var date = things.date.getDate({
        _date : '2014091711'
      });
      expect(date + '').toMatch(/^Wed Sep 17 2014 11:00:00/);
    });
    it('should return a valid date object on yyyymmdd', function() {
      var date = things.date.getDate({
        _date : '20140917'
      });
      expect(date + '').toMatch(/^Wed Sep 17 2014 00:00:00/);
    });
    it('should return a valid date object on other keys', function() {
      var date = things.date.getDate({
        explodedOn : '20140917'
      }, 'explodedOn');
      expect(date + '').toMatch(/^Wed Sep 17 2014 00:00:00/);
    });
  });
});
