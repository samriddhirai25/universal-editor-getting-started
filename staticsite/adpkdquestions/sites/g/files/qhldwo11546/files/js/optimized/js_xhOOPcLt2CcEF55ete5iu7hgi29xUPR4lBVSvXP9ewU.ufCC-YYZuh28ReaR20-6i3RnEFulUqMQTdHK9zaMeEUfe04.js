"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.otsukaFacebookApi = {
    attach: function attach(context, settings) {
      if (context !== document) {
        return;
      }

      if (typeof Drupal.otsukaFacebookSdkApi === 'undefined') {
        return;
      }

      Drupal.otsukaFacebookSdkApi.fireEvent("CustomEvent", "PageView");
    }
  };
})(jQuery, Drupal);
