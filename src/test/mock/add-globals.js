var mocks = {};
mocks = {};
mocks.diseases = [ {
  symptoms : [ 'cough', 'nausea' ],
  location : 'New York City',
  food : [ 'banana', 'milk', 'beer' ],
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'diseases',
  _rid : '53b9793af9d800d7313870a3',
  _pid : null,
  _state : 'noticed',
  _date : '20140706182842',
  birthdate : '20140706',
  _id : '53b9793af9d800d7313870a3'
}, {
  symptoms : [ 'cough', 'diarrhea' ],
  location : 'Mexico City',
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'diseases',
  _rid : '53b9793af9d800d7313870a4',
  _pid : null,
  _state : 'noticed',
  _date : '20140806182845',
  _id : '53b9793af9d800d7313870a4'
}, {
  symptoms : [ 'pain on my left knee' ],
  location : 'Paris',
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'diseases',
  _rid : '53b9793af9d800d7313870a5',
  birthdate : '20140606',
  _pid : null,
  _state : 'hailed',
  _date : '20120706112842',
  _id : '53b9793af9d800d7313870a5'
}, {
  foo : 'foo',
  bar : 'bar',
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'diseases',
  _rid : '53b97949f9d800d7313870a6',
  _pid : null,
  _state : 'hailed',
  _date : '20140706182857',
  _id : '53b97949f9d800d7313870a6'
} ];
mocks.cars = [ {
  color : 'green',
  fabrication : 'Ford',
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'cars',
  _rid : '43b9793af9d800d7313870a3',
  _pid : null,
  _state : 'crashed',
  _date : '20140706182842',
  _id : '53b9793af9d800d7313870a3'
}, {
  color : 'white',
  fabrication : 'Landrover',
  _host : 'localhost',
  _version : '0.0.7',
  _cn : 'cars',
  _rid : '93b9793af9d800d7313870a4',
  _pid : null,
  _state : 'bought',
  _date : '20140706182842',
  _id : '53b9793af9d800d7313870a4'
} ];
mocks.getDiseaseAnswer = function(diseasePutIn) {
  var result = diseasePutIn;
  result._host = 'localhost';
  result._version = '0.0.7';
  result._cn = 'diseases';
  result._rid = '53cb6d6c6a0a96ae32a686f3';
  result._pid = null;
  result._state = 'occured';
  result._date = '20140720091908';
  result._id = '53cb6d6c6a0a96a;e32a686f3';
  result._ok = 1
  return result;
}
