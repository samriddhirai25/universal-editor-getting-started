"use strict";

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.externalLinkPopup.openDialog = function (element, settings, className) {
    sessionStorage.setItem('beforeYouGo', '1');
    var externalLinkPopupModal = $('#externalLinkPopupModal');

    if ($(element).hasClass('before-you-go-disabled')) {
      externalLinkPopupModal.addClass('before-you-go-disabled');
    } else {
      externalLinkPopupModal.removeClass('before-you-go-disabled');
    }

    var url = $(element).attr('href');
    var text = $(element).text();
    var bodyHtml = settings.body.replace('[link:url]', this.htmlEncode(url)).replace('[link:text]', this.htmlEncode(text));
    var closeButton = $('#externalLinkPopupModalCloseButton');
    var continueButton = $('#externalLinkPopupModalContinueButton');
    $('#externalLinkPopupModalLabel').html(settings.title);
    closeButton.html(settings.labelno);
    continueButton.html(settings.labelyes);
    continueButton.unbind('click').bind('click', function () {
      if (localStorage.getItem('beforeYouGo') || sessionStorage.getItem('beforeYouGo') || externalLinkPopupModal.hasClass('before-you-go-disabled')) {
        window.open(element.href, element.target);
      }

      $('.modal-content').find('.close').trigger('click');
    });
    $('#externalLinkPopupModalBody').html(bodyHtml);
    externalLinkPopupModal.modal();
    $('.modal-footer a').click(function (event) {
      event.preventDefault();
    });
  };
})(jQuery, Drupal, drupalSettings);
