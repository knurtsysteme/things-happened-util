'use strict';

describe('things.query.whoseDateIsBetween:', function() {
    it('should provide the right url', function() {
      var query = things.query.select('cars').whoseDateIsBetween("1","2");
      var assertUrl = things.config.serviceurl + '/get/cars.json?criteria={"_date":{"$gte":"1","$lt":"2"}}';
      expect(query.url()).toBe(assertUrl);
    });
});