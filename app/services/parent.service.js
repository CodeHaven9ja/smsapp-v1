angular.module('app').factory('ParentService', Service);

function Service($http, $q, $httpParamSerializerJQLike){
	var service = {};
	service.SearchParents = GetParents;

	service.ToggleActivate = ToggleActivate;

	return service;

	function ToggleActivate(parent) {
		return $http.put('/dash/students/parent', parent).then(handleSuccess, handleError);
	}

	function GetParents(q) {
		return $http.get('/dash/students/parents/'+q).then(handleSuccess, handleError);
	}

	// private functions

  function handleSuccess(res) {
      return res.data;
  }

  function handleError(res) {
      return $q.reject(res.data);
  }
}