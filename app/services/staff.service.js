angular.module('app').factory('StaffService', StaffService);

function StaffService($http, $q){
  var service = {};
  
  service.linkStaffToClass = LinkStaffToClass;
  service.getStaffMembers = GetStaffMembers;
  service.createNewStaffMember = CreateNewStaffMember;
  service.updateStaff = UpdateStaff;
  
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

	// private functions

	function handleSuccess(res) {
		return res.data;
	}

	function handleError(res) {
		return $q.reject(res.data);
	}
	
}
