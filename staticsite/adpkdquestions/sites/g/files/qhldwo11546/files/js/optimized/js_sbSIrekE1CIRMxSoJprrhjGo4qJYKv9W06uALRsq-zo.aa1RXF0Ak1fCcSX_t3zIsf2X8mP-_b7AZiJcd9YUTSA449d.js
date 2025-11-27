"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.odsAddToAny = {
    attach: function attach(context, settings) {
      var $links = $('.addtoany_list > a', context);
      $links.each(function () {
        $(this).removeAttr('target').unbind('click').attr('onclick', 'Drupal.behaviors.odsAddToAny.otsukaHandleAddToAnyShareClick(event)');
      });
    },
    otsukaHandleAddToAnyShareClick: function otsukaHandleAddToAnyShareClick(event) {
      var target = event.currentTarget;
      var href = target.getAttribute('href');

      if (href.match(/^mailto/) === null) {
        event.preventDefault();
      }
    }
  };
})(jQuery, Drupal);
