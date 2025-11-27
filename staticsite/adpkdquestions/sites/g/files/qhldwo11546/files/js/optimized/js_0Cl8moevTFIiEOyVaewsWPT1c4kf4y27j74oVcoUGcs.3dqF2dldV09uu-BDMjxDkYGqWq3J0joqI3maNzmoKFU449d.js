"use strict";

(function ($, Drupal) {
  Drupal.behaviors.GSAnimation = {
    attach: function attach(context, settings) {
      gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);
      var desLineArrows = {
        c2: {
          a1: {
            selector: "#desLineArrow1_C2",
            template: "#desLine1Template_C2",
            path: "#desLine1Path_C2"
          },
          a2: {
            selector: "#desLineArrow2_C2",
            template: "#desLine2Template_C2",
            path: "#desLine2Path_C2"
          }
        }
      };
      var desPics = {
        c2: {
          p1: "#desPic1_C2",
          p2: "#desPic2_C2",
          p3: "#desPic3_C2"
        }
      };
      gsap.set("#desLineArrow1_C2 path", {
        fill: "#489537"
      });
      gsap.set(".des-pic", {
        autoAlpha: 0
      });
      gsap.set(desPics.c2.p1, {
        autoAlpha: 1
      });
      gsap.set(".des-line--arrow", {
        visibility: "visible",
        autoAlpha: 0
      });
      gsap.set(".des-line--path", {
        visibility: "visible",
        drawSVG: "0"
      });
      var tl = gsap.timeline({
        onUpdate: updateSlider
      });
      $('#timeRange').rangeslider({
        polyfill: false,
        onSlide: function onSlide(position, value) {
          tl.progress(value).pause();
        }
      });
      tl.progress(0).pause();

      function goArrowAnimation(arrowSelector, templateSelector, pathSelector) {
        var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var end = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var ease = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "none";
        var arrowSettings = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
        var drawStart = (start * 100).toString() + "%";
        var drawEnd = (end * 100).toString() + "%";
        gsap.to(arrowSelector, {
          autoAlpha: 1,
          duration: 0.5
        });
        gsap.set(pathSelector, {
          drawSVG: "0 " + drawStart
        });
        tl.to(arrowSelector, {
          duration: 5,
          ease: ease,
          immediateRender: true,
          motionPath: {
            path: templateSelector,
            align: templateSelector,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
            start: start,
            end: end
          }
        }, 0).to(pathSelector, {
          drawSVG: drawEnd,
          duration: 5,
          ease: ease
        }, 0);

        if (arrowSettings.hasOwnProperty('state1')) {
          tl.to(arrowSelector + " path", {
            fill: arrowSettings.state1.fill,
            duration: arrowSettings.state1.duration,
            ease: arrowSettings.state1.ease
          }, 0);
        }

        if (arrowSettings.hasOwnProperty('state2')) {
          tl.to(arrowSelector + " path", {
            fill: arrowSettings.state2.fill,
            duration: arrowSettings.state2.duration,
            ease: arrowSettings.state2.ease
          }, arrowSettings.state1.duration);
        }
      }

      function fadePictureAnimation(picSelector, position, progress) {
        if (progress >= position) {
          gsap.to(picSelector, {
            autoAlpha: 1
          });
        } else {
          gsap.to(picSelector, {
            autoAlpha: 0
          });
        }
      }

      var arrowFirstSettings = {
        state1: {
          fill: "#BFB233",
          duration: 2,
          ease: "none"
        },
        state2: {
          fill: "#D12229",
          duration: 3,
          ease: "power1.out"
        }
      };
      goArrowAnimation(desLineArrows.c2.a1.selector, desLineArrows.c2.a1.template, desLineArrows.c2.a1.path, 0.25, 1, "none", arrowFirstSettings);
      var customEase = CustomEase.create("custom", "M0,0,C0,0,0.238,0.275,0.372,0.45,0.424,0.518,0.462,0.552,0.514,0.614,0.56,0.67,0.583,0.685,0.634,0.736,0.677,0.779,0.711,0.816,0.76,0.854,0.797,0.882,0.805,0.887,0.846,0.912,0.886,0.936,0.902,0.944,0.934,0.966,0.967,0.989,1,1,1,1");
      goArrowAnimation(desLineArrows.c2.a2.selector, desLineArrows.c2.a2.template, desLineArrows.c2.a2.path, 0.28, 0.97, customEase);

      function updateSlider() {
        fadePictureAnimation(desPics.c2.p2, 0.2, tl.progress());
        fadePictureAnimation(desPics.c2.p3, 0.6, tl.progress());
      }

      var defaultSceneWidth = 810;
      var defaultSceneHeight = 450;
      var defaultTimelineHeight = 60;
      var sceneSelector = $('.disease-education-slider .scene');
      var sceneWrapperSelector = $('.disease-education-slider .scene-wrapper');
      var timelineWrapperSelector = $('.disease-education-slider .timeline-wrapper');
      var timelineTextSelector = $('.disease-education-slider .timeline-text');
      sceneWrapperSelector.css('opacity', '1');

      function setSceneScale() {
        var sceneWrapperWidth = sceneWrapperSelector.width();

        if (sceneWrapperWidth < defaultSceneWidth) {
          var sceneScale = sceneWrapperWidth / defaultSceneWidth;
          var sceneTranslateX = (1 - sceneScale) * 100 / 2;
          sceneSelector.css({
            'transform': 'translateX(-' + sceneTranslateX + '%) translateY(' + sceneTranslateX + '%) scale(' + sceneScale + ')'
          });
          sceneWrapperSelector.height(defaultSceneHeight * sceneScale);
          timelineTextSelector.height(defaultTimelineHeight * sceneScale);
          timelineWrapperSelector.css({
            'bottom': defaultTimelineHeight * sceneScale
          });
        } else {
          sceneSelector.css('transform', 'none');
          sceneWrapperSelector.height(defaultSceneHeight);
          timelineTextSelector.height(defaultTimelineHeight);
          timelineWrapperSelector.css('bottom', defaultTimelineHeight);
        }
      }

      setSceneScale();
      $(window).resize(function () {
        setSceneScale();
      });
      var timelineWrapper = $('.timeline-wrapper');
      timelineWrapper.on('mouseenter touchstart', '.rangeslider__handle', function () {
        timelineWrapper.find('input[type="range"]').addClass('pulsation-disabled');
      });
      timelineWrapper.on('focusin', 'input[type="range"]', function () {
        $(this).addClass('pulsation-disabled');
      });
    }
  };
})(jQuery, Drupal);
