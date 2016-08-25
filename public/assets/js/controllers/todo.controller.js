(function () {
    'use strict';
    angular
        .module('app')
        .controller('TodoCtrl',['$scope','$window','$interval','$timeout',TodoCtrl]);
        function TodoCtrl($scope,$window,$interval,$timeout) {
        	// console.log($window.jwtToken)
        	var td = this;
        	td.to = 0;
        	td.todo = {};
        	td.todo.tasks = [
        		{
        			done  : 0,
        			title : "Donec ullamcorper nulla non metus auctor fringilla." 
        		},
        		{
        			done  : 1,
        			title : "Donec ullamcorper nulla non metus auctor fringilla." 
        		}
        	];

        	td.count = td.todo.tasks.length;

        	td.refresh = function (el){
        		console.log("Refreshing...");
	            // Timeout to simulate AJAX response delay
	            $timeout(function() {
	                $(portlet).portlet({
	                    refresh: false
	                });
	            }, 2000);
            }
        }
})();