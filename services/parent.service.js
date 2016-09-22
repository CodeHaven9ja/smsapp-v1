var config = require('../config.json');

var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.searchParent = SearchParent; 

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function SearchParent(token, q) {
	var s;
  if (server_url) {
    s = server_url + '/functions/searchParent';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/searchParent',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json:{
      q: q
    }
  };
  return r.post(options);
}