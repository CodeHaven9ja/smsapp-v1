(function() {
  'use strict';

  angular
    .module('app')
    .directive('myBody', myBody);

  myBody.$inject = [];

  /* @ngInject */
  function myBody() {
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
    	console.log(element);
    }
  }

  /* @ngInject */
  function Controller() {

  }
})();