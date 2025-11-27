"use strict";

(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.otsukaAnalytics = {
    attach: function attach(context, settings) {
      if (!$(context).length) {
        return;
      }

      var analyticsCodeGenerate = function analyticsCodeGenerate(id) {
        return String(CryptoJS.MD5(id)).slice(-5);
      };

      var setAnalyticsAttr = function setAnalyticsAttr($target, attribute, value) {
        $(once('data-analytics-' + attribute + '-attribute-set', $target)).each(function () {
          if (!$(this).attr(attribute)) {
            $(this).attr(attribute, value);
          }
        });
      };

      var $header = $('#section-header', context);
      var $headerTarget = $('a, button, .custom--analytics-marker, .region--mobile-menu a', $header);
      setAnalyticsAttr($headerTarget, 'data-analytics-position', 'Header');
      var $overlay = $('.modal', context);
      var $overlayTarget = $('a, button, .custom--analytics-marker', $overlay);
      setAnalyticsAttr($overlayTarget, 'data-analytics-position', 'Overlay');
      var $cookieBanner = $('#section-footer', context);
      var $cookieBannerTarget = $('.agree-button', $cookieBanner).addClass('analytics--o-cookie-accept');
      var $cookieBannerTarget1 = $('.decline-button', $cookieBanner).addClass('analytics--o-cookie-reject');
      setAnalyticsAttr($cookieBannerTarget, 'data-analytics-id', 'cookie-a');
      setAnalyticsAttr($cookieBannerTarget1, 'data-analytics-id', 'cookie-r');
      var $hero = $('.custom--hero-spot', context);
      var $heroTarget = $('a, button, .custom--analytics-marker', $hero);
      setAnalyticsAttr($heroTarget, 'data-analytics-position', 'Hero Spot');
      var $isi = $('.inline-isi-wrapper, .isi-tray', context);
      var $isiTarget = $('a, button, .custom--analytics-marker', $isi);
      setAnalyticsAttr($isiTarget, 'data-analytics-position', 'ISI');
      var $main = $('#main-content', context);
      var $mainTarget = $('a, button, .custom--analytics-marker', $main);
      var $redBorderLinks = $('.custom--red-border-block a', $main);
      var $cards = $('.call-to-action__card a', $main);
      var $standartBodyCopy = $('.paragraph--type--standard-body-copy a', $main);
      var $linkAnalyticsMarker = $('.link-analytics-id', $main);
      setAnalyticsAttr($mainTarget, 'data-analytics-position', 'Body');
      $redBorderLinks.each(function () {
        setAnalyticsAttr($(this), 'class', 'analytics--p-cta');
        setAnalyticsAttr($(this), 'data-analytics-id', analyticsCodeGenerate($(this).text() + $(this).attr('href')));
      });
      $cards.each(function () {
        setAnalyticsAttr($(this), 'class', 'analytics--d-link');
        setAnalyticsAttr($(this), 'data-analytics-id', analyticsCodeGenerate($(this).text() + $(this).attr('href')));
      });
      $linkAnalyticsMarker.each(function () {
        setAnalyticsAttr($(this), 'data-analytics-id', analyticsCodeGenerate($(this).text() + $(this).attr('href')));
      });
      $linkAnalyticsMarker.each(function () {
        setAnalyticsAttr($(this), 'class', 'analytics--p-text-link');
        setAnalyticsAttr($(this), 'data-analytics-id', analyticsCodeGenerate($(this).text() + $(this).attr('href')));
      });
      var $logos = $('.block-content-oapi-logo-footer a, .block-content-otsuka-logo-desktop a, .block-content-otsuka-logo-mobile a', context);
      $logos.each(function () {
        setAnalyticsAttr($(this), 'data-analytics-id', analyticsCodeGenerate($(this).text() + $(this).attr('href')));
      });
      var $footer = $('#section-footer', context);
      var $footerTarget = $('a, button, .custom--analytics-marker', $footer);
      setAnalyticsAttr($footerTarget, 'data-analytics-position', 'Footer');
      $(once('analytics--p-reference-expand', '.analytics--p-reference-expand', context)).each(function () {
        $(this).on('click', function () {
          $(this).toggleClass('analytics--p-reference-expand').toggleClass('analytics--p-reference-collapse');
        });
      });
      $(once('analytics--directory-view', '.block-views-blockdirectory-block-1 a', context)).each(function () {
        $(this).addClass('analytics--p-text-link');

        if (!$(this).attr('data-analytics-id')) {
          var id = analyticsCodeGenerate('directory-link-' + $(this).attr('href') + $(this).html() + $(this).attr('class'));
          $(this).attr('data-analytics-id', id);
        }
      });
      $(once('analytics--directory-view', '.doctor-finder-tool a', context)).each(function () {
        if (!$(this).attr('data-analytics-id')) {
          var id = analyticsCodeGenerate('directory-link-' + $(this).attr('href') + $(this).html() + $(this).attr('class'));
          $(this).attr('data-analytics-id', id);
        }
      });
      $(once('analytics--v-click', 'video', context)).each(function () {
        var $_self = $(this);
        $(this).addClass('analytics--v-click');
        var src = $('source', $_self).attr('src');
        $(this).attr('data-analytics-video-name', src);
        var videoId = String(CryptoJS.MD5(src)).slice(-5);
        $(this).attr('data-analytics-id', videoId);
      });
      $(document).bind('DOMNodeInserted DOMNodeRemoved', function (element) {
        var $target = $(element.target);

        if ($target.hasClass('webform-ajax-form-wrapper')) {
          var $form = $('form', $target);
          var $alert = $('.alert-wrapper', $target);
          var optionTexts = [];

          if ($('.alert-danger', context).length) {
            var text = $('.item-list__comma-list li a', $alert).each(function () {
              optionTexts.push($(this).text());
            });
            text = optionTexts.join(', ');
            $alert.attr('data-analytics-form-name', $form.attr('data-analytics-form-name')).attr('data-analytics-form-error', text).addClass('analytics--f-error');
          }
        }
      });
      var $finder = $('.doctor-finder-tool', context);

      if ($finder && typeof context.body === 'undefined') {
        var $rows = $('.doctor-finder-tool .results .views-row', context);
        var $form = $('form', $finder);

        if ($rows.length) {
          $form.find('.form-submit').addClass('analytics--f-complete');
        }

        var $errors = $('.form-item--error-message', $form);

        if ($errors.length) {
          var msg = $errors.map(function () {
            return $(this).text().trim();
          }).get().join(' ');
          $form.find('.form-submit').addClass('analytics--f-error').attr('data-analytics-form-error', msg);
        }
      }

      var $wf_confirmation = $('.webform-confirmation-modal--content', context);

      if ($wf_confirmation.length && $(context).is('form')) {
        var formName = $(context).attr('data-analytics-form-name');
        $wf_confirmation.addClass('analytics--f-complete').attr('data-analytics-form-name', formName);
      }

      var setFormAttributes = function setFormAttributes($form) {
        var $block = $form.closest('.block');
        var formName = 'form--' + $block.attr('id');
        $form.addClass('analytics--f-' + formName);

        if (!$form.attr("data-analytics-form-name")) {
          $form.attr('data-analytics-form-name', formName);
        }

        $(once('webform--input' + formName, $form, 'input, select, textarea')).each(function () {
          if ($(this).attr('name')) {
            $(this).addClass('analytics--f-' + $(this).attr('name'));
          }

          if (!$(this).hasClass('form-submit')) {
            $(this).addClass('analytics--f-question');
          }

          if (!$(this).attr("data-analytics-form-name")) {
            $(this).attr('data-analytics-form-name', formName);
          }

          if (!$(this).attr("data-analytics-form-field")) {
            $(this).attr('data-analytics-form-field', $(this).attr('name'));
          }
        });
        $(':submit', $form).addClass('analytics--f-submit');
      };

      $(document).bind('DOMNodeInserted DOMNodeRemoved', function (element) {
        var $target = $(element.target);

        if ($target.hasClass('webform-ajax-form-wrapper') || $target.hasClass('block-webform-block')) {
          var $form = $('form', $target);
          setFormAttributes($form);
          $('#drupal-modal').on('dialogopen', function (event) {
            var $uiDialog = $(this).closest('.ui-dialog');
            $('.ui-dialog-titlebar .ui-dialog-titlebar-close', $uiDialog).addClass('analytics--o-form-close').attr('data-analytics-id', 'uim01').attr('data-analytics-position', 'Overlay');
          });
        }
      });
      $(once('webform--form', 'form', context)).each(function () {
        var $form = $(this);
        setFormAttributes($form);
      });
      $(once('otsuka-analytics', 'body', context)).on('dialog:beforecreate shown.bs.modal', function (e) {
        var $modalForm = $(e.target).find('form');

        if ($modalForm.length) {
          $(document).trigger('virtualFormView');
        }
      }).on('dialog:beforeclose hide.bs.modal', function (e) {
        var $modalForm = $(e.target).find('form');

        if ($modalForm.length) {
          $(document).trigger('virtualFormAbandon');
        }
      });
    }
  };
})(jQuery, Drupal, once);
