"use strict";

(function ($, Drupal) {
  var linkAddress;
  var positionFixedClass = 'position-fixed';
  var $body = $('body');

  var fixedBody = function fixedBody() {
    if (!$body.hasClass(positionFixedClass)) {
      var scrollY = window.scrollY;
      $body.addClass(positionFixedClass);
      document.body.style.top = "-".concat(scrollY, "px");
    }
  };

  var unfixedBody = function unfixedBody() {
    if ($body.hasClass(positionFixedClass)) {
      var scrollY = document.body.style.top;
      $body.removeClass(positionFixedClass);
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  Drupal.behaviors.beforeYouGoWebformPopup = {
    attach: function attach(context) {
      var $document = $(document, context);
      var $window = $(window);
      var $body = $('body', context);
      var $a = $('a', context);
      var $beforeYouGoContinue = $('.before-you-go-continue', context);
      var self = this;
      var localStorageKey = 'beforeYouGo';
      var beforeYouGoClasses = {
        created: 'before-you-go-created',
        disabled: 'before-you-go-disabled',
        link: 'before-yougo-link'
      };
      $a.click(function () {
        var element = $(this).get(0);
        var address = element.getAttribute('href');
        var domain = self.getDomain(address);

        if (domain) {
          linkAddress = address;
        }
      });
      $body.on('click', '#externalLinkPopupModalContinueButton', function (e) {
        if (!localStorage.getItem(localStorageKey) && !sessionStorage.getItem(localStorageKey) && !$('#externalLinkPopupModal').hasClass(beforeYouGoClasses.disabled)) {
          e.preventDefault();
          var link = document.getElementsByClassName(beforeYouGoClasses.link);

          if (link.length > 0) {
            link[0].click();
          }
        }
      });

      function setAnalyticsData($selector, name) {
        var href = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'n/a';
        var analyticsData = {
          'name': name,
          'position': 'body',
          'group': 'Before you go popup form',
          'href': href
        };
        $($selector).attr('data-analytics-link', JSON.stringify(analyticsData));
      }

      $window.on('dialog:aftercreate', function (event, dialog, $element) {
        fixedBody();
        $body.addClass(beforeYouGoClasses.created);
        $document.on('keyup', function (e) {
          if (e.key === 'Escape' && $($element).find('.webform-confirmation').length === 0) {
            if (!localStorage.getItem(localStorageKey) && !sessionStorage.getItem(localStorageKey)) {
              window.open(linkAddress, '_blank').focus();
            }

            sessionStorage.setItem(localStorageKey, '1');
          }
        });
      });
      var formErrors = [];

      var validateForm = function validateForm($form) {
        formErrors = [];
        $form.find('.form-control:valid, .form-check-input:valid').each(function () {
          var $field = $(this);
          var $invalidFeedback = $field.closest('.form-item').find('.form-item--error-message');
          $field.removeClass('empty');
          $invalidFeedback.removeClass('validated');
        });
        $form.find('.form-control:invalid, .form-check-input:invalid').each(function () {
          var $field = $(this);
          var $invalidFeedback = $field.closest('.form-item').find('.form-item--error-message');
          var requiredError = $field.attr('data-webform-required-error');
          var patternError = $field.attr('data-webform-pattern-error');

          if (this.validity.valueMissing) {
            $invalidFeedback.html(requiredError);
          } else {
            $invalidFeedback.html(patternError);
          }

          if (!this.validity.valueMissing && !$field.val()) {
            $field.addClass('empty');
            $invalidFeedback.addClass('validated');
          } else {
            $field.removeClass('empty');
            $invalidFeedback.removeClass('validated');
            var errorText = $invalidFeedback.text().trim();

            if (errorText) {
              formErrors.push(errorText);
            }
          }
        });
        return formErrors;
      };

      $(context).ajaxComplete(function (event, xhr, settings) {
        var $form = $('.before-you-go-dialog-form');
        var $submitBtn = $('.webform-button--submit.before-you-go-btn');
        var $continueBtn = $('.before-you-go-continue.before-you-go-btn');
        var $closeBtn = $('button.ui-dialog-titlebar-close');

        if (settings.url.includes('/form/before-you-go-popup-form')) {
          setAnalyticsData($submitBtn, $submitBtn.text().trim(), linkAddress);
          setAnalyticsData($continueBtn, $continueBtn.text().trim(), linkAddress);
          setAnalyticsData($closeBtn, 'Close');
          var formSubmittedSuccessfully = $form.find('.webform-confirmation').length > 0;

          var _formErrors = validateForm($form);

          if (formSubmittedSuccessfully) {
            localStorage.setItem(localStorageKey, '1');
            $(document).trigger("form_complete", {
              data: {
                form_name: "jynarque|dtc|informative resource signup form",
                form_type: "signup form|non-dynamic"
              }
            });
          } else {
            if (_formErrors.length !== 0) {
              $(document).trigger("form_error", {
                data: {
                  form_name: "jynarque|dtc|informative resource signup form",
                  form_type: "signup form|non-dynamic",
                  form_error_messages: _formErrors
                }
              });
            }
          }
        }
      });
      $window.on('dialog:afterclose', function (event, dialog, $element) {
        if ($($element).find('.webform-confirmation').length > 0) {
          if ($body.hasClass(beforeYouGoClasses.created)) {
            window.open(linkAddress, '_blank').focus();
            $body.removeClass(beforeYouGoClasses.created);
          }
        }

        unfixedBody();
      });
      $beforeYouGoContinue.on('click', function (e) {
        e.preventDefault();
        $(this).parents('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click');
        sessionStorage.setItem(localStorageKey, '1');
        window.open(linkAddress, '_blank').focus();
      });
      $('input[data-drupal-selector=edit-first-name]').on('change', function () {
        var $form = $(this).parents('form');
        $('input[data-drupal-selector=edit-sfmc-contact-info-first-name]', $form).val($(this).val());
      });
      $('input[data-drupal-selector=edit-last-name]').on('change', function () {
        var $form = $(this).parents('form');
        $('input[data-drupal-selector=edit-sfmc-contact-info-last-name]', $form).val($(this).val());
      });
      $('input[data-drupal-selector=edit-email-address]').on('change', function () {
        var $form = $(this).parents('form');
        $('input[data-drupal-selector=edit-sfmc-email-personal-email-address]', $form).val($(this).val());
      });
      $('input[name=diagnosed_with_adpkd]').on('change', function () {
        var $form = $(this).parents('form');
        var adpkdDiagnosis = $('input[name=diagnosed_with_adpkd]:checked', $form).val();
        $('input[data-drupal-selector=edit-sfmc-survey-response-adpkd-diagnosis-answer-code]', $form).val(adpkdDiagnosis);
      });
    },
    getDomain: function getDomain(url) {
      if (typeof url !== 'string') {
        return null;
      }

      var matches = url.match(/\/\/([^/]+)\/?/);
      return matches && matches[1];
    }
  };
})(jQuery, Drupal);
