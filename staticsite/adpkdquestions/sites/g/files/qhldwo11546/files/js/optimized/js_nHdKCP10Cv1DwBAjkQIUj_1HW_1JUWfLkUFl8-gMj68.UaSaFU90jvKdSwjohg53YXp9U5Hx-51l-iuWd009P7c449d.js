"use strict";

(function ($, Drupal) {
  Drupal.behaviors.videoBackground = {
    attach: function attach(context, settings) {
      var $body = $('body');
      var videoAutoplay = true;
      var videoPlaying = true;
      var videoPlayingPreviousState = false;
      var Animation = {
        animateVideo: function animateVideo() {
          var self = this;
          var video = document.getElementById('videoBackground');
          var canvas = document.getElementById('videoBackgroundCanvas');
          var context = canvas.getContext('2d');
          var width = 950;
          var height = 534;
          var $playBigButton = $('#playBigButton');
          var $videoPlayDescription = $('.custom--video-background .video-play-description');
          var firstPlay = true;
          canvas.width = width;
          canvas.height = height;
          video.addEventListener('play', function () {
            self.draw(this, context, width, height);
          }, false);

          if (!settings.path.isFront) {
            var playBigButtonActions = function playBigButtonActions() {
              $playBigButton.hide();
              firstPlay = false;
              video.currentTime = 0;
              video.play();
              videoPlaying = true;
              videoPlayingPreviousState = true;
              $('.video-play-description').hide();
              $('#customVideoControls').fadeIn();
              $playPauseButton.focus();
            };

            var pauseVideoAction = function pauseVideoAction() {
              videoPlayingPreviousState = false;
              videoPlaying = false;
              video.pause();
              $playPauseButton.attr('data-state', 'pause');
            };

            var playVideoAction = function playVideoAction() {
              videoPlayingPreviousState = true;
              videoPlaying = true;
              video.play();
              $playPauseButton.attr('data-state', 'play');
            };

            var playerActionByState = function playerActionByState(state) {
              switch (state) {
                case 'play':
                  pauseVideoAction();
                  break;

                case 'pause':
                  playVideoAction();
                  break;

                case 'reload':
                  playVideoAction();
                  video.currentTime = 0;
                  break;
              }
            };

            video.addEventListener('timeupdate', function () {
              if (this.currentTime >= 15 && firstPlay) {
                video.pause();
                videoPlaying = false;
                $playBigButton.show();
                $videoPlayDescription.fadeIn();
                $body.find('#playPause').attr('data-state', 'play');
              }
            });
            video.addEventListener('ended', function () {
              if (firstPlay) {
                $playBigButton.show();
              }
            });
            $playBigButton.on('click', function () {
              playBigButtonActions();
            });
            $playBigButton.on('keypress', function (e) {
              var keyID = e.keyCode;

              if (keyID === 32 || keyID === 13) {
                e.preventDefault();
                playBigButtonActions();
              }
            });
            var $progress = $('#progress');
            $progress.rangeslider({
              polyfill: false,
              onSlide: function onSlide(position, value) {
                if ($body.find('.rangeslider').hasClass('rangeslider--active')) {
                  video.pause();
                  videoPlaying = false;
                } else {
                  if (videoPlayingPreviousState) {
                    videoPlaying = true;
                    video.play();
                  }
                }

                if (!videoPlaying) {
                  video.currentTime = value;
                }
              }
            });
            video.addEventListener('playing', function (event) {
              if (videoPlaying) {
                var timelineProgress = function timelineProgress() {
                  if (video.currentTime >= video.duration) {
                    clearInterval(updateProgress);
                    videoPlaying = false;
                    $body.find('#playPause').attr('data-state', 'reload');
                  } else {
                    $progress.val(video.currentTime).change();
                  }
                };

                var updateProgress = setInterval(timelineProgress, 50);
              }
            });
            var $playPauseButton = $('#playPause');
            $playPauseButton.on('mouseup', function () {
              var state = $(this).attr('data-state');
              playerActionByState(state);
            });
            $playPauseButton.add($progress).on('keypress', function (e) {
              var keyID = e.keyCode;

              if (keyID === 32 || keyID === 13) {
                e.preventDefault();
                var state = $playPauseButton.attr('data-state');
                playerActionByState(state);
              }
            });
          }

          if (videoAutoplay) {
            video.play();
            self.draw(video, context, width, height);
          }
        },
        draw: function draw(video, context, width, height) {
          var self = this;
          if (video.ended) return false;
          context.drawImage(video, 0, 0, width, height);
          setTimeout(function () {
            self.draw(video, context, width, height);
          }, 40);
        }
      };
      window.Animation = Animation;
      Animation.animateVideo();
    }
  };
})(jQuery, Drupal);
