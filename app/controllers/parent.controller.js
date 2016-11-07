angular.module('app')
	.controller('AdminParentsCtrl', [
		'$scope',
		'StudentService',
		'ParentService',
		'toaster', 
		'$filter', 
		'$rootScope',
		'LocalService',
		function($scope, StudentService, ParentService, toaster,$filter,$rootScope, LocalService){
		var admPCrtl = this;
		admPCrtl.loaded = false;
		admPCrtl.searchQ = "";

		admPCrtl.onParentClick = function(i){
			LocalService.prepForBroadcast(i);
		}

		$scope.$watch('admPCrtl.searchQ', function(val){
			admPCrtl.liveSearch(val);
		})
		
		// Do search
		admPCrtl.liveSearch = function(val){
			if (val) {
				ParentService.SearchParents(val).then((parents) =>{
					admPCrtl.parents = parents;
				});
			} 
		}

	}])	
	.controller('AdminParentCtrl',[
			'$scope',
			'StudentService',
			'ParentService',
			'toaster', 
			'$filter',
			'$rootScope',
			'LocalService', 
			function($scope, StudentService, ParentService, toaster,$filter,$rootScope, LocalService){
				var pCtrl = this;

				pCtrl.pId = LocalService.currentParentID;
				
				$scope.$on('handleBroadcast', () =>{
					var id = LocalService.id;
					if (id) {
						StudentService.GetParent(id).then((parent) =>{
							pCtrl.parent = parent;
						});
					}
				});

				pCtrl.toggleActivate = function(id, isActive) {
					var el = angular.element('#'+id);
					pCtrl.parent.isActive = !isActive;
					if (isActive) {
						el.removeClass('check');
					} else {
						el.addClass('check');
					}
					ParentService.ToggleActivate(pCtrl.parent).then((user) =>{
						var status;
						if (pCtrl.parent.isActive) {
							toaster.pop('success', "Done!", pCtrl.parent.firstName+" activated");
						} else {
							toaster.pop({
								type:'error', 
								title:"Done!", 
								body: pCtrl.parent.firstName+" deactivated",
								timeout: 0,
								showCloseButton: true
							});
						}
					}).catch((error) =>{
						toaster.pop({
							type:'error', 
							title:"Oops!", 
							body: "An error occurred.",
							timeout: 0,
							showCloseButton: true
						});
						pCtrl.parent.isActive = isActive;
						if (!isActive) {
							el.removeClass('check');
						} else {
							el.addClass('check');
						}
					});
				}

		}]);