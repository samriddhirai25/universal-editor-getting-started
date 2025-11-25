(function ($, Drupal) {
    'use strict';

    Drupal.behaviors.otsukaFocus = {
        attach: function (context, settings) {
            var $body = $('body', context);

            if (!$body.length) {
                return;
            }

            $body.on('mousedown', function () {
                $(this).addClass('user-is-clicking');
                $(this).removeClass('user-is-tabbing');
            });

            $body.on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 9) {
                    $(this).addClass('user-is-tabbing');
                    $(this).removeClass('user-is-clicking');
                }
            });
        }
    };
})
(jQuery, Drupal);
