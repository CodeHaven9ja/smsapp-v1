(function() {
    'use strict';

    angular
        .module('app')
        .controller('FeesController', FeesController)
        .controller('FeesDetailController', FeesDetailController);

    FeesController.$inject = ['$scope', 'LocalService', 'UserService', 'StudentService'];

    /* @ngInject */
    function FeesController($scope, LocalService, UserService, StudentService) {
        var feesCtrl = this;
        feesCtrl.title = 'FeesController';

        feesCtrl.user = {};
        feesCtrl.students = [];


        activate();

        ////////////////

        function activate() {
        	UserService.GetCurrent().then(function(user){
        		feesCtrl.user = user;
        		return StudentService.GetAllStudents();
        	}).then(function(students){
        		feesCtrl.students = students.results;
        	}).catch(function(err){
        		console.log(err);
        	});
        }
    }

    FeesDetailController.$inject = ['$scope', 'LocalService', 'UserService', '$stateParams', 'StudentService'];
    /* @ngInject */
    function FeesDetailController($scope, LocalService, UserService, $stateParams, StudentService) {
    	var feesDCtrl = this;
    	feesDCtrl.id = $stateParams.id;
    	feesDCtrl.fee = {};
    	feesDCtrl.student = {};

    	UserService.GetCurrent().then(function(user){
    		feesDCtrl.user = user;
    		return StudentService.getFees(user.sessionToken, feesDCtrl.id);
    	}).then(function(fee){
    		feesDCtrl.fee = fee.result;
    		return UserService.GetUser(feesDCtrl.id);
    	}).then(function(s){
    		feesDCtrl.student = s;
    	}).catch(function(err){
    		console.log(err);
    	});

    	feesDCtrl.calculate = function(){
    		feesDCtrl.fee.percent_paid = (feesDCtrl.fee.amount_paid * 100) / feesDCtrl.fee.amount_due;
    	}


    	feesDCtrl.pay = function(){
    		var fee = {};
    		fee.amount_due = feesDCtrl.fee.amount_due;
    		fee.amount_paid = feesDCtrl.fee.amount_paid;
    		fee.percent_paid = feesDCtrl.fee.percent_paid;

    		if (fee.percent_paid >= 100) {
    			fee.paid = true;
    		}

    		StudentService.updateFees(feesDCtrl.user.sessionToken, feesDCtrl.fee.objectId, fee).then(function(fee){
    			return StudentService.getFee(feesDCtrl.user.sessionToken, feesDCtrl.fee.objectId);
    		}).then(function(fee){
    			feesDCtrl.fee = fee;
    		}).catch(function(err){
    			console.log(err);
    		});

    	}

    }
})();