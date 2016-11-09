angular.module('app').factory('StudentService', Service);

function Service($http, $q, $httpParamSerializerJQLike) {
	var service = {};
	service.GetAllStudents = GetAllStudents;
	service.GetStudent = GetStudent;
	service.MarkStudent = MarkStudent;
	service.GetStudentTodayAttendance = GetStudentTodayAttendance;
	service.ToggleActivate = ToggleActivate;
	service.GetParent = GetParent;
	service.LinkParent = LinkParent;
	service.RemoveLink = RemoveLink;
	service.NewStudent = NewStudent;
	service.GetStudentClass = GetStudentClass;
	service.updatePCID = UpdatePCID;
	return service;

	function UpdatePCID(pcid, sid) {
		return $http({
			method: 'POST',
			url: '/1/functions/updateStudentPCID',
			headers:{
				'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
      	'Content-Type': 'application/json'
			},
			data:{
				pcid : pcid,
				sid : sid
			}
		}).then(handleSuccess, handleError);
	}

	function GetStudentClass(id, parent) {
		return $http({
			method: 'POST',
			url: '/1/functions/getStudentClass',
			headers:{
				'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
				'X-Parse-Session-Token': parent.sessionToken,
      	'Content-Type': 'application/json'
			},
			data:{
				sid : id
			}
		}).then(handleSuccess, handleError);
	}

	function NewStudent(student) {
		return $http({
			method: 'POST',
			url: '/1/users',
			headers: {
				'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
				'X-Parse-Revocable-Session': 1
			},
			data: student
		}).then(handleSuccess, handleError);
	}
	
	function GetAllStudents() {
		return $http.get('/dash/students', { cache: true}).then(handleSuccess, handleError);
	}

	function GetStudent(id) {
		return $http.get('/dash/students/'+id, { cache: true}).then(handleSuccess, handleError);
	}

	function GetStudentTodayAttendance(id) {
		return $http.get('/dash/students/'+id+'/attendance/today').then(handleSuccess, handleError);
	}

	function MarkStudent(id) {
		return $http.post('/dash/students/'+id+'/attendance/').then(handleSuccess, handleError);
	}

	function ToggleActivate(student) {
		return $http.put('/dash/students', student).then(handleSuccess, handleError);
	}

	function GetParent(id) {
		return $http.get('/dash/students/parent/'+id).then(handleSuccess, handleError);
	}
	function LinkParent(sid, pid){
		return $http.post('/dash/students/'+sid+'/'+pid).then(handleSuccess, handleError);
	}

	function RemoveLink(sid) {
		return $http.put('/dash/students/'+sid+'/unlink').then(handleSuccess, handleError);
	}
	// private functions

  function handleSuccess(res) {
      return res.data;
  }

  function handleError(res) {
      return $q.reject(res.data);
  }
}
