(function () {
	'use strict';
	angular
        .module('app',[
        	'ui.router',
            'ui.gravatar',
            'ui.bootstrap',
            'angularUtils.directives.dirPagination',
            'easypiechart',
            'ui.calendar',
            'studentSearchBox',
            'toaster', 
            'ngAnimate',
            'uiSwitch',
            'multiStepForm',
            'countTo',
        	])
        .config(config)
        .controller('stepCtrl', ['$scope', 'multiStepFormInstance', 
          function ($scope, multiStepFormInstance){
            $scope.clearParent = function(){
              $scope.parent = {};
              multiStepFormInstance.setActiveIndex(1);
            }
        }])
        .run(run);
        function config($stateProvider, $urlRouterProvider) {
        	// default route
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'home/index.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'hmCrtl'
                })
                .state('studentsAttendance', {
                    url: '/students/attendance/:studentId',
                    templateUrl: 'records/attendance.html',
                    controller: 'AttendanceCtrl',
                    controllerAs: 'rcCrtl'
                })
                .state('studentsRecords', {
                    url: '/students/records/:studentId',
                    templateUrl: 'records/records.html',
                    controller: 'ReportsCtrl',
                    controllerAs: 'rpCrtl'
                })
                .state('studentsTimetable', {
                    url: '/students/timetable/:studentId',
                    templateUrl: 'curr/timetable.html',
                    controller: 'TimeTableCtrl',
                    controllerAs: 'ttCrtl'
                })
                .state('studentsEvents', {
                    url: '/students/events/:studentId',
                    templateUrl: 'curr/events.html',
                    controller: 'EventsCtrl',
                    controllerAs: 'evCrtl'
                })
                .state('news', {
                    url: '/news',
                    templateUrl: 'curr/news.html',
                    controller: 'NewsCtrl',
                    controllerAs: 'nwCrtl'
                })
                .state('adminEnroll', {
                    url: '/admin/enroll',
                    templateUrl: 'admin/enroll.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'admCrtl'
                })
                .state('adminParents', {
                    url: '/parents',
                    templateUrl: 'admin/parents.html',
                    controller: 'AdminParentsCtrl',
                    controllerAs: 'admPCrtl'
                })
                .state('adminStaff', {
                    url: '/staff',
                    templateUrl: 'admin/staff.html',
                    controller: 'AdminStaffCtrl',
                    controllerAs: 'admSCrtl'
                })
                .state('adminAttendance', {
                    url: '/admin/attendance',
                    templateUrl: 'admin/attendance.html',
                    controller: 'AdminAttendanceCtrl',
                    controllerAs: 'admACrtl'
                })
                .state('adminDemograph', {
                    url: '/admin/demography',
                    templateUrl: 'admin/demography.html',
                    controller: 'AdminDemographCtrl',
                    controllerAs: 'admDCrtl'
                })
                .state('adminReport', {
                    url: '/admin/reports',
                    templateUrl: 'admin/reports.html',
                    controller: 'AdminReportCtrl',
                    controllerAs: 'admRCrtl'
                })
                .state('adminClassNew', {
                    url: '/class/new',
                    templateUrl: 'admin/class/new.html',
                    controller: 'AdminClassNewCtrl',
                    controllerAs: 'admCNCrtl'
                })
                .state('parentListChildren', {
                    url: '/parent/list-children',
                    templateUrl: 'parent/list-children.html',
                    controller: 'ParentListCtrl',
                    controllerAs: 'pListCrtl'
                })
                .state('teacherEnroll', {
                    url: '/teacher/enroll',
                    templateUrl: 'admin/enroll.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'admCrtl'
                })
        }
        function run($http, $rootScope, $window) {
        	// body...
        }
        // manually bootstrap angular after the JWT token is retrieved from the server
	    $(function () {
	        // get JWT token from server
            $.get('/token', function (token) {
                window.jwtToken = token;
                angular.bootstrap(document, ['app']);
            });
	    });
})();