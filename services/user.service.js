var config = require('../config.json');
var request = require('request');

var Q = require('q');

var service = {};

var mountPath = process.env.PARSE_MOUNT || '/parse';

service.toggleUserActivation = ToggleUserActivation;

module.exports = service;

var server_url;

if (process.env.PARSE_SERVER_URI) {
    server_url = process.env.PARSE_SERVER_URI;
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
  return returnPutRequest(options);
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