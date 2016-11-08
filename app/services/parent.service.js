angular.module('app').factory('ParentService', Service);

function Service($http, $q, $httpParamSerializerJQLike){
	var service = {};
	service.SearchParents = GetParents;

	service.ToggleActivate = ToggleActivate;

	service.GetChildren = GetChildren;

	return service;

	function GetChildren(user) {
		return $http({
			method: 'POST',
			url: '/1/functions/listChildren',
			headers: {
				'X-Parse-Application-Id': '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
				'X-Parse-Session-Token': user.sessionToken,
      	'Content-Type': 'application/json'
			}
		}).then(handleSuccess, handleError);
	}

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