"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.paragraphResourceCta = {
    attach: function attach(context, settings) {
      $(once('field--link-wrapper-on', '.field--link-wrapper-on')).each(function () {
        var $link = $(this).find('a.cta-link');
        var link = $link.attr('href');
        var target = $link.attr('target');
        var classList = $link.attr('class').split(/\s+/);
        var extractedClass = '';
        $.each(classList, function (index, item) {
          if (item.indexOf('analytics--') >= 0) {
            extractedClass = extractedClass + ' ' + item;
          }
        });
        $(this).addClass(extractedClass);
        $(this).attr('data-analytics-position', $link.attr('data-analytics-position'));
        $(this).attr('data-analytics-id', $link.attr('data-analytics-id'));
        $(once('field--link-wrapper-on--click', this)).on('click', function () {
          if (target === undefined) {
            window.location.href = link;
          } else {
            window.open(link, target);
          }
        });
      });
      $(once('addPClass', '#paragraph-3986 p', context)).each(function () {
        $(this).addClass('text-center');
      });
    }
  };
})(jQuery, Drupal);
