angular.module('app').factory('StaffService', StaffService);

function StaffService($http, $q){
  var service = {};
  
  service.linkStaffToClass = LinkStaffToClass;
  
  return service;
}

function LinkStaffToClass(staffId, classId){
  return $http.post('/dash/students/'+staffId+'/'+classId).then(handleSuccess, handleError);
}