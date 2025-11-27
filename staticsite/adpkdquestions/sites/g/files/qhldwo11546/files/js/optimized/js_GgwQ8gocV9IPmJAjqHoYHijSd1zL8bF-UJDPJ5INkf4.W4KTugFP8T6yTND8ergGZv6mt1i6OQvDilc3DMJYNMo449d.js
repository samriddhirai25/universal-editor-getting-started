"use strict";

(function ($, Drupal, once) {
  Drupal.behaviors.AnalyticsVirtualPageView = {
    attach: function attach(context) {
      if (context !== document) {
        return;
      }

      $(document).trigger('virtualPageView');
      var $link;
      $(once('analyticsVirtualPageView', 'a', context)).each(function () {
        var $anyLink = $(this);
        $anyLink.on('click', function () {
          $link = $anyLink;
        });
      });

      var shownModalHandler = function shownModalHandler() {
        var selector = '.external-link-popup';

        if (document.querySelector(selector)) {
          var isBeforeYouGoShown = localStorage.getItem('beforeYouGo');
          var isBeforeYouGoShownSession = sessionStorage.getItem('beforeYouGo');
          var analytics = {
            'name': 'Close',
            'position': 'body',
            'group': 'External Link Popup',
            'href': 'n/a'
          };
          document.querySelector(selector).setAttribute('data-test', 'modal');
          var title = document.querySelector("".concat(selector, " .modal-title"));

          if (title) {
            title.setAttribute('data-test', 'modal-title');
          }

          var body = document.querySelector("".concat(selector, " .modal-body"));

          if (body) {
            body.setAttribute('data-test', 'modal-body');
          }

          var buttons = document.querySelectorAll("".concat(selector, " .btn"));
          buttons.forEach(function (button) {
            button.classList.add('data-analytics-link');
          });
          var titlebarButton = document.querySelector("".concat(selector, " .modal-header button"));

          if (titlebarButton) {
            titlebarButton.setAttribute('data-analytics-link', JSON.stringify(analytics));
            titlebarButton.setAttribute('data-test', 'modal-close');
          }

          var footerButtons = document.querySelectorAll("".concat(selector, " .modal-footer .btn"));
          footerButtons.forEach(function (footerButton) {
            delete analytics.exitmodal;
            analytics.name = footerButton.textContent;
            var isDataDismissModal = footerButton.getAttribute('data-dismiss') === 'modal';
            analytics.href = 'n/a';

            if ($link) {
              if (!$link.hasClass('link-no-href') && !isDataDismissModal) {
                analytics.href = $link.prop('href');

                if (!isBeforeYouGoShown) {
                  analytics.exitmodal = true;
                } else {
                  delete analytics.exitmodal;
                }

                if (isBeforeYouGoShownSession) {
                  delete analytics.exitmodal;
                }
              }
            }

            footerButton.setAttribute('data-analytics-link', JSON.stringify(analytics));
            footerButton.setAttribute('data-test', isDataDismissModal ? 'modal-cancel' : 'modal-accept');
          });
        }
      };

      $(once('analyticsVirtualPageView', 'body', context)).on('shown.bs.modal', shownModalHandler);
    }
  };
})(jQuery, Drupal, once);
