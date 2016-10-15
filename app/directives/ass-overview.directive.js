(function() {
    'use strict';

    angular
        .module('app')
        .directive('assOverview', directive);

    directive.$inject = ['dependencies'];

    /* @ngInject */
    function directive(dependencies) {
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
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();