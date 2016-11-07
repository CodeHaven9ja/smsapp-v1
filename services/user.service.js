var config = require('../config.json');
var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/1';

service.toggleUserActivation = ToggleUserActivation;
service.updateUser = UpdateUser;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function UpdateUser(userToken, userId, f) {
  var s;
  if (server_url) {
    s = server_url + '/classes/_User/'+userId;
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User/'+userId,
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": userToken,
      'X-Parse-Master-Key': process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P',
      'Content-Type': 'application/json'
    },
    json : f
  };
  return r.put(options);
}

function ToggleUserActivation(userToken, userId, isActive) {
	var s;
  if (server_url) {
    s = server_url + '/classes/_User/'+userId;
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User/'+userId,
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": userToken,
      'X-Parse-Master-Key': process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P',
      'Content-Type': 'application/json'
    },
    json : {
  		isActive: isActive
    }
  };
  return r.put(options);
}

