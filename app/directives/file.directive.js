(function() {
    'use strict';

    angular
        .module('app')
        .directive('file', file);

    file.$inject = [];

    /* @ngInject */
    function file() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            template: '<input type="file" />',
    		replace: true,
    		require: 'ngModel',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
        	var listener = function() {
        		scope.$apply(function() {
        			attrs.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
        		});
        	}
        	element.bind('change', listener);
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();