var config = require('../config.json');

var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.getStaffMembers = GetStaffMembers; 
service.getStaffMember = GetStaffMember;
service.newStaffMember = NewStaffMember;
service.activateStaff = ActivateStaff;
service.cOrUposition = cOrUposition;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
	server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function NewStaffMember(token, staff) {
  var s;
  if (server_url) {
    s = server_url + '/users';
  }

  var options = {
    url: s  || config.apiUrl + '/users',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json: staff
  };
  return r.post(options);
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

function GetStaffMember(token, id) {
  var s;
  if (server_url) {
    s = server_url + '/classes/_User/'+id;
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User/'+id,
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    }
  };
  return r.get(options);
}

function ActivateStaff(token, staff) {
  var id = staff.objectId;
  var s;
  if (server_url) {
    s = server_url + '/classes/_User/'+id;
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User/'+id,
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Master-Key': process.env.MASTER_KEY || 'myMasterKey',
      'Content-Type': 'application/json'
    },
    json : {
      "isActive": staff.isActive
    }
  };
  return r.put(options);
}

function cOrUposition(token, staff) {
  var s;
  if (server_url) {
    s = server_url + '/functions/cOrUposition';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/cOrUposition',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json:{
      staff : staff
    }
  };
  return r.post(options);
}