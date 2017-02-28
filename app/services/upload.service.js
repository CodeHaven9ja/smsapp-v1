(function() {
    'use strict';

    angular
        .module('app')
        .service('UploadService', uploadService);

    uploadService.$inject = ['$http', '$q'];

    /* @ngInject */
    function uploadService($http, $q) {
        this.init = func;

        ////////////////

        function func() {
        	return {
        		upload : upload
        	};
        }

        // private
        function upload(file, token){
      		return $http.post("/1/files/"+file.name,file,{headers:{
      			'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
      			"X-Parse-Session-Token":token,
      			'Content-Type': file.type
      		}}).then(function(res){
      			return res.data;
      		}, function(res){
      			return $q.reject(res.data);
      		});
        }
    }
})();