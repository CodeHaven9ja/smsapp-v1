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
                .state('teacher', {
                    url: '/teacher',
                    templateUrl: 'teacher/teacher.index.html', 
                    controller: function(){

                    }
                })
                .state('teacher.report', {
                    url: '/report',
                    templateUrl: 'teacher/teacher.result.html',
                    controller: 'TeacherReportCtrl',
                    controllerAs: 'tRCtrl'
                }).state('teacher.report.detail',{
                    url: '/:id',
                    templateUrl: 'blocks/reports.html',
                    controller: 'ReportController',
                    controllerAs: 'rCtrl'
                })
                .state('mail', {
                    resolve: {
                        mails : function(UserService, MessageService){
                            var u = {};
                            return UserService.GetCurrent().then(function (user){
                                u = user;
                                return MessageService.getMails(u.sessionToken);
                            }).then(function(mails){
                                var emails = mails.results;
                                var mail = {};
                                mail.inbox = [];
                                mail.outbox = [];
                                mail.emails = emails;
                                mail.unRead = 0;
                                for (var i = 0; i < emails.length; i++) {
                                    if (emails[i].to.objectId === u.objectId){
                                    if (!emails[i].isRead){
                                        mail.unRead++;
                                    }
                                        mail.inbox.push(emails[i]);
                                    }

                                    if (emails[i].from.objectId === u.objectId) {
                                        mail.outbox.push(emails[i]);
                                    }
                                }
                                return mail;
                            });
                        }
                    },
                    url: '/mail',
                    templateUrl: 'mail/index.html',
                    controller: 'MailController',
                    controllerAs: 'mailCtrl'
                })
                .state('mail.inbox',{
                    url: '/inbox',
                    templateUrl: 'mail/inbox.html'
                })
                .state('mail.outbox',{
                    url: '/outbox',
                    templateUrl: 'mail/inbox.html'
                })
                .state('mail.compose', {
                    url: '/compose',
                    templateUrl: 'mail/new.html',
                    controller: 'MailComposeController',
                    controllerAs: 'mailCCtrl'
                })
                .state('mail.read', {
                    url: '/:id',
                    templateUrl: 'mail/read.html',
                    controller: 'MailDetailController',
                    controllerAs: 'mailDCtrl'
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