"use strict";

(function ($, Drupal) {
  Drupal.behaviors.lazyAnchor = {
    attach: function attach(context) {
      var lazyAnchor = 'lazy-anchor';
      var pagePath = window.location.pathname;
      var urlSearchParams = new URLSearchParams(window.location.search);
      var urlParams = Object.fromEntries(urlSearchParams.entries());
      var lazyAnchorValue = urlParams["".concat(lazyAnchor)];

      function scrollToElement(elAnchor) {
        var elAnchorId = $("#".concat(elAnchor));
        var lazyOffset = parseInt(elAnchorId.css('margin-top'));
        $('html, body', context).animate({
          scrollTop: elAnchorId.offset().top - lazyOffset
        }, 1000);
      }

      $(".".concat(lazyAnchor), context).click(function (e) {
        e.preventDefault();
        var elHref = $(this).attr('href');
        var elUrlStr = "".concat(window.location.protocol, "//").concat(window.location.hostname).concat(elHref);
        var elUrl = new URL(elUrlStr);
        var elUrlParams = new URLSearchParams(elUrl.search);
        var elClearPath = '';
        var elAnchorPos = elHref.lastIndexOf('#');

        if (elHref.includes('?')) {
          elClearPath = elHref.slice(0, elHref.indexOf('?'));
        } else {
          elClearPath = elHref.slice(0, elAnchorPos);
        }

        var elAnchor = elHref.slice(elAnchorPos + 1, elHref.length);

        if (!elClearPath || elClearPath === pagePath) {
          scrollToElement(elAnchor);
        } else {
          elUrlParams.append(lazyAnchor, elAnchor);
          window.location.href = "".concat(elClearPath, "?").concat(elUrlParams);
        }
      });

      if (lazyAnchorValue) {
        scrollToElement(lazyAnchorValue);
        urlSearchParams["delete"](lazyAnchor);

        var _urlParams = Object.fromEntries(urlSearchParams.entries());

        if (Object.keys(_urlParams).length) {
          window.history.pushState('', '', "".concat(pagePath, "?").concat(urlSearchParams));
        } else {
          window.history.pushState('', '', pagePath);
        }
      }
    }
  };
})(jQuery, Drupal);
