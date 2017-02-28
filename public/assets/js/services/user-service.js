(function () {
    'use strict';

    angular
        .module('app').factory('UserService', Service);

        function Service($http, $q, $httpParamSerializerJQLike) {
        	var service = {};
            var user;
            service.token = null;
            service.user = null;

            service.GetCurrent = GetCurrent;
            service.GetUser = GetUser;
            service.GetSchool = GetSchool;
            service.UpdatePassword = UpdatePassword;
            service.GetProfile = GetProfile;
            service.UploadProfileImage = UploadProfileImage;
            service.Current = Current;
        	return service;

            function UploadProfileImage(file, id, token) {
                return $http({
                    method: "PUT",
                    url: "/1/classes/_User/"+id,
                    headers : {
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        'X-Parse-Session-Token':token,
                        "Content-Type": "application/json"
                    },
                    data: {
                        img : file
                    }
                }).then(handleSuccess, handleError);
            }

        	function GetCurrent() {
            	return $http.get('/dash/users/current', { cache: true}).then(handleSuccess, handleError);
        	}

            function Current(token){
                return $http({
                    method: "GET", 
                    url: "/1/users/me",
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        'X-Parse-Session-Token':token
                    }
                }).then(handleSuccess, handleError);
            }

            function UpdatePassword(id, token, password) {
                return $http({
                    method:"PUT", 
                    url:'/1/classes/_User/'+id, 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        'X-Parse-Session-Token':token
                    }, 
                    data: {
                        password: password
                    }
                }).then(handleSuccess, handleError);
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

            function GetProfile(user) {
                return $http({
                    method:"GET",
                    url:'/1/classes/Profile/', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC"
                    },
                    params:{
                        where: {
                            user : {
                                "__type": "Pointer",
                                "className": "_User",
                                "objectId": user.objectId
                            }
                        }
                    }
                }).then(handleSuccess, handleError);
            }

            function GetSchool(id) {
                return $http({
                    method:"GET", 
                    url:'/1/classes/School/'+id, 
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