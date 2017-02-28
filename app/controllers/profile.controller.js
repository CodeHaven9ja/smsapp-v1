(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$window', '$state', 'user', 'school', 'LocalService', 'UserService', 'UploadService'];

    /* @ngInject */
    function ProfileController($scope, $window, $state, user, school, LocalService, UserService, UploadService) {
        var vm 		 = this;
        vm.title 	 = 'Edit Account';
        vm.user 	 = user;
        vm.school    = school;
        vm.uploading = false;
        vm.token;

        activate();

        ////////////////

        function activate() {
        }

        vm.updatePassword = function(p){
        	if (!UserService.token) {
        		$window.location.href = '/home/login';
        	}
        	UserService.UpdatePassword(vm.user.objectId, UserService.token, p).then(function(user){
        		if(user){
        			UserService.token = user.sessionToken;
        			$state.go('profile');
        		}
        	}).catch(function(err){
        		console.log(err);
        	});
        }

        vm.upload = function() {
            var file = vm.myFile;
            vm.uploading = true;
            UserService.GetCurrent().then(function(user){
                vm.token = user.sessionToken;
                return UploadService.init().upload(file, user.sessionToken);
            }).then(function(file){
                var f = {
                    "__type" : "File",
                    "name"   : file.name,
                    "url"    : file.url
                };
                return UserService.UploadProfileImage(f, vm.user.objectId, vm.token);
            }).then(function(user){
                return UserService.Current(vm.token);
            }).then(function(user){
                console.log(user);
                vm.user = user;
                vm.uploading = false;
            }).catch(function(err){
                console.log(err);
                vm.uploading = false;
            });
        }
    }
})();