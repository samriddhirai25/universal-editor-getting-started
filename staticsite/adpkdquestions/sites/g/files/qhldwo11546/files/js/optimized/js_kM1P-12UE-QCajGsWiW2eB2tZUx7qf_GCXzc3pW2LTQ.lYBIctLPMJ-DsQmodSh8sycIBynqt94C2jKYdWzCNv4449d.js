"use strict";

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.otsukaStickyHeader = {
    attach: function attach(context, settings) {
      var $mainHeader = $('header.header', context);

      if ($(once('scroll-hide', $mainHeader).length)) {
        var menuBehavior = drupalSettings.otsuka_jynarque_adpkd_2021.menu_behavior;

        if (menuBehavior !== 'Sticky' && menuBehavior !== 'Persistent') {
          return;
        }

        var prevScrollPos = $(window).scrollTop();

        var autoHideHeader = function autoHideHeader() {
          var currentScrollPos = $(window).scrollTop();
          var $regionContent = $('.region-content', context);

          if (currentScrollPos <= 0) {
            $('body').removeClass('scrollup').removeClass('scrolldown');
            $regionContent.css('padding-top', 0);
          } else if (currentScrollPos > prevScrollPos) {
            $('body').removeClass('scrollup').addClass('scrolldown');
            $regionContent.css('padding-top', 0);
          } else if (currentScrollPos < prevScrollPos) {
            $('body').removeClass('scrolldown').addClass('scrollup');
            var height = parseInt($('header', context).height());

            if ($('body').hasClass('eu-cookie-compliance-popup-open')) {
              height += parseInt($('.eu-cookie-compliance-banner').outerHeight());
            }

            $regionContent.css('padding-top', height + 'px');
          }

          prevScrollPos = currentScrollPos;
        };

        $(window).on('scroll', function () {
          autoHideHeader();
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
