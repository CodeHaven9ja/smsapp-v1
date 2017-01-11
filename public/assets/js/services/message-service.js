(function () {
    'use strict';

    angular
        .module('app').factory('MessageService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};

        	service.getMessages = GetMessages;
            service.getMessage = GetMessage;
            service.getMails = GetMails;
        	return service;

            function GetMessage(token, id) {
                return $http({
                    method:"GET", 
                    url:'/1/classes/Message/'+id, 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
            }

        	function GetMessages(token) {
            	return $http({
                    method:"GET", 
                    url:'/1/classes/Newsletter', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
        	}

            function GetMails(token){
                return $http({
                    method:"GET", 
                    url:'/1/classes/Mail?include=from&include=to&order=-createdAt', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
            }

            // private functions

            function handleSuccess(res) {
                return res.data;
            }

            function handleError(res) {
                return $q.reject(res.data);
            }
        }

})();