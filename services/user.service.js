var config = require('../config.json');
var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.toggleUserActivation = ToggleUserActivation;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function ToggleUserActivation(userToken, userId, isActive) {
	var s;
  if (server_url) {
    s = server_url + '/classes/_User/'+userId;
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User/'+userId,
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": userToken,
      'X-Parse-Master-Key': process.env.MASTER_KEY || 'myMasterKey',
      'Content-Type': 'application/json'
    },
    json : {
  		isActive: isActive
    }
  };
  return r.put(options);
}

