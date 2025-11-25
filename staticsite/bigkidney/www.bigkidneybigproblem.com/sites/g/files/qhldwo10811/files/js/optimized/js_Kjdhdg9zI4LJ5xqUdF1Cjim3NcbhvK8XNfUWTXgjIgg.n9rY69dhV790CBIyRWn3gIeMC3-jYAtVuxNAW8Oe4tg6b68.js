/**
 * @file
 * Otsuka disease microsite navigation menu.
 */
(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.otsukaDiseaseMicrositeNavigationMenu = {
    attach: function (context) {
      function getHeaderHeight() {
        return 130;
      }

      function scrollToElementId(element_id) {
        $(document).ready(function() {
          $('html, body').animate({
            scrollTop: $(element_id).offset().top - getHeaderHeight()
          }, 500);
        });
      }

      if (window.location.hash != null && window.location.hash !== '') {
        let a = window.location.hash;
        scrollToElementId(a);
      }

      $(once('html', ".nav-link, .scroll")).click(function (event) {
        let a = $(this).attr('href');
        let s = a.split("#");
        if (window.location.pathname === s[0]) {
          event.preventDefault();
          scrollToElementId('#' + s[1]);
        }
        if ($(window).width() < 1200) {
          let $menuCloseBtn = $('.navigation-menu-section-block-wrapper .navbar-toggler', context);
          if ($menuCloseBtn.length > 0) {
            if (!$menuCloseBtn.hasClass('collapsed')) {
              $menuCloseBtn.trigger('click');
              scrollToElementId('#' + s[1]);
            }
          }
        }
      });

      $(window).on('resize', function() {
        if ($(window).width() >= 1200) {
          $('.navbar-collapse.collapse').removeClass('show');
        }
      });
    }
  };
})(jQuery, Drupal);
