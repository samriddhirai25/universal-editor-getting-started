(function ($, Drupal) {

  'use strict';

  function initPopovers() {
    let windowWidth = $(window).width();

    $("[data-toggle=popover]").each(function(i, obj) {
      let placementDesktop = $(this).attr('data-placement-desktop');
      let placementMobile = $(this).attr('data-placement-mobile');
      let id = $(this).attr('id');

      $(this).popover({
        html: true,
        sanitize: false,
        placement: windowWidth > 991 ? placementDesktop : placementMobile,
        content: function() {
          return $('#popover-content__' + id).html();
        }
      });
    });
  }

  Drupal.behaviors.otsuka_disease_microsite_theme = {
    attach: function (context, settings) {

      initPopovers();

      $(document).on("click", ".popover .close-popover" , function() {
        $(this).parents(".popover").popover('hide');
        // Focus on Trigger after close
        let id = $(this).attr('data-id');
        let el = $(document).find('#' + id);
        if (el.length === 0) {
          let timer = setInterval(function() {
            let el = $(document).find('#' + id);
            if (el.length > 0) {
              clearInterval(timer);
              el.focus();
            }
          }, 100);
        } else {
          el.focus();
        }
      });

      // Set focus on first element on popup.
      function setFocus(element) {
        let selectors = 'a, button'; // Elements for focus.
        $(selectors, element).first().focus();
      }
      // Focus on click on Big Popover.
      $(document).on("click", ".popover-trigger.big" , function() {
        let id = $(this).attr('id');
        let s = '.popover.show .' + id + '-body';
        if ($(document).find(s).length === 0) {
          let timer = setInterval(function() {
            if ($(document).find(s).length > 0) {
              let el = document.querySelector(s);
              clearInterval(timer);
              trapFocus(el);
              setFocus(s);
            }
          }, 100);
        } else {
          let el = document.querySelector(s);
          trapFocus(el);
          setFocus(s);
        }
      });

      $(window).on('resize', function() {
        $("[data-toggle=popover]").popover('dispose');
        initPopovers();
      });

    }
  };

})(jQuery, Drupal);
