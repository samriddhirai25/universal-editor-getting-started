"use strict";

(function ($, Drupal) {
  Drupal.behaviors.otsukaRexultiRegistrationPage = {
    attach: function attach(context) {
      var body = $('body');
      var radios = body.find('input[type="radio"]', context);
      var checkboxes = body.find('input[type="checkbox"]', context);
      var key = {
        'tab': 9,
        'enter': 13,
        'space': 32,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40
      };
      radios.on('keydown', function (e) {
        var keyCode = e.keyCode;

        if ([key.enter, key.space].indexOf(keyCode) >= 0) {
          e.preventDefault();
          $(this).trigger('click');
        }

        if ([key.tab].indexOf(keyCode) >= 0) {
          var radioElementWrapper = $(this).parent();
          var radioContainer = $(this).closest('.js-webform-radios');

          var _radios = radioContainer.find('.form-item');

          var radioIndex = _radios.index(radioElementWrapper[0]);

          var radiosCount = _radios.length;

          if (!e.shiftKey) {
            if (radioIndex < radiosCount - 1) {
              e.preventDefault();
              radioElementWrapper.next().find('input[type="radio"]').focus();
            }
          } else {
            if (radioIndex !== 0) {
              e.preventDefault();
              radioElementWrapper.prev().find('input[type="radio"]').focus();
            }
          }
        }
      });
      $(once('html', checkboxes)).on('keydown', function (e) {
        var keyCode = e.keyCode;

        if ([key.enter, key.space].indexOf(keyCode) >= 0) {
          e.preventDefault();
          $(this).trigger('click');
        }
      });
      var signUpClass = '.paragraph--type--sticky-sign-up-component';
      body.on('keyup', function (e) {
        var keyCode = e.keyCode;

        if ([key.tab].indexOf(keyCode) >= 0) {
          if ($(document.activeElement).closest(signUpClass).length) {
            $(signUpClass).addClass('focused-by-tab');
          } else {
            $(signUpClass).removeClass('focused-by-tab');
          }
        }
      });
      window.addEventListener('click', function (e) {
        if (!$(e.target).closest(signUpClass).length) {
          $(signUpClass).removeClass('focused-by-tab');
        }
      });
    }
  };
})(jQuery, Drupal);
