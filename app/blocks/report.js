(function() {
    'use strict';

    angular
        .module('app')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$stateParams', 'LocalService', 'UserService', 'ReportService'];

    /* @ngInject */
    function ReportController($scope, $stateParams, LocalService, UserService, ReportService) {
      var rCtrl = this;
      rCtrl.title = 'ReportController';
      rCtrl.id = $stateParams.id;
      rCtrl.student = {};
      rCtrl.subjects = [];
      rCtrl.subject = {};
      rCtrl.subject.caScore = 0;
      rCtrl.subject.examScore = 0;
      rCtrl.topics = [];
      rCtrl.user = {};


      activate();

      ////////////////

      function activate() {
      	UserService.GetCurrent().then(function(user){
      		rCtrl.user = user;
      		return UserService.GetUser(rCtrl.id);
      	})
      	.then(function(user){
      		rCtrl.student = user;
    			return ReportService.getResult(rCtrl.user.sessionToken, rCtrl.student.objectId);
      	}).then(function(subjects){
      		rCtrl.subjects = subjects.result;
      		return ReportService.getTopcs();
      	}).then(function(topics){
      		rCtrl.topics = topics.results;
      	}).catch(function(err){
      		console.log(err);
      	});
      }

      rCtrl.sendScore = function(){
      	var s = {};
      	s.studentId = rCtrl.student.objectId;
      	s.score =  rCtrl.subject.caScore + rCtrl.subject.examScore;
      	s.topicId = rCtrl.subject.topicId;
      	ReportService.setSubject(rCtrl.user.sessionToken, s).then(function(subject){
      		console.log(subject);
	      	rCtrl.subject = {};
			    rCtrl.subject.caScore = 0;
			    rCtrl.subject.examScore = 0;
			    return ReportService.getResult(rCtrl.user.sessionToken, rCtrl.student.objectId);
      	}).then(function(subjects){
      		rCtrl.subjects = subjects.result;
      	}).catch(function(err){
      		console.log(err);
      	});
      }
    }
})();