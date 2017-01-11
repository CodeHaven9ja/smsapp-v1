(function () {
    'use strict';

    angular
        .module('app').factory('UserService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};
            var user;

        	service.GetCurrent = GetCurrent;
            service.GetUser = GetUser;
        	return service;

        	function GetCurrent() {
            	return $http.get('/dash/users/current', { cache: true}).then(handleSuccess, handleError);
        	}

            function GetUser(id) {
                return $http({
                    method:"GET", 
                    url:'/1/classes/_User/'+id, 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC"
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