(function() {
  'use strict';

  angular
    .module('app')
    .directive('newUserModal', directive);

  directive.$inject = ['LocalService'];

  /* @ngInject */
  function directive(LocalService) {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      templateUrl: 'blocks/new-user-model.html',
      link: link,
      restrict: 'E',
      replace: true,
      scope: {
        title: '@',
        model: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var submit = element.find("button[type=submit]");

      submit.click(function(){
        LocalService.createUser('new-user');
        element.modal('hide');
      });
    }
  }

  /* @ngInject */
  function Controller() {

  }
})();