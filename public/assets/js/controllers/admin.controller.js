angular.module('app')
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

		}])
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

		admPCrtl.onParentClick = function(i){
			LocalService.prepForBroadcast(i);
		}
		
		// Do search
		admPCrtl.liveSearch = function(){
			var q = admPCrtl.searchQ;
			if (q) {
				ParentService.SearchParents(q).then((parents) =>{
					admPCrtl.parents = parents;
				});
			} 
		}

	}])
	.controller('AdminCtrl', ['$scope','StudentService','toaster', '$filter', 
		function($scope, StudentService,toaster,$filter){

		var admCrtl = this;

		admCrtl.loaded = false;
		admCrtl.students = [];
		admCrtl.student = {};
		admCrtl._parent = {};
		admCrtl.currentActive;
		admCrtl.steps = [
			{
        templateUrl: 'admin/student-enroll-steps/activate.html',
        title: 'Activate Account',
        controller: 'stepCtrl'
    	},
    	{
        templateUrl: 'admin/student-enroll-steps/link.html',
        title: 'Link Parent'
    	}
		];

		admCrtl.onStudentClick = function(s){
			admCrtl.parent = {};
			admCrtl.loaded = true;
			admCrtl.student = s;
			admCrtl.currentActive = admCrtl.student.isActive;

		};

		StudentService.GetAllStudents().then((students) => {
			console.log(students.results);
			admCrtl.students = students.results;
		});
		
		admCrtl.toggleActivate = function(id, isActive) {
			var el = angular.element('#'+id);
			admCrtl.student.isActive = !isActive;
			if (isActive) {
				el.removeClass('check');
			} else {
				el.addClass('check');
			}
			StudentService.ToggleActivate(admCrtl.student).then((user) =>{
				var status;
				if (admCrtl.student.isActive) {
					toaster.pop('success', "Done!", admCrtl.student.firstName+" activated");
				} else {
					toaster.pop({
						type:'error', 
						title:"Done!", 
						body: admCrtl.student.firstName+" deactivated",
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
				admCrtl.student.isActive = isActive;
				if (!isActive) {
					el.removeClass('check');
				} else {
					el.addClass('check');
				}
			});
		}
		admCrtl.getParent = function(id) {
			StudentService.GetParent(id).then((parent) =>{
				if (parent.role != 'parent') {
					throw new UserException('Not a Parent. Please ensure that the ID is correct.');
				}
				admCrtl._parent = {};
				admCrtl.parent = parent;
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}

		admCrtl.linkParent = function(){
			StudentService.LinkParent(admCrtl.student.objectId, 
				admCrtl.parent.objectId).then((user) =>{
					admCrtl.student = user;
					for (var i = 0; i < admCrtl.students.length; i++) {
						if (admCrtl.students[i].objectId === admCrtl.student.objectId) {
							admCrtl.students[i] = admCrtl.student;
							toaster.pop('success', "Done!", admCrtl.students[i].firstName+" Linked!");
						}
					}
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}
		admCrtl.removeLink = function(s){
			StudentService.RemoveLink(s.objectId).then((student) =>{
				admCrtl.student = $filter('filter')(admCrtl.students, function(d){
					return d.objectId === s.objectId;
				})[0];
				delete admCrtl.student.profile;
				toaster.pop('success', "Done!", s.firstName+" unlinked!");
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}

		admCrtl.clearParent = function(){
			admCrtl.parent = {};
		}

	}]);

function UserException(message) {
 this.message = message;
 this.name = "UserException";
}