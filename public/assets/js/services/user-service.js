(function () {
    'use strict';

    angular
        .module('app').factory('UserService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};
            var user;

        	service.GetCurrent = GetCurrent;
        	return service;

        	function GetCurrent() {
            	return $http.get('/dash/users/current', { cache: true}).then(handleSuccess, handleError);
        	}
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
})();