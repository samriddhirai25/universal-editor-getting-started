"use strict";

(function ($, Drupal) {
  Drupal.behaviors.otsukaMenuMain = {
    attach: function attach(context, settings) {
      var headerHeight, windowHeight;
      var scrollY = 0;
      var $menu = $('#navbarTogglerblock-otsuka-jynarque-adpkd-2021-main-menu-menu', context);
      var $mobile_menu = $('#mobile-menu', context);
      $(once('html', '.mobile-menu-open-btn', context)).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          scrollY = window.scrollY;
          $('html').addClass('mobile-menu-opened');
          setHeightMenu();
          var menuBtn = $(this);
          var menuPositionTop = menuBtn.outerHeight(true) + menuBtn.offset().top - $(window).scrollTop() - 1;
          $('#mobile-menu', context).css('top', menuPositionTop);
        });
      });

      if (once('window-resized', 'html').length) {
        $(window).on('resize', function () {
          setHeightMenu();
        });
      }

      ;

      function setHeightMenu() {
        if ($('html').hasClass('mobile-menu-opened')) {
          headerHeight = $('header').height();
          windowHeight = $(window).height();
          $mobile_menu.css('max-height', windowHeight - headerHeight);
        }
      }

      $(once('html', '.mobile-menu-close-btn', context)).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          $('html').removeClass('mobile-menu-opened');
          window.scrollTo(0, scrollY);
        });
      });
      $(once('html', '#navbarTogglerblock-otsuka-jynarque-adpkd-2021-main-menu-menu .menu-item--expanded span', context)).each(function () {
        $(this).on('click', function (e) {
          $(this).parent('.menu-item--expanded').siblings('.menu-item').removeClass('expanded');
          $(this).parent('.menu-item--expanded').toggleClass('expanded');
        });
      });
      $(once('html', '#mobile-menu .menu-item--expanded span', context)).each(function () {
        $(this).on('click', function (e) {
          $(this).parent('.menu-item--expanded').toggleClass('expanded');
        });
      });
      $(document).keyup(function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
          $('ul.menu-main > li').each(function (i, el) {
            if ($(el).is(':focus') || $(el).find('a').is(':focus')) {
              $(el).addClass('expanded');
            } else {
              $(el).removeClass('expanded');
            }
          });
        }
      });
      $(once('html', 'html')).each(function () {
        $(this).on('click', function () {
          $('ul.menu-main > li', context).each(function (i, el) {
            $(el).removeClass('expanded');
          });
        });
      });
      $(once('html', 'ul.menu-main > li', context)).each(function () {
        $(this).on('click', function (event) {
          event.stopPropagation();
        });
      });
    }
  };
})(jQuery, Drupal);
