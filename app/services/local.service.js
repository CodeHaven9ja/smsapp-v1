angular.module('app').factory('LocalService', function($rootScope){
	var sharedService = {};

	sharedService.id = '';

	sharedService.prepForBroadcast = function(id) {
    this.id = id;
    this.broadcastItem();
  };

	sharedService.broadcastItem = function() {
    $rootScope.$broadcast('handleBroadcast');
  };

  return sharedService;
});