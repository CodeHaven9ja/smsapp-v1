(function() {
    'use strict';

    angular
        .module('app')
        .directive('sidebarToggle', SidebarToggle);

    SidebarToggle.$inject = [];

    /* @ngInject */
    function SidebarToggle() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        	element.click(function(){
        		var body = element.closest('body');
        		var bodyposition = body.css('position');

        		if(bodyposition != 'relative') {
        			if(!body.hasClass('sidebar-collapsed')) {
        				body.addClass('sidebar-collapsed');
            		jQuery('.side-navigation ul').attr('style','');
        			} else {
        				body.removeClass('sidebar-collapsed chat-view');
            		jQuery('.side-navigation li.active ul').css({display: 'block'});
        			}
        		} else {
							if(body.hasClass('sidebar-open'))
							  body.removeClass('sidebar-open');
							else
							  body.addClass('sidebar-open');

							adjustMainContentHeight();
        		}
        	})

					function adjustMainContentHeight() {
				    // Adjust main content height
						var docHeight = jQuery(document).height();
						if(docHeight > jQuery('.body-content').height())
							jQuery('.body-content').height(docHeight);
					}
        }
    }

    /* @ngInject */
    function Controller() {

    }
})(jQuery);