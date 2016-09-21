var config = require('../config.json');

var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.getStudents = GetStudents;
service.getStudentParentByParentId = GetStudentParentByParentId;
service.linkParentToStudent = LinkParentToStudent;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI;
}

function LinkParentToStudent(token, sid, pid) {
  var s;
  if (server_url) {
    s = server_url + '/functions/linkParent';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/linkParent',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json:{
      sid: sid,
      pid: pid
    }
  };
  return r.post(options);
}

function GetStudentParentByParentId(userToken, id) {
  var s;
  if (server_url) {
    s = server_url + '/classes/_User';
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User',
    qs:{
      where: {
        'objectId': id,
        'role': 'parent'
      }
    },
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": userToken,
      'Content-Type': 'application/json'
    }
  };
  return r.get(options);
}

function GetStudents(userToken, page) {
	var limit = 10;
	var sk = limit * page;
  var s;
  if (server_url) {
    s = server_url + '/classes/_User';
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User',
    qs:{
    	where: {
    		'role': 'user'
    	},
    	limit : limit,
    	skip: sk
    },
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": userToken,
      'Content-Type': 'application/json'
    }
  };
  return r.get(options);
}