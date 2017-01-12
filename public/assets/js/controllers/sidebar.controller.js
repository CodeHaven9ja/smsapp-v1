(function () {
    'use strict';
    angular
        .module('app')
        .controller('SidebarCtrl',['$scope','$window','$interval', 'UserService',SidebarCtrl])
        .controller('HeaderCtrl',['$scope','$window','$interval', 'UserService', 'MessageService',HeaderCtrl]);

        function HeaderCtrl($scope,$window,$interval,UserService, MessageService) {
        	var hd = this;
            hd.unread = 0;
            hd.mails = [];
        	UserService.GetCurrent().then(function(user){
        		hd.user = user;
                return MessageService.getMails(user.sessionToken);
        	}).then(function (m){
                hd.mail = MessageService.getUnreadCount(m.results, hd.user);

            });
        }
        
        function SidebarCtrl($scope,$window,$interval,UserService) {
        	var sb = this;

        	UserService.GetCurrent().then(function(user){
        		sb.user = user;
        	});
    		
    		sb.sidebarClick = function(el){
    			var list = angular.element(el);
    			var parent = list.parent();
    			var sub = parent.find('> ul');
    			if (!angular.element('body').hasClass('sidebar-collapsed')) {
    				if(sub.is(':visible')) {
    					sub.slideUp(300, function(){
    						parent.removeClass('nav-active');
    						angular.element('.body-content').css({height: ''});
							adjustMainContentHeight();
    					});
    				} else {
    					visibleSubMenuClose();
    					parent.addClass('nav-active');
    					sub.slideDown(300, function(){
    						adjustMainContentHeight();
    					});
    				}
    			}
    		}

    		function visibleSubMenuClose(){
    			angular.element('.menu-list').each(function(){
    				var t = angular.element(this);
    				if(t.hasClass('nav-active')){
    					t.find('> ul').slideUp(300, function(){
    						t.removeClass('nav-active');
    					});
    				}
    			});
    		}

    		function adjustMainContentHeight(){
    			// Adjust main content height
    			var docHeight = angular.element(document).height();
    			if(docHeight > angular.element('.body-content').height())
    				angular.element('.body-content').height(docHeight);
    		}

        	
        }
})();