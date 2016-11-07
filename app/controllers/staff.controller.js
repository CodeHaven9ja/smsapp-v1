angular.module('app')
	.controller('AdminStaffCtrl', [
		'$scope',
		'$filter',
	 	'StudentService', 
	 	'toaster', 
	 	'LocalService',
	 	'StaffService',
	 	adminController]);

function adminController ($scope, $filter, StudentService, toaster, LocalService, StaffService){

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
	})
}