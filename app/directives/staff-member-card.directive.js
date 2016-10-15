(function() {
    'use strict';

    angular
        .module('app')
        .directive('staffMembersCard', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: {
            	model: '='
            },
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'blocks/team-members.html',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function Controller($scope, LocalService) {
    	this.staff = LocalService.staff;
    	this.activeStaff = this.staff[0];

    	this.makeActive = function(i) {
    		this.activeStaff = this.staff[i];
    	};
    }
})();