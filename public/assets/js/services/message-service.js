(function () {
    'use strict';

    angular
        .module('app').factory('MessageService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};

        	service.getMessages = GetMessages;
        	return service;

        	function GetMessages() {
            	return $http.get('messages.json', { cache: true}).then(handleSuccess, handleError);
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