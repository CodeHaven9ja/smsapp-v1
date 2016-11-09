angular.module('app').factory('StaffService', ['UserService', '$http', '$q',StaffService]);

function StaffService(UserService, $http, $q){
  var service = {};
  
  service.linkStaffToClass = LinkStaffToClass;
  service.getStaffMembers = GetStaffMembers;
  service.createNewStaffMember = CreateNewStaffMember;
  service.updateStaff = UpdateStaff;
  service.createOrUpdateStaffPosition = CreateOrUpdateStaffPosition;
  service.createClass = CreateClass;
  service.getClasses = GetClasses;
  service.addToClass = AddToClass;
  
  return service;
	
	function LinkStaffToClass(staffId, classId){
	  return $http.post('/dash/students/'+staffId+'/'+classId).then(handleSuccess, handleError);
	}

	function GetStaffMembers() {
		return $http.get('/dash/staff').then(handleSuccess, handleError);
	}

	function CreateNewStaffMember(user) {
		return $http.post('/dash/staff', user).then(handleSuccess, handleError);
	}

	function UpdateStaff(staff){
		return $http.put('/dash/staff/'+staff.objectId, staff).then(handleSuccess, handleError);
	}

	function CreateOrUpdateStaffPosition(pos) {
		return $http.post('/dash/staff/position', pos).then(handleSuccess, handleError);
	}

	function CreateClass(clazz) {
		return UserService.GetCurrent().then(function(staff){
			return $http({
				method: 'POST',
				url:'/1/classes/ClassRoom',
				data: clazz,
				headers:{
					'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
					'X-Parse-Session-Token': staff.sessionToken,
	      	'Content-Type': 'application/json'
				}
			});
		}).then(handleSuccess, handleError);
	}

	function AddToClass(cid,sid){
		return UserService.GetCurrent().then(function(staff){
			return $http({
				method: 'POST',
				url:'/1/functions/addToClass',
				data: {
					cid: cid,
					sid: sid
				},
				headers:{
					'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
					'X-Parse-Session-Token': staff.sessionToken,
	      	'Content-Type': 'application/json'
				}
			}).then(handleSuccess, handleError);
		});
	}

	function GetClasses() {
		return UserService.GetCurrent().then(function(staff){
			return $http({
				method: 'POST',
				url: '/1/functions/getClasses',
				headers:{
					'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
					'X-Parse-Session-Token': staff.sessionToken,
	      	'Content-Type': 'application/json'
				}
			})
		}).then(handleSuccess, handleError);
	}

	// private functions

	function handleSuccess(res) {
		return res.data;
	}

	function handleError(res) {
		return $q.reject(res.data);
	}
	
}
