"use strict";

(function ($) {
  var fadeDuration = 464;
  var animationWrapper = $("#animation-two-kidneys");
  var firstKidney = animationWrapper.find(".kidney-wrapper.first");
  var secondKidney = animationWrapper.find(".kidney-wrapper.second");
  var repeatAnimation = true;
  var timeoutHandle = [];
  var animationInProgress = false;

  function twoKidneysAnimation() {
    var time = 0;
    var tKey = 0;
    time += fadeDuration * 6.5;
    timeoutHandle[tKey] = window.setTimeout(function () {
      firstKidney.animate({
        opacity: 0
      }, fadeDuration * 1.5);
      secondKidney.animate({
        opacity: 1
      }, fadeDuration * 1.5);
    }, time);
    tKey++;
    time += fadeDuration * 6.5;
    timeoutHandle[tKey] = window.setTimeout(function () {
      firstKidney.find(".text").hide();
      firstKidney.css({
        opacity: 1
      });
      firstKidney.animate({
        left: 0
      }, fadeDuration * 3);
      secondKidney.animate({
        right: 0
      }, fadeDuration * 3);
    }, time);
    tKey++;
    time += fadeDuration * 1.5;
    timeoutHandle[tKey] = window.setTimeout(function () {
      firstKidney.find(".text").fadeIn(fadeDuration * 1.5);
    }, time, function () {
      animationInProgress = false;
    });
  }

  function resetTwoKidneysAnimation() {
    timeoutHandle.forEach(function (timeoutHandleItem) {
      clearTimeout(timeoutHandleItem);
    });
    firstKidney.css({
      opacity: 1,
      left: 108
    });
    secondKidney.css({
      opacity: 0,
      right: 77
    });
  }

  resetTwoKidneysAnimation();
  var targetAnimationWrapper = document.querySelector('#animation-two-kidneys');
  var animationPartiallyVisible = false;
  var animationFullyVisible = false;

  function isFullyVisible(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return elemBottom <= docViewBottom && elemTop >= docViewTop || elemTop <= docViewTop && Math.round(window.devicePixelRatio * 100) > 100;
  }

  function handleIntersection(entries) {
    entries.map(function (entry) {
      if (entry.isIntersecting) {
        animationPartiallyVisible = true;
      } else {
        if (repeatAnimation) {
          animationPartiallyVisible = false;
          animationInProgress = false;
          resetTwoKidneysAnimation();
        }
      }
    });
  }

  try {
    var observer = new IntersectionObserver(handleIntersection);
    observer.observe(targetAnimationWrapper);
    animationFullyVisible = !!isFullyVisible(animationWrapper);

    if (animationPartiallyVisible && animationFullyVisible && !animationInProgress) {
      twoKidneysAnimation();
      animationInProgress = true;
    }

    $(window).on('scroll', function () {
      animationFullyVisible = !!isFullyVisible(animationWrapper);

      if (animationPartiallyVisible && animationFullyVisible && !animationInProgress) {
        twoKidneysAnimation();
        animationInProgress = true;
      }
    });
  } catch (e) {
    twoKidneysAnimation();
  }
})(jQuery);
