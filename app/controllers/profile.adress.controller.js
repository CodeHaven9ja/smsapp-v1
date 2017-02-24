(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileAddressConntroller', ProfileAddressConntroller);

    ProfileAddressConntroller.$inject = ['user', 'school', 'profile', '$scope', '$state', 'UserService', 'LocalService'];

    /* @ngInject */
    function ProfileAddressConntroller(user, school, profile, $scope, $state, UserService, LocalService) {
        var vm 				= this;
        vm.title 			= 'Edit Address';
        vm.user 			= user;
        vm.school 		= school;
        vm.profile 		= profile[0];
        vm.hasProfile = vm.profile != undefined;
        vm.state			= LocalService.states;

        

        activate();

        ////////////////

        function activate() {
        }

        vm.doProfile = function(){
        	console.log(vm.profile);
        	if (vm.hasProfile) {
        		console.log("Fire down!");
        	} else {
        		console.log("Oops!");
        	}
        }
    }
})();