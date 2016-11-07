angular.module('app')
	.controller('AdminReportCtrl', ['$scope', function($scope){
		
	}])
	.controller('AdminDemographCtrl', [
		'$scope',
		'$filter',
	 	'StudentService', 
	 	'toaster', 
	 	'LocalService',
	 	function($scope, $filter, StudentService, toaster, LocalService){
	 		var admDCrtl = this;

	 		admDCrtl.students;
	 		admDCrtl.meta = {};
	 		admDCrtl.meta.male_count = 0;
	 		admDCrtl.meta.female_count = 0;
	 		admDCrtl.meta.active_count = 0;

	 		admDCrtl.meta.options = {
        animate:{
            duration:1000,
            enabled:true
        },
        barColor:'#d9edf7',
        trackColor: '#f2dede',
        scaleColor:false,
        lineWidth:20,
        lineCap:'circle'
	    };



	 		StudentService.GetAllStudents().then((students) => {
				admDCrtl.students = students.results;
	 			admDCrtl.meta.total_count = admDCrtl.students.length;

				for (var i = 0; i < admDCrtl.students.length; i++) {
					var student = admDCrtl.students[i];

					if(student.sex === 'male'){
						admDCrtl.meta.male_count++;
					} else {
						admDCrtl.meta.female_count++;
					}
					if (student.isActive) {
						admDCrtl.meta.active_count++;
					}
				}
				admDCrtl.meta.m = (admDCrtl.meta.male_count/admDCrtl.meta.total_count)*100;
				admDCrtl.meta.f = (admDCrtl.meta.female_count/admDCrtl.meta.total_count)*100;
			});
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
		]);

function UserException(message) {
 this.message = message;
 this.name = "UserException";
}