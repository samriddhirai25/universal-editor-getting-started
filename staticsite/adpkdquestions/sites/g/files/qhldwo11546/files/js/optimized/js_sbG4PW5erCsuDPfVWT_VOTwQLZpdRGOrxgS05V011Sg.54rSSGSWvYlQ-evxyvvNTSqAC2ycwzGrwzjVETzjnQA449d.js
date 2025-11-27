"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.otsukaCustomExternalLinks = {
    attach: function attach(context, settings) {
      $('.modal').on('show.bs.modal', function () {
        $('body', context).addClass('blurred');
      }).on('hide.bs.modal', function () {
        $('body', context).removeClass('blurred');
      });
      $(window).on('dialog:aftercreate', function (e, dialog, $element, settings) {
        $('body', context).addClass('blurred');
      }).on('dialog:afterclose', function (e, dialog, $element, settings) {
        $('body', context).removeClass('blurred');
      });
    }
  };
})(jQuery, Drupal);
