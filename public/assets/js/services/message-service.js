(function () {
    'use strict';

    angular
        .module('app').factory('MessageService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};

        	service.getMessages = GetMessages;
        	return service;

        	function GetMessages(token, q) {
            	return $http({
                    method:"GET", 
                    url:'/1/classes/Newsletter?include=message&'+q, 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
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