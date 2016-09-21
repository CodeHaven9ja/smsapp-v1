angular.module('app').factory('StudentService', Service);

function Service($http, $q, $httpParamSerializerJQLike) {
	var service = {};
	service.GetAllStudents = GetAllStudents;
	service.ToggleActivate = ToggleActivate;
	service.GetParent = GetParent;
	service.LinkParent = LinkParent;
	service.RemoveLink = RemoveLink;
	return service;
	
	function GetAllStudents() {
		return $http.get('/dash/students', { cache: true}).then(handleSuccess, handleError);
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
