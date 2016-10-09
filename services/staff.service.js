var config = require('../config.json');

var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.getStaffMembers = GetStaffMembers; 

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
	server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function GetStaffMembers(token) {
	var s;
  if (server_url) {
    s = server_url + '/functions/getStaffMembers';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/getStaffMembers',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    }
  };
  return r.post(options);
}