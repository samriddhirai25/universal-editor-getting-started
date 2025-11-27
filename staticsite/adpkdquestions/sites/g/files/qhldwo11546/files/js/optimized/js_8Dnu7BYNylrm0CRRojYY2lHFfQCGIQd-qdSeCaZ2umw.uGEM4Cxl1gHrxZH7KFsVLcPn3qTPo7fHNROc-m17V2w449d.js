"use strict";

(function ($, Drupal) {
  Drupal.behaviors.otsukaDesignSystem = {
    attach: function attach(context, settings) {
      $('.modal').on('show.bs.modal', function () {
        $('html', context).addClass('js--modal-open');
      }).on('hide.bs.modal', function () {
        $('html', context).removeClass('js--modal-open');
      });
      var hash = window.location.hash;
      var delay = 200;

      if (hash) {
        hash = hash.replace('anchor-', '');
        var $element = $(hash, context);

        if ($element.length) {
          setTimeout(function () {
            var distance = $element.offset().top;

            if (window.scrollY > distance) {
              distance -= $('.header').outerHeight();
            }

            if ($element.hasClass('paragraph--type--did-you-know-paragraph')) {
              var titleHeight = $element.find('.field-name-field-didyouknow-title').css('top').replace(/[^-\d\.]/g, '');
              titleHeight = parseInt(titleHeight);
              distance += titleHeight;
            }

            $('html, body').animate({
              scrollTop: distance
            }, 500);
          }, delay);
        }
      }

      var setHeaderPosition = function setHeaderPosition() {
        $('header').css('top', 0);
      };

      setTimeout(function () {
        setHeaderPosition();
      }, delay);
      $(window).resize(function () {
        setHeaderPosition();
      });
    },
    debounce: function debounce(func) {
      var _this = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var timer;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(_this, args);
        }, timeout);
      };
    },
    throttle: function throttle(callback) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var waiting = false;
      return function () {
        if (!waiting) {
          callback.apply(this, arguments);
          waiting = true;
          setTimeout(function () {
            waiting = false;
          }, limit);
        }
      };
    }
  };
  Drupal.behaviors.AddWysiwigLinksAnalytics = {
    attach: function attach(context) {
      once('AddWysiwigLinksAnalytics', '.add-analytics', context).forEach(function (link) {
        var $link = $(link);
        var href;
        var position = $link.closest('footer, header, body').first().prop('tagName').toLowerCase();

        if ($link.attr('href')) {
          var linkHref = $link.attr('href');

          if (linkHref.startsWith('http') || linkHref.startsWith('tel:') || linkHref.startsWith('mailto:')) {
            href = $link.attr('href');
          } else {
            href = window.location.origin + $link.attr('href');
          }
        }

        var analytics = {
          'name': $link.text().trim(),
          'position': position,
          'group': $link.attr('data-analytics-group'),
          'href': href ? href : 'n/a'
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
})(jQuery, Drupal);
