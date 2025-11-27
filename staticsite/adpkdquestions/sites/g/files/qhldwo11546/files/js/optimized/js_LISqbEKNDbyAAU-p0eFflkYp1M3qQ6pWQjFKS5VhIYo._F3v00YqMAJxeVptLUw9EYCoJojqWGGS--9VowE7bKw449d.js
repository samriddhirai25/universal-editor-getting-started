"use strict";

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.CustomTooltips = {
    attach: function attach(context, settings) {
      $('[data-toggle="tooltip"]', context).tooltip({
        trigger: 'manual',
        placement: 'bottom',
        popperConfig: {
          onCreate: function onCreate(data) {
            console.log(data);
          },
          modifiers: {
            computeStyle: {
              enabled: true,
              gpuAcceleration: false
            }
          }
        }
      }).hover(function () {
        if (!$(this).hasClass('hastooltip')) {
          $(this).tooltip('show').addClass('hastooltip');
        }
      }, function () {
        if (!$(this).hasClass('clicked-tooltip')) {
          $(this).tooltip('hide').removeClass('hastooltip');
        }
      }).click(function () {
        toggleTooltips(this);
      }).keypress(function (e) {
        if (e.which == 13) {
          toggleTooltips(this);
        }
      });

      function toggleTooltips(object) {
        if (!$(object).hasClass('hastooltip')) {
          $(object).tooltip('show').addClass('hastooltip').addClass('clicked-tooltip');
        } else {
          $(object).tooltip('hide').removeClass('hastooltip').removeClass('clicked-tooltip');
        }
      }

      $(document).click(function (e) {
        $('[data-toggle="tooltip"]').each(function () {
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0) {
            if ($(this).hasClass('clicked-tooltip')) {
              $(this).tooltip('hide').removeClass('hastooltip').removeClass('clicked-tooltip');
            }
          }
        });
      });
      $(once('addH2Class', '#paragraph-3521 h2', context)).each(function () {
        $(this).addClass('text-align-center');
      });
    }
  };
})(jQuery, Drupal);
