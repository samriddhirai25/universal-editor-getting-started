"use strict";

jQuery(document).ready(function ($) {
  window.storybookGlobalFunctions = {
    animationDuration: 1000,
    documentHeight: $(document).height(),
    windowHeight: $(window).height(),
    scrollTop: function scrollTop() {
      return $("html, body").animate({
        scrollTop: 0
      }, window.storybookGlobalFunctions.animationDuration);
    },
    calculatePercentHeight10: function calculatePercentHeight10() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.1);
    },
    calculatePercentHeight25: function calculatePercentHeight25() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.25);
    },
    calculatePercentHeight30: function calculatePercentHeight30() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.3);
    },
    calculatePercentHeight40: function calculatePercentHeight40() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.4);
    },
    calculatePercentHeight50: function calculatePercentHeight50() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.5);
    },
    calculatePercentHeight80: function calculatePercentHeight80() {
      return Math.floor(window.storybookGlobalFunctions.documentHeight * 0.8);
    },
    isDevEnv: function isDevEnv() {
      return ['localhost', 'dev'].some(function (devEnvParam) {
        return window.location.href.includes(devEnvParam);
      });
    },
    isStoryBook: function isStoryBook() {
      return $('.js-storybook-components').length;
    }
  };
});
