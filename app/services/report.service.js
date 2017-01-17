(function() {
    'use strict';

    angular
        .module('app')
        .service('ReportService', ReportService);

    ReportService.$inject = ['UserService', '$http', '$q'];

    /* @ngInject */
    function ReportService(UserService, $http, $q) {
      this.func = func;

      var service = {};

      service.getResult = GetResult;
      service.getTopcs = GetTopcs;
      service.setSubject = SetSubject;
      service.updateSubject = UpdateSubject;

      return service;

      function SetSubject(token, data) {
      	return $http({
      		method:'POST',
      		url: '/1/functions/setSubject',
      		headers: getHeaders(token),
      		data:{
      			data:data
      		}
      	}).then(handleSuccess, handleError);
      }

      function GetTopcs() {
      	return $http({
      		method: 'GET',
      		url: '/1/classes/Topic?order=title',
      		headers: getHeaders(),
      	}).then(handleSuccess, handleError);
      }

      function GetResult(token, sid) {
      	return $http({
      		method:'POST',
      		url: '/1/functions/getResult',
      		headers: getHeaders(token),
      		data: {
      			sid: sid
      		}
      	}).then(handleSuccess, handleError);
      }

      function UpdateSubject(token, id, subject) {
        return $http({
          method: 'PUT',
          url: '/1/classes/Subject/'+id,
          headers: getHeaders(token),
          data: subject
        }).then(handleSuccess, handleError);
      }

      ////////////////

      function func() {
      }

      // private functions

      function getHeaders(token) {
      	return {
      			"X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
            "X-Parse-Session-Token":token
      		};
      }

			function handleSuccess(res) {
				return res.data;
			}

			function handleError(res) {
				return $q.reject(res.data);
			}
    }
})();