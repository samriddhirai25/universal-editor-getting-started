jQuery(function($) {
  // Register Plugins
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, DrawSVGPlugin);

  // Defaults and Settings
  let fullpageDesktopBreakpoint = 1139;

  // Selectors
  let desContainers = {
    c1: "#desContainer_C1",
    c2: "#desContainer_C2",
  };
  let desLineArrows = {
    c1: {
      a1: {
        selector: "#desLineArrow1_C1",
        template: "#desLine1Template_C1",
        path: "#desLine1Path_C1",
      },
      a2: {
        selector: "#desLineArrow2_C1",
        template: "#desLine2Template_C1",
        path: "#desLine2Path_C1",
      },
    },
    c2: {
      a1: {
        selector: "#desLineArrow1_C2",
        template: "#desLine1Template_C2",
        path: "#desLine1Path_C2",
      },
      a2: {
        selector: "#desLineArrow2_C2",
        template: "#desLine2Template_C2",
        path: "#desLine2Path_C2",
      },
    },
  };
  let desPics = {
    c1: {
      p1: "#desPic1_C1",
      p2: "#desPic2_C1",
    },
    c2: {
      p1: "#desPic1_C2",
      p2: "#desPic2_C2",
      p3: "#desPic3_C2",
    },
  };
  let desPopups = {
    c1: {
      pu1: "#desPopup1_C1",
      pu2: "#desPopup2_C1",
      pu3: "#desPopup3_C1",
      pu4: "#desPopup4_C1",
    },
    c2: {
      pu1: "#desPopup1_C2",
      pu2: "#desPopup2_C2",
      pu3: "#desPopup3_C2",
    },
  };
  let desTitleWrappers = {
    t1: "#desTitleWrapper1",
  };

  let sceneHeight = 680; // px
  // Canvas 1 scroll height
  const containerHeight1 = sceneHeight * 11; // px
  // Canvas 2 scroll height
  const containerHeight2 = sceneHeight * 10; // px
  // Popups start position
  const yPopupPos = 150;
  // Popups animation duration
  const fadePopupDuration = 2;
  // Titles settings
  const xTitlePos = 500;
  const fadeTitleDuration = 20; // Change value to increase or decrease the animation duration

  let positionSettings = {
    // Canvas 1
    c1: {
      // Arrows
      a1: {
        start: 0.32,
        end: 0.7,
      },
      a2: {
        start: 0.3,
        end: 0.65,
      },
      // Pictures
      p1: {
        start: containerHeight1 * 0.1 + "px",
      },
      p2: {
        start: -containerHeight1 * 0.25 + "px",
      },
      // Popups
      pu1: {
        start: -containerHeight1 * 0.1 + "px",
        end: -containerHeight1 * 0.22 + "px",
        width: "696px",
      },
      pu2: {
        start: -containerHeight1 * 0.38 + "px",
        end: -containerHeight1 * 0.51 + "px",
        width: "696px",
      },
      pu3: {
        start: -containerHeight1 * 0.58 + "px",
        end: -containerHeight1 * 0.71 + "px",
        width: "696px",
      },
      pu4: {
        start: -containerHeight1 * 0.78 + "px",
        end: -containerHeight1 * 0.9 + "px",
        width: "682px",
      },
    },
    // Canvas 1
    c2: {
      // Title
      t1: {
        start: 0,
        end: "-1100%",
      },
      // Arrows
      a1: {
        start: 0.45,
        end: 1,
      },
      a2: {
        start: 0.5,
        end: 0.97,
      },
      // Pictures
      p1: {
        start: containerHeight2 * 0.1 + "px",
      },
      p2: {
        start: containerHeight2 * 0.1 + "px",
      },
      p3: {
        start: -containerHeight2 * 0.35 + "px",
      },
      // Popups
      pu1: {
        start: -containerHeight2 * 0.15 + "px",
        end: -containerHeight2 * 0.28 + "px",
        width: "696px",
      },
      pu2: {
        start: -containerHeight2 * 0.48 + "px",
        end: -containerHeight2 * 0.61 + "px",
        width: "696px",
      },
      pu3: {
        start: -containerHeight2 * 0.75 + "px",
        end: -containerHeight2 + "px",
        width: "682px",
      },
    },
  };


  // Line animation
  function goArrowAnimation(
      container,
      arrowSelector,
      templateSelector,
      pathSelector,
      start,
      end,
      drawStart,
      drawEnd,
      arrowSettings
  ) {
    gsap.to(arrowSelector, {
      scrollTrigger: {
        trigger: container,
        start: "top 100%",
      },
      autoAlpha: 1,
      duration: 0.5
    });
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 100%",
        end: "bottom 150%",
        scrub: true,
      }
    });

    // Motion Path
    tl.to(arrowSelector, {
      duration: 5,
      ease: "none",
      immediateRender: true,
      motionPath: {
        path: templateSelector,
        align: templateSelector,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: start,
        end: end,
      }
    }, 0);

    // Arrow change color
    if (arrowSettings.hasOwnProperty('state1')) {
      tl.to(arrowSelector + " path", {
        duration: arrowSettings.state1.duration,
        ease: arrowSettings.state1.ease,
        fill: arrowSettings.state1.fill,
      }, 0);
    }
    if (arrowSettings.hasOwnProperty('state2')) {
      tl.to(arrowSelector + " path", {
        duration: arrowSettings.state2.duration,
        ease: arrowSettings.state2.ease,
        fill: arrowSettings.state2.fill,
      }, arrowSettings.state1.duration);
    }

    // Draw SVG
    gsap.set(pathSelector, {drawSVG: "0 " + drawStart});
    tl.to(pathSelector, {
      drawSVG: drawEnd,
      duration: 5,
      ease: "none"
    }, 0);
  }

  // Picture animation
  function fadePictureAnimation(
      container,
      picSelector,
      position
  ) {
    gsap.to(picSelector, {
      scrollTrigger: {
        trigger: container,
        start: "top " + position,
        end: "+=200", // Animation duration
        scrub: 1,
      },
      autoAlpha: 1,
    });
  }

  // Popup animation
  function fadePopupAnimation(
      container,
      popupSelector,
      positionStart,
      positionEnd,
      width
  ) {
    gsap.set(popupSelector + " .des-popup", {width: width});

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top " + positionStart,
        end: "top " + positionEnd,
        scrub: true,
      }
    });

    // Fade In
    tl.to(popupSelector, {
      duration: fadePopupDuration,
      y: 0,
      autoAlpha: 1,
      ease: "power3.out",
    })
        // Fade Out
        .to(popupSelector, {
          duration: fadePopupDuration,
          y: -yPopupPos,
          autoAlpha: 0,
          ease: "power3.in",
        }, 5);
  }

  // Title animation
  function fadeTitleAnimation(
      container,
      textSelector,
      positionStart,
      positionEnd
  ) {
    let scrollTrigger = {
      trigger: container,
      start: "top " + positionStart,
      end: "top " + positionEnd,
      scrub: true,
    };
    let tl1 = gsap.timeline({scrollTrigger: scrollTrigger});
    let tl2 = gsap.timeline({scrollTrigger: scrollTrigger});
    let tl3 = gsap.timeline({scrollTrigger: scrollTrigger});

    // Wrapper
    tl1.to(textSelector, {autoAlpha: 1})
        .to(textSelector, {autoAlpha: 0}, fadeTitleDuration);

    // Title
    tl2.to(textSelector + " .des-title", {x: 0})
        .to(textSelector + " .des-title", {x: xTitlePos}, fadeTitleDuration)

    // Subtitle
    tl3.to(textSelector + " .des-subtitle", {x: 0})
        .to(textSelector + " .des-subtitle", {x: -xTitlePos}, fadeTitleDuration)
  }


  // Play the animation only on the Desktop.
  function initSlider() {
    if (window.innerWidth > fullpageDesktopBreakpoint) {
      // Default Arrow 1 fill (color) on Canvas 1
      gsap.set("#desLineArrow1_C1 path", {fill: "#6b9f36"});
      // Default Arrow 1 fill (color) on Canvas 2
      gsap.set("#desLineArrow1_C2 path", {fill: "#daa231"});
      // Canvas 1 scroll height
      gsap.set("#desContainer_C1", {height: containerHeight1 + "px"});
      // Canvas 2 scroll height
      gsap.set("#desContainer_C2", {height: containerHeight2 + "px"});
      // Pics settings
      gsap.set(".des-pic", {autoAlpha: 0});
      // Arrows settings
      gsap.set(".des-line--arrow", {visibility: "visible", autoAlpha: 0});
      gsap.set(".des-line--path", {visibility: "visible", drawSVG: "0"});
      // Popups start position
      gsap.set(".des-popup-wrapper", {autoAlpha: 0, y: yPopupPos});
      // Titles settings
      gsap.set(".des-title-wrapper .des-title", {x: -xTitlePos});
      gsap.set(".des-title-wrapper .des-subtitle", {x: xTitlePos});

      // Canvas 1
      // Lines
      let arrowSettings1 = {
        state1: {
          duration: 1.8,
          ease: "none",
          fill: "#c8be4d",
        },
        state2: {
          duration: 3.2,
          ease: "none",
          fill: "#d6ba32",
        },
      }
      goArrowAnimation(
          desContainers.c1,
          desLineArrows.c1.a1.selector,
          desLineArrows.c1.a1.template,
          desLineArrows.c1.a1.path,
          positionSettings.c1.a1.start,
          positionSettings.c1.a1.end,
          positionSettings.c1.a1.start * 100 + "%",
          positionSettings.c1.a1.end * 100 + "%",
          arrowSettings1
      );
      goArrowAnimation(
          desContainers.c1,
          desLineArrows.c1.a2.selector,
          desLineArrows.c1.a2.template,
          desLineArrows.c1.a2.path,
          positionSettings.c1.a2.start,
          positionSettings.c1.a2.end,
          positionSettings.c1.a2.start * 100 + "%",
          positionSettings.c1.a2.end * 100 + "%",
          false
      );
      // Pictures
      fadePictureAnimation(
          desContainers.c1,
          desPics.c1.p1,
          positionSettings.c1.p1.start
      );
      fadePictureAnimation(
          desContainers.c1,
          desPics.c1.p2,
          positionSettings.c1.p2.start
      );
      // Popups
      fadePopupAnimation(
          desContainers.c1,
          desPopups.c1.pu1,
          positionSettings.c1.pu1.start,
          positionSettings.c1.pu1.end,
          positionSettings.c1.pu1.width
      );
      fadePopupAnimation(
          desContainers.c1,
          desPopups.c1.pu2,
          positionSettings.c1.pu2.start,
          positionSettings.c1.pu2.end,
          positionSettings.c1.pu2.width
      );
      fadePopupAnimation(
          desContainers.c1,
          desPopups.c1.pu3,
          positionSettings.c1.pu3.start,
          positionSettings.c1.pu3.end,
          positionSettings.c1.pu3.width
      );
      fadePopupAnimation(
          desContainers.c1,
          desPopups.c1.pu4,
          positionSettings.c1.pu4.start,
          positionSettings.c1.pu4.end,
          positionSettings.c1.pu4.width
      );

      // Canvas 2
      // Titles
      fadeTitleAnimation(
          desContainers.c2,
          desTitleWrappers.t1,
          positionSettings.c2.t1.start,
          positionSettings.c2.t1.end
      );
      // Lines
      let arrowSettings2 = {
        state1: {
          duration: 1.8,
          ease: "power1.in",
          fill: "#d7732e",
        },
        state2: {
          duration: 3.2,
          ease: "power1.out",
          fill: "#d12229",
        },
      }
      goArrowAnimation(
          desContainers.c2,
          desLineArrows.c2.a1.selector,
          desLineArrows.c2.a1.template,
          desLineArrows.c2.a1.path,
          positionSettings.c2.a1.start,
          positionSettings.c2.a1.end,
          positionSettings.c2.a1.start * 100 + "%",
          positionSettings.c2.a1.end * 100 + "%",
          arrowSettings2
      );
      goArrowAnimation(
          desContainers.c2,
          desLineArrows.c2.a2.selector,
          desLineArrows.c2.a2.template,
          desLineArrows.c2.a2.path,
          positionSettings.c2.a2.start,
          positionSettings.c2.a2.end,
          positionSettings.c2.a2.start * 100 + "%",
          positionSettings.c2.a2.end * 100 + "%",
          false
      );
      // Pictures
      fadePictureAnimation(
          desContainers.c2,
          desPics.c2.p1,
          positionSettings.c2.p1.start
      );
      fadePictureAnimation(
          desContainers.c2,
          desPics.c2.p2,
          positionSettings.c2.p2.start
      );
      fadePictureAnimation(
          desContainers.c2,
          desPics.c2.p3,
          positionSettings.c2.p3.start
      );
      // Popups
      fadePopupAnimation(
          desContainers.c2,
          desPopups.c2.pu1,
          positionSettings.c2.pu1.start,
          positionSettings.c2.pu1.end,
          positionSettings.c2.pu1.width
      );
      fadePopupAnimation(
          desContainers.c2,
          desPopups.c2.pu2,
          positionSettings.c2.pu2.start,
          positionSettings.c2.pu2.end,
          positionSettings.c2.pu2.width
      );
      fadePopupAnimation(
          desContainers.c2,
          desPopups.c2.pu3,
          positionSettings.c2.pu3.start,
          positionSettings.c2.pu3.end,
          positionSettings.c2.pu3.width
      );
    }
  }
  initSlider();

  window.onresize = function() {
    initSlider();
  }

  if (window.innerWidth > fullpageDesktopBreakpoint) {
    // Check if Navigator is Internet Explorer
    if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {
      // Scroll event check
      $(window).scroll(function (event) {
        let scroll = $(window).scrollTop();
        // Do for each canvas
        $('.des-container').each(function () {
          let sliderTop = $(this).offset().top;
          let sliderHeight = $(this).outerHeight();
          let canvasHeight = $('.disease-education-slider', this).outerHeight();
          let canvas = $('.disease-education-slider', this);

          // Activate sticky for IE
          if (scroll > sliderTop && scroll < sliderTop + sliderHeight - canvasHeight) {
            canvas.addClass("sticky-top-ie");
          } else {
            canvas.removeClass("sticky-top-ie");
          }
        });
      });
    }
  }

});
