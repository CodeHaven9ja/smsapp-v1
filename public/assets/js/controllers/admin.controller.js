angular.module('app')
	.controller('AdminStaffCtrl', [
		'$scope',
		'$filter',
	 	'StudentService', 
	 	'toaster', 
	 	'LocalService',
	 	'StaffService',
	 	function($scope, $filter, StudentService, toaster, LocalService, StaffService){

	 		var admSCrtl = this;
	 		admSCrtl.staff = [];
	 		admSCrtl.newStaff;

	 		admSCrtl.currentActive;

	 		StaffService.getStaffMembers().then(function(staff){
	 			admSCrtl.staff = staff;
	 		}).catch(function(err){
	 			toaster.pop('error', "Oops!", err.message);
	 		});

	 		$scope.$on('new-user', function(){
	 			if (!admSCrtl.newStaff 
	 				|| !admSCrtl.newStaff.username 
	 				|| !admSCrtl.newStaff.email 
	 				|| !admSCrtl.newStaff.firstName
	 				|| !admSCrtl.newStaff.lastName) {
	 				return;
	 			}

	 			StaffService.createNewStaffMember(admSCrtl.newStaff).then(function(staff){
	 				admSCrtl.staff.unshift(staff);
	 				admSCrtl.newStaff = undefined;
	 			}).catch(function(err){
	 				console.log(err);
		 			toaster.pop('error', "Oops!", err.message);
		 		});

	 		});

	 		admSCrtl.onStaffClick = function(i) {
	 			admSCrtl.currentActive = $filter('filter')(admSCrtl.staff, {objectId: i})[0];
	 			console.log(admSCrtl.currentActive);
	 		}

	 		admSCrtl.toggleActivate = function(id, status){
	 			admSCrtl.currentActive.isActive = !admSCrtl.currentActive.isActive;
	 			StaffService.updateStaff(admSCrtl.currentActive).then(function(done){

	 				toaster.pop((admSCrtl.currentActive.isActive ? 'success' : 'error'), 
	 					"Done!", 
	 					admSCrtl.currentActive.firstName +(admSCrtl.currentActive.isActive ? ' activated.' : ' deactivated.'));
	 			}).catch(function(err){
	 				admSCrtl.currentActive.isActive = !admSCrtl.currentActive.isActive;
	 			});
	 		}
	 		$scope.$watch('admSCrtl.currentActive.profile.position', function(pos){
	 			if (pos) {
	 				StaffService.createOrUpdateStaffPosition({position:pos,id:admSCrtl.currentActive.objectId}).then(function(){
	 					toaster.pop('success', 
	 					"Done!", 
	 					admSCrtl.currentActive.firstName +" position linked.");
	 				}).catch(function(err){
		 				admSCrtl.currentActive.profile.position = undefined;
		 				toaster.pop('error', "Oops!", err.message);
		 			});
	 			}
	 		});


	}])
	.controller('AdminStudentCtrl', [
		'$scope',
	 	'StudentService', 
	 	'toaster', 
	 	'LocalService',
		function($scope, StudentService, toaster, LocalService){

			var sCtrl = this;

			sCtrl.student;

			$scope.$on('handleBroadcast', () =>{
				var id = LocalService.id;
				if (id) {
					StudentService.GetStudent(id).then((student) =>{
						sCtrl.student = student;
						return student.objectId;
					}).then((id) =>{
						return StudentService.GetStudentTodayAttendance(id);
					}).then((present) =>{
						sCtrl.student.present = present;
					}).catch((err) =>{
						toaster.pop('error', "Oops!", sCtrl.student.firstName+"'s attendance record for today is absent.");
					});
				}
			});

			sCtrl.markStudent = function() {
				if (sCtrl.student) {
					StudentService.MarkStudent(sCtrl.student.objectId).then((status) =>{
						sCtrl.student.present = status;
						toaster.pop('success', "Done!", sCtrl.student.firstName+"'s attendance recorded.");
					});
				}
			}

	}])
	.controller('AdminAttendanceCtrl',[
		'$scope',
		'StudentService',
		'LocalService',
		function($scope, StudentService, LocalService){
			var admACrtl = this;
			admACrtl.searchQ = "";
			admACrtl.students = [];

			StudentService.GetAllStudents().then((students) => {
				admACrtl.students = students.results;
			});

			admACrtl.onStudentClick = function(i){
				LocalService.prepForBroadcast(i);
			}
		}
	])	
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
			// console.log(students.results);
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