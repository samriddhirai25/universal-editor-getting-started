"use strict";

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.otsukaMenuOverflow = {
    attach: function attach(context, settings) {
      var menuOverflow = drupalSettings.otsuka_jynarque_adpkd_2021.menu_overflow;

      if (menuOverflow !== 'Yes') {
        return;
      }

      function on_resize(c, t) {
        onresize = function onresize() {
          clearTimeout(t);
          t = setTimeout(c, 100);
        };

        return c;
      }

      var $region = $('.region-header-bottom');
      var $nav = $('nav', $region);
      $($nav).find('li.show-only-in-footer').remove();

      var appendToggler = function appendToggler() {
        $nav.addClass('js--overflow-menu');
        $(once('custom--more-append', '.js--overflow-menu')).append('<a class="custom--more overflow-squares-menu d-flex justify-content-center align-items-center" data-analytics-position="Header">\n' + '    <i class="fas fa-square-full"></i>\n' + '    <i class="fas fa-square-full spacer"></i>\n' + '    <i class="fas fa-square-full"></i>\n' + '    <span class="custom--more-label d-none">3 More...</span>\n' + '    <ul class="custom--overflow nav"></ul>\n' + '  </a>');
      };

      appendToggler();

      var overflowMenu = function overflowMenu() {
        $region.each(function () {
          var $_self = $(this);

          if ($(window).width() < 769) {
            $('.custom--more', $(this)).removeClass('d-flex').hide();
            $('.custom--overflow li', $(this)).each(function () {
              $('ul.menu', $_self).append($(this));
            });
            return;
          }

          appendToggler();
          var navSpace = $('.js--overflow-menu ul.menu', $(this)).outerWidth() - 50;

          if (navSpace < 0) {
            navSpace = 0;
          }

          var linksWidth = 0;
          $('li', $('.js--overflow-menu ul.menu', $(this))).each(function () {
            linksWidth += $(this).outerWidth();
          });

          if (linksWidth > navSpace) {
            while (linksWidth > navSpace) {
              var lastLink = $('li:last', $('.js--overflow-menu ul.menu', $(this)));
              var lastLinkWidth = lastLink.outerWidth();
              $(lastLink).data('foo', lastLinkWidth);
              $('.custom--overflow', $(this)).prepend(lastLink);
              linksWidth = linksWidth - lastLinkWidth;
            }

            $('.custom--more', $(this)).addClass('d-flex').show();
            $('.custom--more-label', $(this)).text($('.custom--overflow > li', $(this)).length + ' More...');
          } else {
            while (linksWidth <= navSpace) {
              var firstOverflowLink = $('.custom--overflow > li:first', $(this));
              var firstOverflowLinkWidth = firstOverflowLink.data('foo');

              if (navSpace - linksWidth > firstOverflowLinkWidth) {
                $('.js--overflow-menu ul.menu', $(this)).append(firstOverflowLink);
              }

              linksWidth = linksWidth + firstOverflowLinkWidth;
            }

            $('.custom--more-label', $(this)).text($('.custom--overflow > li', $(this)).length + ' More...');

            if ($('.custom--overflow > li', $(this)).length == 0) {
              $('.custom--more', $(this)).removeClass('d-flex').hide();
            } else {
              $('.custom--more', $(this)).addClass('d-flex').show();
            }
          }
        });
      };

      overflowMenu();

      if (once('overflowMenu-onresize', 'html').length) {
        $(window).on('resize', overflowMenu);
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
