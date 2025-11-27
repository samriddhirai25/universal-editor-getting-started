"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.jumpLink = {
    attach: function attach(context, settings) {
      var animationDuration = 250;
      var extraTopOffset = 30;
      var scrollTrigger = $('.js-scrollable-single', context);
      var bodySelector = $('html, body');
      var $fixedHeader = $('header.header');
      var $fixedTitle = $('.custom--home .node-content .body-content');

      function onJumpHandler(e) {
        e.preventDefault();
        var scrollToSelector = $(this).attr('href');
        var currentPos = $(window).scrollTop();
        var topOffset = parseInt($('body').css('padding-top')) || 0;
        topOffset += $('body').hasClass('scrolldown') ? $('.sliding-popup-top').height() || 0 : ($('.sliding-popup-top').height() || 0) * 2;
        topOffset += $(scrollToSelector).offset().top > currentPos ? $fixedTitle.outerHeight() || $fixedTitle.data('height') || 0 : $fixedHeader.height() || $('.region-content').css('padding-top') || 0;
        bodySelector.animate({
          scrollTop: $(scrollToSelector).offset().top - (topOffset + extraTopOffset)
        }, animationDuration);
      }

      scrollTrigger.on('click', onJumpHandler);
      window.addEventListener('scroll', function () {
        var scrollButton = document.querySelector('.paragraph--type--jump-link-single');

        if (window.scrollY > scrollButton.offsetTop + scrollButton.offsetHeight) {
          $('.paragraph--type--jump-link-single').addClass('scrolled');
        }
      });
    }
  };
})(jQuery, Drupal);
