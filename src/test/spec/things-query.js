'use strict';

describe('ThingsQuery:', function() {
  var otherCars = [];
  otherCars.push({
    _id : 'a',
    _pid : 'pid1',
    foo1 : 'bar1',
    engineFabricator : 'f1'
  });
  otherCars.push({
    _id : 'a',
    foo2 : 'bar2'
  });
  otherCars.push({
    _id : 'b',
    _pid : 'pid2',
    foo3 : 'bar3'
  });
  otherCars.push({
    foo4 : 'bar4',
    engineFabricator : 'f2'
  });

  it('should be defined', function() {
    expect('ThingsQuery').toBeDefined();
  });
  it('it should support secrets', function() {
    expect(ThingsQuery.select('cars').setSecret('abc').url()).toBe('/get/cars.json?criteria={"_secret":"abc"}');
  });
  describe('When initilizing a new query', function() {
    it('it should throw an error without a correct collection name given', function() {
      expect(function() {
        ThingsQuery.select('äöü')
      }).toThrow(new Error('must have "things" (@see mongo\'s collection name)'));
    });
    it('it should use "things" if no collection name given', function() {
      expect(ThingsQuery.select().url()).toBe('/get/things.json');
    });
    it('it should throw error on invalid happened', function() {
      expect(function() {
        ThingsQuery.select('cars').that('rumblödeln')
      }).toThrow(new Error('must have "things" (@see mongo\'s collection name)'));
    });
  });
  describe('Provide information about', function() {
    it('a criterion set or not', function() {
      var query = ThingsQuery.select('cars').whose('color').is('blue');
      expect(query.hasCriterion('color')).toBeTruthy();
      expect(query.hasCriterion('height')).toBeFalsy();
    });
  });
  describe('Provide the right url to', function() {
    it('get all cars', function() {
      expect(ThingsQuery.select('cars').url()).toBe('/get/cars.json');
    });
    it('count all cars', function() {
      expect(ThingsQuery.count('cars').url()).toBe('/count/cars.json');
      expect(ThingsQuery.select('cars').count().url()).toBe('/count/cars.json');
    });
    it('get all blue cars', function() {
      var query = ThingsQuery.select('cars').whose('color').is('blue');
      var assertUrl = '/get/cars.json?criteria={"color":"blue"}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all blue and red cars', function() {
      var query = ThingsQuery.select('cars').whose('color').isIn([ 'blue', 'red' ]);
      var assertUrl = '/get/cars.json?criteria={"color":{"$in":["blue","red"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all blue and red cars', function() {
      var query = ThingsQuery.select('cars').whose('color').isIn([ 'blue', 'red' ]);
      var assertUrl = '/get/cars.json?criteria={"color":{"$in":["blue","red"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having a color', function() {
      var query = ThingsQuery.select('cars').whose('color').exists();
      var assertUrl = '/get/cars.json?criteria={"color":{"$exists":true}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having same ids then other cars', function() {
      var query = ThingsQuery.select('cars').whose('_id').isIn(otherCars, '_id');
      var assertUrl = '/get/cars.json?criteria={"_id":{"$in":["a","b"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having same ids then two sets of other cars', function() {
      var otherCars1 = [ otherCars[0], otherCars[1] ];
      var otherCars2 = [ otherCars[2], otherCars[3] ];
      var query = ThingsQuery.select('cars');
      query.whose('_id').isIn(otherCars1, '_id');
      query.whose('_id').isIn(otherCars2, '_id');
      var assertUrl = '/get/cars.json?criteria={"_id":{"$in":["a","b"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having not same ids then other cars', function() {
      var query = ThingsQuery.select('cars').whose('_id').isNotIn(otherCars, '_id');
      var assertUrl = '/get/cars.json?criteria={"_id":{"$nin":["a","b"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having no child in', function() {
      var query = ThingsQuery.select('cars').thatHaveNoChildIn(otherCars);
      var assertUrl = '/get/cars.json?criteria={"_id":{"$nin":["pid1","pid2"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars having a child in', function() {
      var query = ThingsQuery.select('cars').thatHaveAChildIn(otherCars);
      var assertUrl = '/get/cars.json?criteria={"_id":{"$in":["pid1","pid2"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all blue and red cars having same fabricator then other car\'s engine farbricator', function() {
      var query = ThingsQuery.select('cars').whose('color').isIn([ 'blue', 'red' ]);
      query.whose('fabricator').isIn(otherCars, 'engineFabricator');
      var assertUrl = '/get/cars.json?criteria={"color":{"$in":["blue","red"]},"fabricator":{"$in":["f1","f2"]}}';
      expect(query.url()).toBe(assertUrl);
    });
    it('get all cars crashed', function() {
      expect(ThingsQuery.select('cars').that('crashed').url()).toBe('/get/cars/crashed.json');
    });
    it('count all cars crashed', function() {
      expect(ThingsQuery.count('cars').that('crashed').url()).toBe('/count/cars/crashed.json');
      expect(ThingsQuery.select('cars').that('crashed').count().url()).toBe('/count/cars/crashed.json');
    });
    describe('Provide the branch of', function() {
      it('get branch of a thing', function() {
        var subject = {
          _rid : 'abc',
          _branch : '0,2,1,5,0,0,18'
        };
        var assertCriteria = '{"_rid":"abc","_branch":{"$in":["0","0,2,1,5,0,0,18","0,2,1,5,0,0","0,2,1,5,0","0,2,1,5","0,2,1","0,2"]}}';
        expect(ThingsQuery.select('cars').branchOf(subject).url()).toBe('/get/cars.json?criteria=' + assertCriteria);
      });
    });
  });
  describe('Provide validation of things', function() {
    it('should return true on a valid parameters', function() {
      var subject = {
        name : 'peter'
      };
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeTruthy();
    });
    it('should return true on a valid parameters, subject has array', function() {
      var subject = {
        name : 'peter',
        b : [ 1, 2, 3, 4 ]
      };
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeTruthy();
    });
    it('should return false on invalid things', function() {
      var subject = {
        name : 'peter'
      };
      var things = 'cats is not valid';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(things).things()).toBeFalsy();
    });
    it('should return false on invalid happened', function() {
      var subject = {
        name : 'peter'
      };
      var things = 'cats';
      var happened = 'died fast';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(happened).happened()).toBeFalsy();
    });
    it('should return false on array as subject', function() {
      var subject = [ {
        name : 'peter'
      } ];
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(subject).json()).toBeFalsy();
    });
    it('should return false on plain object', function() {
      var subject = {};
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(subject).json()).toBeFalsy();
    });
    it('should return false on 2 dimensional object', function() {
      var subject = {
        name : "peter",
        wife : {
          name : "petra"
        }
      };
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(subject).json()).toBeFalsy();
    });
    it('should return false on more then 20 attributes', function() {
      var subject = {
        a : 1,
        b : 2,
        c : 3,
        d : 4,
        e : 5,
        f : 6,
        g : 7,
        h : 8,
        i : 9,
        j : 10,
        k : 11,
        l : 12,
        m : 13,
        n : 14,
        o : 15,
        p : 16,
        q : 17,
        r : 18,
        s : 19,
        t : 20,
        u : 21
      };
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(subject).json()).toBeFalsy();
    });
    it('should return false on string subject', function() {
      var subject = 'hello!';
      var things = 'cats';
      var happened = 'died';
      expect(ThingsQuery.add(subject).to(things, happened).isValid()).toBeFalsy();
      expect(ThingsQuery.validForInsertion(subject).json()).toBeFalsy();
    });
  });
});
