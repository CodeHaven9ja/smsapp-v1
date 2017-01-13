(function() {
    'use strict';

    angular
        .module('app')
        .directive('sclpopUserModal', sclpopUserModal);

    sclpopUserModal.$inject = [];

    /* @ngInject */
    function sclpopUserModal() {
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
        		$('#ng-modal').modal({
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