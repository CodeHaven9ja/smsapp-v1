var config = require('../config.json');

var r = require('../modules/service-response.js');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.getStudents = GetStudents;
service.getStudent = GetStudent;
service.getStudentAttendance = GetStudentAttendance;
service.getStudentAttendanceToday = GetStudentAttendanceToday;
service.getStudentParentByParentId = GetStudentParentByParentId;
service.linkParentToStudent = LinkParentToStudent;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI + mountPath;
}

function GetStudentAttendance(token, id) {
  var s;
  if (server_url) {
    s = server_url + '/functions/getStudentAttendance';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/getStudentAttendance',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json:{
      sid: sid
    }
  };
  return r.post(options);
}

function GetStudentAttendanceToday(token, id) {
  var s;
  if (server_url) {
    s = server_url + '/functions/getStudentAttendanceToday';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/getStudentAttendanceToday',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      "X-Parse-Session-Token": token,
      'Content-Type': 'application/json'
    },
    json:{
      sid: id
    }
  };
  return r.post(options);
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
      sid: sid
    }
  };
  return r.post(options);
}

function GetStudent(token, id) {
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

function GetStudentParentByParentId(userToken, id) {
  var s;
  if (server_url) {
    s = server_url + '/classes/_User';
  }

  var options = {
    url: s  || config.apiUrl + '/classes/_User',
    qs:{
      where: {
        'objectId': id
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