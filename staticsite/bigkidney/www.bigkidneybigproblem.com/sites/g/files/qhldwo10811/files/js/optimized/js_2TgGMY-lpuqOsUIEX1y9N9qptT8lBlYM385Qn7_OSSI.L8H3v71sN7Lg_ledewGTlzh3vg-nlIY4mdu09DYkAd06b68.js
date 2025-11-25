/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.otsuka_disease_microsite_theme = {
    attach: function (context, settings) {


      // Set all external links opened as target blank.
      $(once('open-external-link', 'a', context)).each(function () {
        if (!!$(this).attr('href') && $(this).attr('href').indexOf('http') === 0) {
          $(this).attr('target', '_blank');
          $(this).attr('href');
        }
      });
    }
  };


  Drupal.behaviors.AddWysiwigLinksAnalytics = {
    attach: function (context) {
      once('AddWysiwigLinksAnalytics', '.add-analytics', context).forEach(function (link) {
        const $link = $(link);

        const position = $link
            .closest('footer, header, body')
            .first()
            .prop('tagName')
            .toLowerCase();
        const href = $link.attr('href').startsWith('http')
            ? $link.attr('href')
            : window.location.origin + $link.attr('href');

        const analytics = {
          'name': $link.text().trim(),
          'position': position,
          'group': $link.attr('data-analytics-group'),
          'href': href,
        };

        if ($link.attr('target') && $link.attr('target') === '_blank') {
          analytics.exitmodal = "" + !$link.hasClass('external-link-popup-disabled');
        }

        if ($link.hasClass('external-link-popup-enabled')) {
          analytics.exitmodal = "true";
        }

        $link.attr('data-analytics-link', JSON.stringify(analytics));
      });
    }
  };

  Drupal.behaviors.AnalyticsVirtualPageView = {
    attach: function (context) {
      if (context !== document) {
        return;
      }

      $(document).trigger("virtualPageView");

      const createAttr = function () {
        $("a.ext, a.external-link-popup-enabled").on('click', function() {
          const $link = $(this);
          $(window).on('dialog:aftercreate', function(event, data) {
            const selector = '.external-link-popup';
            if (document.querySelector(selector)) {
              const analytics = {
                'name': 'Close',
                'position': 'body',
                'group': 'External Link Popup',
                'href': 'n/a',
              };

              document.querySelector(selector).setAttribute('data-test', 'modal');

              var title = document.querySelector(selector + ' .ui-dialog-title');
              if (title) {
                title.setAttribute('data-test', 'modal-title');
              }

              var body = document.querySelector(selector + ' .external-link-popup-body');
              if (body) {
                body.setAttribute('data-test', 'modal-body');
              }

              var buttons = document.querySelectorAll(selector + ' button');
              buttons.forEach(function (button) {
                button.classList.add('data-analytics-link');
              });

              var titlebarButton = document.querySelector(selector + ' .ui-dialog-titlebar button');
              if (titlebarButton) {
                titlebarButton.setAttribute('data-analytics-link', JSON.stringify(analytics));
                titlebarButton.setAttribute('data-test', 'modal-close');
              }

              analytics.name = 'Ok';
              analytics.href = $link.prop('href');
              var firstButton = document.querySelector(selector + ' .ui-dialog-buttonset button:first-child');
              if (firstButton) {
                firstButton.setAttribute('data-analytics-link', JSON.stringify(analytics));
                firstButton.setAttribute('data-test', 'modal-accept');
              }

              analytics.name = 'Cancel';
              analytics.href = 'n/a';
              var lastButton = document.querySelector(selector + ' .ui-dialog-buttonset button:last-child');
              if (lastButton) {
                lastButton.setAttribute('data-analytics-link', JSON.stringify(analytics));
                lastButton.setAttribute('data-test', 'modal-cancel');
              }
            }
          });

        });
      };

      createAttr();

      $(window).on('shown.bs.popover', function(event, data) {
        createAttr();
      });
    }
  };

})(jQuery, Drupal);
