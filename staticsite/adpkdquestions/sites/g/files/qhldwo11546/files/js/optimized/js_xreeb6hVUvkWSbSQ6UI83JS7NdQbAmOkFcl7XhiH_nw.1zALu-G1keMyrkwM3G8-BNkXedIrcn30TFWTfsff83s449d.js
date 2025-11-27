"use strict";

(function ($, Drupal) {
  Drupal.behaviors.home = {
    attach: function attach(context, settings) {
      var throttle = Drupal.behaviors.otsukaDesignSystem.throttle;
      var $body = $('html, body');
      var $window = $(window);
      var $headerLinks = $('header a');
      var $aCtaLinks = $('a.cta-link');
      var $arrow = $('.kidney-sticky .js-scrollable-single').first();
      var ANIM_DURATION = 250;
      var BREAKPOINT = 1024;
      var isHidden = false;

      function getCookieWarningHeight() {
        var $slidingPopUp = $('.sliding-popup-top');
        var slidingPopUpHeight = 0;

        if ($slidingPopUp.length) {
          slidingPopUpHeight = $slidingPopUp.outerHeight();
        }

        return slidingPopUpHeight;
      }

      var kidneyAnimationPositionMobile = false;
      var kidneySticky = $body.find('.kidney-sticky').first();

      function kidneyAnimationInDocument() {
        if (window.innerWidth <= 991) {
          if (!kidneyAnimationPositionMobile) {
            kidneySticky.prependTo('body');
            kidneyAnimationPositionMobile = true;
          }
        } else {
          if (kidneyAnimationPositionMobile) {
            kidneySticky.appendTo('.hero-wrapper .paragraph--type--components-group.h-100');
            kidneyAnimationPositionMobile = false;
          }
        }
      }

      kidneyAnimationInDocument();

      window.onresize = function () {
        kidneyAnimationInDocument();
      };

      if (window.innerWidth >= 992) {
        var timeoutFocus = function timeoutFocus(selector) {
          var toTop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          setTimeout(function () {
            selector.focus();

            if (toTop) {
              $(window).scrollTop(0);
            }
          }, 1);
        };

        $arrow.on('keydown', function (e) {
          if (e.keyCode === 9) {
            e.preventDefault();

            if (e.shiftKey) {
              $aCtaLinks.eq(0).focus();
            } else {
              $aCtaLinks.eq(2).focus();
            }
          }
        });
        $aCtaLinks.eq(0).on('keydown', function (e) {
          if (e.keyCode === 9) {
            e.preventDefault();

            if (e.shiftKey) {
              $headerLinks.last().focus();
            } else {
              timeoutFocus($arrow.get(0), true);
            }
          }
        });
        $aCtaLinks.eq(2).on('keydown', function (e) {
          if (e.keyCode === 9) {
            e.preventDefault();

            if (e.shiftKey) {
              timeoutFocus($arrow.get(0), true);
            }
          }
        });
      }

      function findTrashold() {
        var posEl = $('#what-is-adpkd').offset().top;
        var elHeight = $('#what-is-adpkd').height();
        var windowHeight = $(window).height();
        var trashHold = posEl - (windowHeight - elHeight) / 2;
        return trashHold;
      }

      function clickHandler(e) {
        e.preventDefault();
        $body.animate({
          scrollTop: findTrashold()
        }, ANIM_DURATION);
      }

      function scrollHandler(e) {
        if ($window.innerWidth < BREAKPOINT) {
          return;
        }

        var SCROLL_DIFF = 200;
        var windowPos = $window.scrollTop() + SCROLL_DIFF;
        var trashHold = findTrashold();

        if (isHidden === false && windowPos > trashHold) {
          $arrow.addClass('slowly-hide');
          setTimeout(function () {
            $arrow.hide();
          }, 500);
          isHidden = true;
        } else if (isHidden === true && windowPos < trashHold) {
          $arrow.show().removeClass('slowly-hide');
          isHidden = false;
        }
      }

      var throttleScroll = throttle(scrollHandler);

      function rewriteTabBehavior($elem) {
        var $nextToFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var $prevToFocus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        $elem.on('keydown', function (e) {
          if (!e.shiftKey && e.key === 'Tab' && $nextToFocus) {
            e.preventDefault();
            $nextToFocus.focus();
          }

          if (e.shiftKey && e.key === 'Tab' && $prevToFocus) {
            e.preventDefault();
            $prevToFocus.focus();
          }
        });
      }

      var $btnSlide1 = $('.custom--slide-1 a[role=button]');
      var $btnSlide2 = $('.custom--slide-4 a[role=button]');
      var $btnSlide3 = $('.custom--slide-3 a[role=button]');
      var $footer = $('footer');
      var $btnSignUp = $('.paragraph--type--sticky-sign-up-component a');
      rewriteTabBehavior($btnSlide1, $btnSlide3, false);
      rewriteTabBehavior($btnSlide3, $btnSlide2, $btnSlide1);
      rewriteTabBehavior($btnSlide2, $btnSignUp, $btnSlide3);
      rewriteTabBehavior($btnSignUp, false, $btnSlide2);

      function setTopKidneyAnimation() {
        var kidney = $('.kidney-sticky').first();
        var windowWidth = window.innerWidth;

        if (windowWidth >= 992) {
          var windowHeight = window.innerHeight;
          var kidneyHeight = kidney.outerHeight();
          var kidneyOffsetTop = (windowHeight - kidneyHeight) / 2 + 30;
          kidney.css('top', kidneyOffsetTop);
        } else {
          var calculated = getCookieWarningHeight();
          var kidneyStickyTop = kidneySticky.position().top;

          if (windowWidth <= 768) {
            calculated += 160;
          } else {
            calculated += 210;
          }

          if (kidneyStickyTop != calculated) {
            kidneySticky.css('top', calculated);
          }
        }
      }

      setTopKidneyAnimation();
      var fixAnimationPositionInterval = setInterval(function () {
        setTopKidneyAnimation();
      }, 100);
      setTimeout(function () {
        var cookieWarning = $body.find('.sliding-popup-top');

        if (!cookieWarning.length) {
          clearInterval(fixAnimationPositionInterval);
        }
      }, 5000);
      var $homePageTitleWrapper = $('.node-content .body-content');
      var $sectionHeader = $('#section-header');

      function homePageTitleOpacity() {
        var $windowScrollTop = $(window).scrollTop();
        var windowHeight = window.innerHeight;

        if ($footer[0].getBoundingClientRect().bottom < 1000) {
          $homePageTitleWrapper.addClass('slowly-hide');
        } else {
          $homePageTitleWrapper.removeClass('slowly-hide');
        }

        if ($body.hasClass('scrollup') && windowHeight < 900 && $windowScrollTop > 0) {
          $homePageTitleWrapper.data('height', $homePageTitleWrapper.outerHeight());
          $homePageTitleWrapper.hide();
        } else {
          $homePageTitleWrapper.show();
        }
      }

      function homePageTitlePosition() {
        var $sectionHeaderHeight = $sectionHeader.outerHeight();
        var $windowScrollTop = $(window).scrollTop();
        var slidingPopUpHeight = getCookieWarningHeight();

        if (!$body.hasClass('scrollup') || $windowScrollTop === 0) {
          var $homePageTitleTop = 0;

          var _slidingPopUpHeight = getCookieWarningHeight();

          $homePageTitleTop = $sectionHeaderHeight - $windowScrollTop;

          if ($windowScrollTop < _slidingPopUpHeight + $sectionHeaderHeight) {
            $homePageTitleTop += _slidingPopUpHeight;
          }

          if ($homePageTitleTop < _slidingPopUpHeight) {
            $homePageTitleTop = _slidingPopUpHeight;
          }

          $homePageTitleWrapper.css('top', $homePageTitleTop);
        } else {
          $homePageTitleWrapper.css('top', $sectionHeaderHeight + slidingPopUpHeight);
        }
      }

      homePageTitlePosition();

      function homePageTitleInterval(ms) {
        var homePageTitlePositionInitialCounter = 0;
        var homePageTitlePositionInterval = setInterval(function () {
          homePageTitlePosition();
          homePageTitlePositionInitialCounter++;

          if (homePageTitlePositionInitialCounter >= ms) {
            clearInterval(homePageTitlePositionInterval);
          }
        }, 50);
      }

      homePageTitleInterval(20);
      $body.on('click', '.sliding-popup-top button', function () {
        homePageTitleInterval(50);
        setTimeout(function () {
          clearInterval(fixAnimationPositionInterval);
        }, 1200);
      });
      $arrow.off('click');
      $arrow.on('click', clickHandler);
      $window.on('resize', function () {
        setTopKidneyAnimation();
        homePageTitlePosition();
        homePageTitleOpacity();
      });
      $window.on('scroll', function () {
        throttleScroll();
        homePageTitlePosition();
        homePageTitleOpacity();
      });
    }
  };
})(jQuery, Drupal);
