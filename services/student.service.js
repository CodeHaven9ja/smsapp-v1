var config = require('../config.json');
var request = require('request');

var Q = require('q');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.getStudents = GetStudents;
service.getStudentParentByParentId = GetStudentParentByParentId;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI;
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
  return returnGetRequest(options);
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
  return returnGetRequest(options);
}

function returnGetRequest(options) {
	var deferred = Q.defer();
  request.get(options, function (error, response, body){
    if (error) {
        deferred.reject(error);
    }
    if (response.body) {
        deferred.resolve(response.body);
    } else {
        deferred.resolve();
    }
  });
  return deferred.promise;
}

function returnPostRequest(options) {
  var deferred = Q.defer();
  request.post(options, function (error, response, body){
    if (error) {
        deferred.reject(error);
    }
    if (response.body) {
        deferred.resolve(response.body);
    } else {
        deferred.resolve();
    }
  });
  return deferred.promise;
}

function returnPutRequest(options) {
  var deferred = Q.defer();
  request.put(options, function (error, response, body){
    if (error) {
        deferred.reject(error);
    }
    if (response.body) {
        deferred.resolve(response.body);
    } else {
        deferred.resolve();
    }
  });
  return deferred.promise;
}

function returnDeleteRequest(options) {
  var deferred = Q.defer();
  request.delete(options, function (error, response, body){
    if (error) {
        deferred.reject(error);
    }
    if (response.body) {
        deferred.resolve(response.body);
    } else {
        deferred.resolve();
    }
  });
  return deferred.promise;
}