"use strict";

(function ($, Drupal, cookies) {
  Drupal.behaviors.ieWarningPopup = {
    attach: function attach(context) {
      var $popup = $('#spb-block-ie-expiration-warning', context);
      var $overlay = $popup.find('.spb_overlay');
      var $body = $('body');
      var $closePopup = $('.spb_close');
      var $allFocused = $popup.find('[tabindex="0"], button, a');
      var $firstToFocus = $allFocused.eq(0);
      var $lastToFocus = $allFocused.eq(-1);
      var $agreeBtn = $popup.find('button');
      var delay = 1000;
      var isIeAgreed = cookies.get('ie-agreed');
      $closePopup.attr('tabindex', 0).attr('aria-label', 'Close');

      var handlePopupA11y = function handlePopupA11y() {
        function setIEAgreed() {
          cookies.set('ie-agreed', '1');
        }

        function removeBtnListener() {
          $popup[0].removeEventListener("keydown", handleBtns);
        }

        function addBtnListener() {
          $popup[0].addEventListener("keydown", handleBtns);
        }

        function handleBtns(event) {
          if (event.keyCode === 13) {
            $overlay.hide();
            $body.css('overflow', 'auto');
            removeBtnListener();
          }

          if (event.keyCode === 27) {
            $overlay.hide();
            $body.css('overflow', 'auto');
            removeBtnListener();
          }
        }

        $lastToFocus.on('click', function (event) {
          $overlay.hide();
          $body.css('overflow', 'auto');
          removeBtnListener();
          setIEAgreed();
        });
        $lastToFocus.on('keydown', function (event) {
          if (event.key === 'Tab') {
            $firstToFocus.focus();
            event.preventDefault();
          }

          if (event.key === "Enter") {
            setIEAgreed();
          }
        });
        $(once('html', $firstToFocus)).on('keydown', function (event) {
          if (event.shiftKey && event.key === 'Tab') {
            $lastToFocus.focus();
            event.preventDefault();
          }
        });
        $firstToFocus.focus();
        addBtnListener();
      };

      function showPopup() {
        setTimeout(function () {
          if ($popup.length > 0) {
            $popup.fadeIn();
            $overlay.show();
            $body.css({
              'overflow': 'hidden'
            });
            handlePopupA11y();
          }
        }, delay);
      }

      function isIE() {
        var ua = navigator.userAgent;
        var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        return is_ie;
      }

      if (isIE() && !isIeAgreed) {
        showPopup();
      }
    }
  };
})(jQuery, Drupal, window.Cookies);
