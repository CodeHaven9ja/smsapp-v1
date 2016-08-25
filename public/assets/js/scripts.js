
// common scripts

(function() {
    "use strict";

   // Sidebar toggle

   jQuery('.menu-list > a').click(function() {
      
      var parent = jQuery(this).parent();
      var sub = parent.find('> ul');
      
      if(!jQuery('body').hasClass('sidebar-collapsed')) {
         if(sub.is(':visible')) {
            sub.slideUp(300, function(){
               parent.removeClass('nav-active');
               jQuery('.body-content').css({height: ''});
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
      return false;
   });

   function visibleSubMenuClose() {

      jQuery('.menu-list').each(function() {
         var t = jQuery(this);
         if(t.hasClass('nav-active')) {
            t.find('> ul').slideUp(300, function(){
               t.removeClass('nav-active');
            });
         }
      });
   }

   function adjustMainContentHeight() {

      // Adjust main content height
      var docHeight = jQuery(document).height();
      if(docHeight > jQuery('.body-content').height())
         jQuery('.body-content').height(docHeight);
   }

   // add class mouse hover

   jQuery('.side-navigation > li').hover(function(){
      jQuery(this).addClass('nav-hover');
   }, function(){
      jQuery(this).removeClass('nav-hover');
   });


   // Toggle Menu

   jQuery('.toggle-btn').click(function(){

      var body = jQuery('body');
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

       var owl = $("#news-feed").data("owlCarousel");
       owl.reinit();

   });
   

   searchform_reposition();

   jQuery(window).resize(function(){

      if(jQuery('body').css('position') == 'relative') {

         jQuery('body').removeClass('sidebar-collapsed');

      } else {

         jQuery('body').css({left: '', marginRight: ''});
      }

      searchform_reposition();

   });

   function searchform_reposition() {
      if(jQuery('.search-content').css('position') == 'relative') {
         jQuery('.search-content').insertBefore('.sidebar-left-info .search-field');
      } else {
         jQuery('.search-content').insertAfter('.right-notification');
      }
   }

    // right slidebar

    $(function(){
        $.slidebars();
    });

    // body scroll

    $("html").niceScroll({
        styler: "fb",
        cursorcolor: "#a979d1",
        cursorwidth: '5',
        cursorborderradius: '15px',
        background: '#404040',
        cursorborder: '',
        zindex: '12000'
    });

    $(".notification-list-scroll").niceScroll({
        styler: "fb",
        cursorcolor: "#DFDFE2",
        cursorwidth: '3',
        cursorborderradius: '15px',
//        background: '#404040',
        cursorborder: '',
        zindex: '12000'
    });



    // collapsible panel
    
    $('.panel .tools .t-collapse').click(function () {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-down")) {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200); }
    });


    // close panel 
    $('.panel .tools .t-close').click(function () {
        $(this).parents(".panel").parent().remove();
    });


    // side widget close

    $('.side-w-close').on('click', function(ev) {
        ev.preventDefault();
        $(this).parents('.aside-widget').slideUp();
    });
    $('.info .add-people').on('click', function(ev) {
        ev.preventDefault();
        $(this).parents('.tab-pane').children('.aside-widget').slideDown();

    });


    // refresh panel

    $('.box-refresh').on('click', function(br) {
        br.preventDefault();
        $("<div class='refresh-block'><span class='refresh-loader'><i class='fa fa-spinner fa-spin'></i></span></div>").appendTo($(this).parents('.tools').parents('.panel-heading').parents('.panel'));

        setTimeout(function() {
            $('.refresh-block').remove();
        }, 1000);

    });

    // tool tips

    $('.tooltips').tooltip();

    // popovers

    $('.popovers').popover();



})(jQuery);

/* ============================================================
 * Pages Portlet
 * ============================================================ */

(function($) {
    'use strict';
    // PORTLET CLASS DEFINITION
    // ======================

    var Portlet = function(element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, $.fn.portlet.defaults, options);
        this.$loader = null;
        this.$body = this.$element.find('.panel-body');
    }
    Portlet.VERSION = "1.0.0";
    // Button actions
    Portlet.prototype.collapse = function() {
        var icon = this.$element.find(this.options.collapseButton + ' > i');
        var heading = this.$element.find('.panel-heading');

        this.$body.stop().slideToggle("fast");

        if (this.$element.hasClass('panel-collapsed')) {
            this.$element.removeClass('panel-collapsed');
            icon.removeClass().addClass('pg-arrow_maximize');
            $.isFunction(this.options.onExpand) && this.options.onExpand(this);
            return
        }
        this.$element.addClass('panel-collapsed');
        icon.removeClass().addClass('pg-arrow_minimize');
        $.isFunction(this.options.onCollapse) && this.options.onCollapse(this);
    }

    Portlet.prototype.close = function() {
        this.$element.remove();
        $.isFunction(this.options.onClose) && this.options.onClose(this);
    }

    Portlet.prototype.maximize = function() {
        var icon = this.$element.find(this.options.maximizeButton + ' > i');

        if (this.$element.hasClass('panel-maximized')) {
            this.$element.removeClass('panel-maximized');
            icon.removeClass('pg-fullscreen_restore').addClass('pg-fullscreen');
            $.isFunction(this.options.onRestore) && this.options.onRestore(this);
        } else {
            this.$element.addClass('panel-maximized');
            icon.removeClass('pg-fullscreen').addClass('pg-fullscreen_restore');
            $.isFunction(this.options.onMaximize) && this.options.onMaximize(this);
        }
    }

    // Options
    Portlet.prototype.refresh = function(refresh) {
        var toggle = this.$element.find(this.options.refreshButton);

        if (refresh) {
            if (this.$loader && this.$loader.is(':visible')) return;
            if (!$.isFunction(this.options.onRefresh)) return; // onRefresh() not set
            this.$loader = $('<div class="portlet-progress"></div>');
            this.$loader.css({
                'background-color': 'rgba(' + this.options.overlayColor + ',' + this.options.overlayOpacity + ')'

            });

            var elem = '';
            if (this.options.progress == 'circle') {
                elem += '<div class="progress-circle-indeterminate progress-circle-' + this.options.progressColor + '"></div>';
            } else if (this.options.progress == 'bar') {

                elem += '<div class="progress progress-small">';
                elem += '    <div class="progress-bar-indeterminate progress-bar-' + this.options.progressColor + '"></div>';
                elem += '</div>';
            } else if (this.options.progress == 'circle-lg') {
                toggle.addClass('refreshing');
                var iconOld = toggle.find('> i').first();
                var iconNew;
                if (!toggle.find('[class$="-animated"]').length) {
                    iconNew = $('<i/>');
                    iconNew.css({
                        'position': 'absolute',
                        'top': iconOld.position().top,
                        'left': iconOld.position().left
                    });
                    iconNew.addClass('portlet-icon-refresh-lg-' + this.options.progressColor + '-animated');
                    toggle.append(iconNew);
                } else {
                    iconNew = toggle.find('[class$="-animated"]');
                }

                iconOld.addClass('fade');
                iconNew.addClass('active');


            } else {
                elem += '<div class="progress progress-small">';
                elem += '    <div class="progress-bar-indeterminate progress-bar-' + this.options.progressColor + '"></div>';
                elem += '</div>';
            }

            this.$loader.append(elem);
            this.$element.append(this.$loader);

            // Start Fix for FF: pre-loading animated to SVGs
            var _loader = this.$loader;
            setTimeout(function() {
                this.$loader.remove();
                this.$element.append(_loader);
            }.bind(this), 300);
            // End fix
            this.$loader.fadeIn();

            $.isFunction(this.options.onRefresh) && this.options.onRefresh(this);

        } else {
            var _this = this;
            this.$loader.fadeOut(function() {
                $(this).remove();
                if (_this.options.progress == 'circle-lg') {
                    var iconNew = toggle.find('.active');
                    var iconOld = toggle.find('.fade');
                    iconNew.removeClass('active');
                    iconOld.removeClass('fade');
                    toggle.removeClass('refreshing');

                }
                _this.options.refresh = false;
            });
        }
    }

    Portlet.prototype.error = function(error) {
        if (error) {
            var _this = this;
            this.$element.pgNotification({
                style: 'bar',
                message: error,
                position: 'top',
                timeout: 0,
                type: 'danger',
                onShown: function() {
                    _this.$loader.find('> div').fadeOut()
                },
                onClosed: function() {
                    _this.refresh(false)
                }
            }).show();
        }
    }

    // PORTLET PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('pg.portlet');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('pg.portlet', (data = new Portlet(this, options)));
            if (typeof option == 'string') data[option]();
            else if (options.hasOwnProperty('refresh')) data.refresh(options.refresh);
            else if (options.hasOwnProperty('error')) data.error(options.error);
        })
    }

    var old = $.fn.portlet

    $.fn.portlet = Plugin
    $.fn.portlet.Constructor = Portlet


    $.fn.portlet.defaults = {
        progress: 'circle',
        progressColor: 'master',
        refresh: false,
        error: null,
        overlayColor: '255,255,255',
        overlayOpacity: 0.8,
        refreshButton: '[data-toggle="refresh"]',
        maximizeButton: '[data-toggle="maximize"]',
        collapseButton: '[data-toggle="collapse"]',
        closeButton: '[data-toggle="close"]'

        // onRefresh: function(portlet) {},
        // onCollapse: function(portlet) {},
        // onExpand: function(portlet) {},
        // onMaximize: function(portlet) {},
        // onRestore: function(portlet) {},
        // onClose: function(portlet) {}
    }

    // PORTLET NO CONFLICT
    // ====================

    $.fn.portlet.noConflict = function() {
        $.fn.portlet = old;
        return this;
    }

    // PORTLET DATA API
    //===================

    $(document).on('click.pg.portlet.data-api', '[data-toggle="collapse"]', function(e) {
        var $this = $(this);
        var $target = $this.closest('.panel');
        if ($this.is('a')) e.preventDefault();
        $target.data('pg.portlet') && $target.portlet('collapse');
    })

    $(document).on('click.pg.portlet.data-api', '[data-toggle="close"]', function(e) {
        var $this = $(this);
        var $target = $this.closest('.panel');
        if ($this.is('a')) e.preventDefault();
        $target.data('pg.portlet') && $target.portlet('close');
    })

    $(document).on('click.pg.portlet.data-api', '[data-toggle="refresh"]', function(e) {
        var $this = $(this);
        var $target = $this.closest('.panel');
        if ($this.is('a')) e.preventDefault();
        $target.data('pg.portlet') && $target.portlet({
            refresh: true
        })
    })

    $(document).on('click.pg.portlet.data-api', '[data-toggle="maximize"]', function(e) {
        var $this = $(this);
        var $target = $this.closest('.panel');
        if ($this.is('a')) e.preventDefault();
        $target.data('pg.portlet') && $target.portlet('maximize');
    })

    $(window).on('load', function() {
        $('[data-pages="portlet"]').each(function() {
            var $portlet = $(this)
            $portlet.portlet($portlet.data())
        })
    })

})(window.jQuery);