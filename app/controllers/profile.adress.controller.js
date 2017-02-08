(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileAddressConntroller', ProfileAddressConntroller);

    ProfileAddressConntroller.$inject = ['user', 'school', 'profile', '$scope', '$state', 'UserService', 'LocalService'];

    /* @ngInject */
    function ProfileAddressConntroller(user, school, profile, $scope, $state, UserService, LocalService) {
        var vm 			= this;
        vm.title 		= 'Edit Address';
        vm.user 		= user;
        vm.school 	= school;
        vm.profile 	= profile[0];
        vm.state		= LocalService.states;

        console.log(vm.state);

        activate();

        ////////////////

        function activate() {
        }
    }
})();