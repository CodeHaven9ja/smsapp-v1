(function() {
    'use strict';

    angular
        .module('app')
        .directive('sclpopUserModal', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        	element.click(function(){
        		$('#sclpop-staff-modal').modal({
        			backdrop : 'static',
        			show: true
        		});
        	});
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();