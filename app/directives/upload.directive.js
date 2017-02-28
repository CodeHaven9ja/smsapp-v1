(function() {
    'use strict';

    angular
        .module('app')
        .directive('fileUpload', fileUpload);

    fileUpload.$inject = ['$parse'];

    /* @ngInject */
    function fileUpload($parse) {
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
        	var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
          	scope.$apply(function(){
          		modelSetter(scope, element[0].files[0]);
          	});
          });
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();