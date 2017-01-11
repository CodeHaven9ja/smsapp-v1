(function() {
    'use strict';

    angular
        .module('app')
        .directive('assOverview', directive)
        .directive('setHeight', function($window){
          return{
            link: function(scope, element, attrs){
                element.css('height', $window.innerHeight + 'px');
                //element.height($window.innerHeight/3);
                console.log("Height set to "+$window.innerHeight + 'px');
            }
          }
        });

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