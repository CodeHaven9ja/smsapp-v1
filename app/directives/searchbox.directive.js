(function() {
    'use strict';

    angular
        .module('app')
        .directive('searchBox', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            templateUrl: 'blocks/searchBox.html',
            link: link,
            restrict: 'A',
            scope: {
            	model:'=',
            	change: '&'
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
})();