"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.componentModal = {
    attach: function attach(context, settings) {
      $(once('componentModal', '.modal')).each(function () {
        if (!$('iframe, video', this)) {
          return false;
        }

        $(this).on('hidden.bs.modal', function (e) {
          $('iframe', this).attr('src', $('iframe', this).attr('src'));
        });
        $(this).on('shown.bs.modal', function (e) {
          var bLazy = new Blazy();
        });
      });
    }
  };
})(jQuery, Drupal);
