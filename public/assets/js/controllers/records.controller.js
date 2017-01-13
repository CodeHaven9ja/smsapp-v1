(function () {
    'use strict';
    angular
        .module('app')
        .controller('NewsCtrl', ['$scope','$window','$interval','$timeout','MessageService', 'UserService' ,nwCrtl])
        .controller('EventsCtrl',['$scope','$window','$interval','$timeout','UserService', 'uiCalendarConfig','$compile',evCrtl])
        .controller('TimeTableCtrl',['$scope','$window','$interval','$timeout','UserService', 'uiCalendarConfig','$compile',ttCrtl])
        .controller('ReportsCtrl',
            ['$scope','$window','$interval','$timeout','UserService',rpCrtl]
        )
        .controller('AttendanceCtrl',
            ['$scope','$window','$interval','$timeout','UserService',rcCrtl]
        )
        .directive('ngScore',function(){
            return {
                replace: false,
                scope: true,
                link: function(scope, element, attrs){
                    var e = element[0];
                    var ngScore, score, withExam;

                    var calculate = function(){
                        ngScore = parseInt(attrs.ngScore) || 0;
                        withExam = attrs.exam;
                        if (withExam === 'false'){
                            score = 'NA';
                        } else if (ngScore <=39) {
                            score = 'F';
                        } else if (ngScore >=40 && ngScore <= 45) {
                            score = 'E';
                        } else if (ngScore >= 46 && ngScore <= 65) {
                            score = 'C';
                        } else if (ngScore >= 66 && ngScore <= 100) {
                            score = 'A';
                        }
                        e.innerText = score;
                    }

                    var start = function () {
                        calculate();
                    }

                    attrs.$observe('ngScore', function (val){
                        if (val) {
                            start();
                        }
                    });
                }
            };
        });

        function nwCrtl($scope,$window,$interval,$timeout,MessageService, UserService) {
            var nwCrtl = this;
            nwCrtl.user = {};
            nwCrtl.messageClicked = false;
            nwCrtl.messages = [];
            nwCrtl.message = {};

            UserService.GetCurrent().then(function(user){
                nwCrtl.user = user;
                return user;
            }).then(function(user){
                console.log(user);
                // var q = "where={\"$relatedTo\":{\"object\":{\"__type\":\"Pointer\",\"className\":\"Post\",\"objectId\":\"8TOXdXf3tz\"},\"key\":\"likes\"}}";
                // console.log(encodeURIComponent(q));
                return MessageService.getMessages(user.sessionToken);
            }).then(function(m){
                console.log(m.results);
                nwCrtl.messages = m.results;
            });

            nwCrtl.selectMail = function(i){
                MessageService.getMessage(nwCrtl.user.sessionToken, nwCrtl.messages[i].message.objectId).then(function(m){
                    nwCrtl.message = m;
                    nwCrtl.messages[i].isRead = true;
                    nwCrtl.messages[i].message = nwCrtl.message;
                    nwCrtl.messageClicked = true;
                });
            }
        }

        function evCrtl($scope,$window,$interval,$timeout,UserService, uiCalendarConfig, $compile) {
            var evCrtl = this;

            var date = new Date('2016-08-29T12:00:00.000Z');
            var m = date.getUTCMinutes();
            var h = date.getUTCHours();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            console.log(date.toJSON());

            /* event source that contains custom events on the scope */
            evCrtl.eventSource = [
              {title: 'First CA Test',start: new Date('2016-08-29T07:00:00.000Z'),end: new Date('2016-09-02T07:00:00.000Z'),allDay: false},
              {title: 'Third term vacation',start: new Date(y, m+1, d, 9, 0),end: new Date(y, m+2, d+2, 10, 0),allDay: true},
              {title: 'Long Break',start: new Date(y, m, d, 10, 0),end: new Date(y, m, d, 12, 0),allDay: false},
            ];

            /* event source that calls a function on every view switch */
            evCrtl.eventsF = function (start, end, timezone, callback) {
              var s = new Date(start).getTime() / 1000;
              var e = new Date(end).getTime() / 1000;
              var m = new Date(start).getMonth();
              var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
              callback(events);
            };

            /* alert on eventClick */
            evCrtl.alertOnEventClick = function( date, jsEvent, view){
                evCrtl.alertMessage = (date.title + ' was clicked ');
            };

            /* alert on Drop */
            evCrtl.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
                evCrtl.alertMessage = ('Event Dropped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            evCrtl.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
                evCrtl.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };
            /* add and removes an event source of choice */
            evCrtl.addRemoveEventSource = function(sources,source) {
              var canAdd = 0;
              angular.forEach(sources,function(value, key){
                if(sources[key] === source){
                  sources.splice(key,1);
                  canAdd = 1;
                }
              });
              if(canAdd === 0){
                sources.push(source);
              }
            };
            /* add custom event*/
            evCrtl.addEvent = function() {
              evCrtl.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
              });
            };
            /* remove event */
            evCrtl.remove = function(index) {
              evCrtl.events.splice(index,1);
            };
            /* Change View */
            evCrtl.changeView = function(view,calendar) {
              uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
            };
            /* Change View */
            evCrtl.renderCalendar = function(calendar) {
              $timeout(function() {
                if(uiCalendarConfig.calendars[calendar]){
                  uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
              });
            };
             /* Render Tooltip */
            evCrtl.eventRender = function( event, element, view ) {
                element.attr({'tooltip': event.title,
                              'tooltip-append-to-body': true});
                $compile(element)($scope);
            }; 

            /* config object */
            evCrtl.uiConfig = {
              calendar:{
                height: 650,
                editable: false,
                header:{
                  left: 'title',
                  center: '',
                  right: 'today prev,next'
                },
                eventClick: evCrtl.alertOnEventClick,
                eventDrop: evCrtl.alertOnDrop,
                eventResize: evCrtl.alertOnResize,
                eventRender: evCrtl.eventRender
              }
            };

            evCrtl.eventSources = [evCrtl.eventSource,evCrtl.eventsF];
        }

        function ttCrtl($scope,$window,$interval,$timeout,UserService, uiCalendarConfig, $compile) {
            var ttCrtl = this;

            var date = new Date('2016-08-29T12:00:00.000Z');
            var m = date.getUTCMinutes();
            var h = date.getUTCHours();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            console.log(date.toJSON());

            /* event source that contains custom events on the scope */
            ttCrtl.eventSource = [
              {title: 'Biology Single Period',start: new Date('2016-08-29T07:00:00.000Z'),end: new Date(y, m, d, h - 3, 0),allDay: false},
              {title: 'Maths Single Period',start: new Date(y, m, d, 9, 0),end: new Date(y, m, d, 10, 0),allDay: false},
              {title: 'Long Break',start: new Date(y, m, d, 10, 0),end: new Date(y, m, d, 12, 0),allDay: false},
            ];

            /* event source that calls a function on every view switch */
            ttCrtl.eventsF = function (start, end, timezone, callback) {
              var s = new Date(start).getTime() / 1000;
              var e = new Date(end).getTime() / 1000;
              var m = new Date(start).getMonth();
              var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
              callback(events);
            };

            /* alert on eventClick */
            ttCrtl.alertOnEventClick = function( date, jsEvent, view){
                ttCrtl.alertMessage = (date.title + ' was clicked ');
            };

            /* alert on Drop */
            ttCrtl.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
                ttCrtl.alertMessage = ('Event Dropped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            ttCrtl.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
                ttCrtl.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };
            /* add and removes an event source of choice */
            ttCrtl.addRemoveEventSource = function(sources,source) {
              var canAdd = 0;
              angular.forEach(sources,function(value, key){
                if(sources[key] === source){
                  sources.splice(key,1);
                  canAdd = 1;
                }
              });
              if(canAdd === 0){
                sources.push(source);
              }
            };
            /* add custom event*/
            ttCrtl.addEvent = function() {
              ttCrtl.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
              });
            };
            /* remove event */
            ttCrtl.remove = function(index) {
              ttCrtl.events.splice(index,1);
            };
            /* Change View */
            ttCrtl.changeView = function(view,calendar) {
              uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
            };
            /* Change View */
            ttCrtl.renderCalendar = function(calendar) {
              $timeout(function() {
                if(uiCalendarConfig.calendars[calendar]){
                  uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
              });
            };
             /* Render Tooltip */
            ttCrtl.eventRender = function( event, element, view ) {
                element.attr({'tooltip': event.title,
                              'tooltip-append-to-body': true});
                $compile(element)($scope);
            }; 

            /* config object */
            ttCrtl.uiConfig = {
              calendar:{
                height: 650,
                editable: false,
                header:{
                  left: 'title',
                  center: '',
                  right: 'today prev,next'
                },
                defaultView: 'agendaWeek',
                eventClick: ttCrtl.alertOnEventClick,
                eventDrop: ttCrtl.alertOnDrop,
                eventResize: ttCrtl.alertOnResize,
                eventRender: ttCrtl.eventRender,
                weekends: false,
                minTime: '08:00:00',
                maxTime: '17:00:00'
              }
            };

            ttCrtl.eventSources = [ttCrtl.eventSource,ttCrtl.eventsF];

        }

        function rpCrtl($scope,$window,$interval,$timeout,UserService) {
            var rpCrtl = this;
            rpCrtl.students = [];
            rpCrtl.currentStudent = {};

            UserService.GetCurrent().then(function(user){
                rcCrtl.user = user;
                // Query student from params
                return user;
            }).then(function(user){
                rpCrtl.currentStudent = user;
                rpCrtl.currentStudent.results = [
                    {
                        subject : 'Mathematics',
                        score: 12
                    },
                    {
                        subject : 'English Language',
                        score: 56
                    },
                    {
                        subject : 'Chemistry',
                        score: 48
                    },
                    {
                        subject : 'Biology',
                        score: 82
                    },
                    {
                        subject : 'History',
                        score: 97
                    },
                    {
                        subject : 'Economics',
                        score: 65
                    },
                    {
                        subject : 'Physics',
                        score: 55
                    },
                    {
                        subject : 'Geography',
                        score: 71
                    },
                    {
                        subject : 'Technical Drawing',
                        score: 73
                    }
                ];
                rpCrtl.currentStudent.reports = [
                    {
                        teacher : "Garba Ali",
                        remark : "Caught jumping the fence today. Adviced to inform your parents to visit the school."
                    },
                    {
                        teacher : "Ene Abah",
                        remark : "Baked a wonderful loaf of bread during Home Economics class. Well done!"
                    },
                    {
                        teacher : "Dotun Olayinka",
                        remark : "School fees are due."
                    }
                ];
            });
        }
        
        function rcCrtl($scope,$window,$interval,$timeout,UserService) {
        	// console.log($window.jwtToken)
        	var rcCrtl = this;
            rcCrtl.attendance = [];
            rcCrtl.students = [];
            rcCrtl.currentStudent = {};
            UserService.GetCurrent().then(function(user){
                rcCrtl.user = user;
                // Query student from params
                return user;
            }).then(function(user){
                rcCrtl.currentStudent = user;
                rcCrtl.attendance = [
                    {
                        createdAt: '2016-08-20T12:32:56.982Z',
                        status: false
                    },
                    {
                        createdAt: '2016-08-19T20:43:12.685Z',
                        status: true
                    },
                    {
                        createdAt: '2016-08-18T20:26:42.479Z',
                        status: true
                    },
                    {
                        createdAt: '2016-08-17T12:32:56.520Z',
                        status: true
                    }
                ];
                rcCrtl.currentStudent.attendance = rcCrtl.attendance;
            });
        }
})();