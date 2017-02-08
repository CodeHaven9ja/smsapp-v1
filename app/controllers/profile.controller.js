(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$window', '$state', 'user', 'school', 'LocalService', 'UserService'];

    /* @ngInject */
    function ProfileController($scope, $window, $state, user, school, LocalService, UserService) {
        var vm 		= this;
        vm.title 	= 'Edit Account';
        vm.user 	= user;
        vm.school = school;

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
    }
})();