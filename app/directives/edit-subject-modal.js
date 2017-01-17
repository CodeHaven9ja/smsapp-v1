(function() {
    'use strict';

    angular
        .module('app')
        .directive('ngSubjectModal', ngSubjectModal);

    ngSubjectModal.$inject = ['UserService', 'ReportService'];

    /* @ngInject */
    function ngSubjectModal(UserService, ReportService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            scope: {
            	r: '=r'
            },
            templateUrl: 'blocks/subject-modal.html'
        };
        return directive;

        function link(scope, element, attrs) {
        	var edit = element.find("#r-edit");
        	var report = scope.vm;
        	edit.click(function(e){
        		e.preventDefault();
        		edit.parent().prepend(report.objectId);
        		edit.text("Editing...");
        	});
        	scope.$watch('vm.showModal', function(showModal){
        		if (showModal) {
        			$("#modal").modal('show');
        		} else {
        			$("#modal").modal('hide');
        		}
        	});
        }
    }

    /* @ngInject */
    function Controller(UserService, ReportService) {
    	var vm = this;
    	vm.user = {};
    	vm.showModal = false;
    	vm.item = {};
    	vm.prevItem = {};
    	vm.i = 0;
    	vm.isUpdating = false;
    	vm.updateTitle = "Update";

    	UserService.GetCurrent().then(function(user){
    		vm.user = user;
    	});

    	vm.show = function(i, r){
    		vm.showModal = true;
    		vm.item = r;
    		vm.i = i;
    		vm.prevItem = angular.copy(vm.item);
    	};

    	vm.hide = function(){
    		vm.showModal = false;
    		vm.r[vm.i] = vm.prevItem;
    	}

    	vm.update = function(){
    		vm.isUpdating = true;
    		vm.updateTitle = "Updating...";
    		var sub = {};
    		sub.score = vm.item.score;
    		ReportService.updateSubject(vm.user.sessionToken, vm.item.objectId, sub).then(function(s){
	    		vm.showModal = false;
	    		vm.r[vm.i] = vm.item;
	    		vm.isUpdating = false;
		    	vm.updateTitle = "Update";
    		}).catch(function(err){
    			console.log(err);
    		});
    	}

    }
})();