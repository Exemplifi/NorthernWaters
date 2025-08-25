import $ from "jquery";

// Timeline Navigation System - IIFE Pattern
(function () {
  "use strict";

  // Function to initialize timeline navigation
  function initializeTimelineNavigation() {
    // Check if Slick is available
    if (typeof $.fn.slick === 'undefined') {
      console.error('Slick carousel library is not loaded');
      return;
    }

    // console.log('Initializing timeline navigation...');
    // console.log('Timeline nav element:', $(".timeline-nav").length);
    // console.log('Timeline slider element:', $(".timeline-slider").length);

    // Destroy existing slick instances if they exist
    if ($(".timeline-nav").hasClass("slick-initialized")) {
      // console.log('Destroying existing timeline-nav slick instance');
      $(".timeline-nav").slick("unslick");
    }
    if ($(".timeline-slider").hasClass("slick-initialized")) {
      // console.log('Destroying existing timeline-slider slick instance');
      $(".timeline-slider").slick("unslick");
    }

    // Initialize the timeline navigation carousel (small dots/indicators)
    // console.log('Initializing timeline-nav slick slider...');
    $(".timeline-nav").slick({
      // autoplay: true,           // Uncomment to enable auto-play
      // autoplaySpeed: 1000,      // Speed of auto-play in milliseconds

      slidesToShow: 5, // Number of navigation items visible at once on desktop
      slidesToScroll: 1, // Number of items to scroll when navigating
      asNavFor: ".timeline-slider", // Links this carousel to the main timeline slider
      centerMode: false, // Don't center the active navigation item
      focusOnSelect: true, // Focus on the selected navigation item
      mobileFirst: true, // Apply mobile-first responsive design
      arrows: false, // Hide navigation arrows
      infinite: false, // Don't loop infinitely (finite timeline)

      // Responsive breakpoints for different screen sizes
      responsive: [
        {
          breakpoint: 1200, // Tablet and smaller screens
          settings: {
            slidesToShow: 5, // Show 8 navigation items on tablets
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768, // Mobile phones (smallest screens)
          settings: {
            slidesToShow: 3, // Show 4 navigation items on mobile
            slidesToScroll: 1, // Scroll 2 items at a time on mobile
          },
        },
        {
          breakpoint: 0, // Mobile phones (smallest screens)
          settings: {
            slidesToShow: 2, // Show 4 navigation items on mobile
            slidesToScroll: 1, // Scroll 2 items at a time on mobile
          },
        },
      ],
    });

    // Initialize the main timeline content carousel
    // console.log('Initializing timeline-slider slick slider...');
    $(".timeline-slider").slick({
      // autoplay: true,           // Uncomment to enable auto-play
      // autoplaySpeed: 1000,      // Speed of auto-play in milliseconds

      slidesToShow: 1, // Show only one timeline item at a time
      slidesToScroll: 1, // Scroll one item at a time
      arrows: true, // Hide navigation arrows
      autoplay: false,
      infinite: false,
      asNavFor: ".timeline-nav", // Links this carousel to the navigation carousel
      centerMode: true, // Center the active timeline item
      cssEase: "ease", // CSS easing function for smooth transitions
      edgeFriction: 0.5, // Resistance when reaching the end of the timeline
      mobileFirst: true, // Apply mobile-first responsive design
      speed: 1000, // Transition speed in milliseconds
      autoplaySpeed: 1000,

      // Responsive breakpoints for different screen sizes
      responsive: [
        {
          breakpoint: 0, // Mobile phones (smallest screens)
          settings: {
            centerMode: false, // Disable center mode on mobile for better UX
          },
        },
        {
          breakpoint: 768, // Tablet and larger screens
          settings: {
            centerMode: true, // Enable center mode on tablets and desktop
          },
        },
      ],
    });

    // console.log('Timeline navigation initialization complete');

    // Navigation button functionality
    $(".timeline-prev-btn")
      .off("click")
      .on("click", function () {
        $(".timeline-slider").slick("slickPrev");
      });

    $(".timeline-next-btn")
      .off("click")
      .on("click", function () {
        $(".timeline-slider").slick("slickNext");
      });

    // Initially disable the previous button since we start at the first slide
    $(".timeline-prev-btn").addClass("slick-disabled");
    // $(".timeline-slider .slick-prev").addClass("visually-hidden-focusable");
    // $(".timeline-slider .slick-next").addClass("visually-hidden-focusable");

    // Hide slick navigation arrows immediately and ensure they stay hidden
    function hideSlickArrows() {
      $(".timeline-slider .slick-prev").css({
        display: "none",
      });
      $(".timeline-slider .slick-next").css({
        display: "none",
      });
    }

    // Hide arrows immediately
    hideSlickArrows();

    // Also hide arrows after any slick events that might show them
    $(".timeline-slider").on("init reInit afterChange", function () {
      setTimeout(hideSlickArrows, 0);
    });

    // Handle button states after slide changes
    $(".timeline-slider")
      .off("afterChange")
      .on("afterChange", function () {
        // Check if previous button should be disabled
        if ($(".timeline-slider .slick-prev").hasClass("slick-disabled")) {
          $(".timeline-prev-btn").addClass("slick-disabled");
        } else {
          $(".timeline-prev-btn").removeClass("slick-disabled");
        }

        // Check if next button should be disabled
        if ($(".timeline-slider .slick-next").hasClass("slick-disabled")) {
          $(".timeline-next-btn").addClass("slick-disabled");
        } else {
          $(".timeline-next-btn").removeClass("slick-disabled");
        }
      });

    // Make timeline navigation items accessible
    var makeTimelineNavAccessible = (function () {
      function initAccessibility() {
        $(".timeline-nav__item").each(function (index) {
          var $item = $(this);
          var year = $item.text();

          // Add accessibility attributes
          $item.attr({
            tabindex: "0",
            role: "button",
            "aria-label": "Navigate to " + year + " timeline",
            "aria-pressed": "false",
          });

          // Add keyboard event handlers
          $item.off("keydown").on("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();

              // Get the index of this item in the timeline nav
              var itemIndex = $item.index();

              // Go to the specific slide in the timeline slider
              $(".timeline-slider").slick("slickGoTo", itemIndex);

              // Also trigger click for any additional click handlers
              $item.click();
            }
          });

          // Update aria-pressed when item becomes active and navigate to slide
          $item.off("click").on("click", function () {
            // Get the index of this item in the timeline nav
            var itemIndex = $item.index();

            // Go to the specific slide in the timeline slider
            $(".timeline-slider").slick("slickGoTo", itemIndex);

            // Update aria-pressed state
            $(".timeline-nav__item").attr("aria-pressed", "false");
            $item.attr("aria-pressed", "true");
          });
        });
      }

      // Run immediately
      initAccessibility();

      // Return the function so it can be called again
      return initAccessibility;
    })();

    // Initialize accessibility after Slick is initialized
    $(".timeline-nav")
      .off("init")
      .on("init", function () {
        // console.log('Timeline nav slick initialized');
        makeTimelineNavAccessible();
      });

    // Re-initialize accessibility after responsive changes
    $(".timeline-nav")
      .off("breakpoint")
      .on("breakpoint", function () {
        setTimeout(function () {
          makeTimelineNavAccessible();
        }, 100);
      });

    // Also call it after a delay to ensure it works
    setTimeout(function () {
      makeTimelineNavAccessible();
      $(".timeline-nav__item").first().attr("aria-pressed", "true");

      // Test click functionality
      // console.log('Testing timeline-nav click functionality...');
      $(".timeline-nav__item").each(function(index) {
        var $item = $(this);
        // console.log('Timeline nav item ' + index + ':', $item.text(), 'clickable:', $item.is(':visible'));

        // Add a test click handler
        $item.on('click.test', function() {
          // console.log('Timeline nav item clicked:', $item.text(), 'index:', index);
        });
      });
    }, 1000);

    // Set initial aria-pressed state
    setTimeout(function () {
      $(".timeline-nav__item").first().attr("aria-pressed", "true");
    }, 500);
  }

  // Function to wait for Slick to be available and then initialize
  function waitForSlickAndInitialize() {
    if (typeof $.fn.slick !== 'undefined') {
      initializeTimelineNavigation();
    } else {
      // Wait a bit and try again
      setTimeout(waitForSlickAndInitialize, 100);
    }
  }

  // Wait for DOM to be fully loaded before initializing carousels
  $(function () {
    // Wait for Slick to be available before initializing
    waitForSlickAndInitialize();
  });

  // Initialize on window resize with debouncing
  var resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (typeof $.fn.slick !== 'undefined') {
        initializeTimelineNavigation();
        // Ensure arrows are hidden immediately after resize reinitialization
        setTimeout(function () {
          $(".timeline-slider .slick-prev").css({ display: "none" });
          $(".timeline-slider .slick-next").css({ display: "none" });
        }, 0);
        // Remove mobile height constraints after timeline navigation reinitialization
        setTimeout(function () {
          removeMobileHeightConstraints();
          fixMobileTimelineGap();
        }, 100);
      }
    }, 250); // Debounce resize events to avoid excessive reinitialization
  });
})();

// Dynamic Height Calculation - IIFE Pattern
(function () {
  "use strict";

  // Function to check if screen size is 768px or larger
  function isScreenSize768Plus() {
    return window.innerWidth >= 768;
  }

  // Function to calculate and set dynamic height for timeline-wrapper
  function setDynamicTimelineHeight() {
    // Only run for screen sizes 768px and larger
    if (!isScreenSize768Plus()) {
      return;
    }

    // Find all timeline-wrapper elements
    // $(".timeline-wrapper").each(function () {
    //   var $wrapper = $(this);
    //   var maxHeight = 0;

    //   // Find all timeline-slide__content elements within this wrapper
    //   var $contentElements = $wrapper.find(".timeline-slide__content");

    //   // Calculate the maximum height among all content elements
    //   $contentElements.each(function () {
    //     var contentHeight = $(this).outerHeight(true); // Include padding and border
    //     if (contentHeight > maxHeight) {
    //       maxHeight = contentHeight;
    //     }
    //   });

    //   // Add some padding to ensure content doesn't touch the edges
    //   var finalHeight = maxHeight;

    //   // Set the wrapper height to the maximum content height
    //   if (maxHeight > 0) {
    //     $wrapper.css("height", finalHeight + "px");
    //   }
    // });
  }

  // Function to set height of timeline-slide elements based on their content
  function setTimelineSlideHeight() {
    // Only run for screen sizes 768px and larger
    if (!isScreenSize768Plus()) {
      return;
    }

    // Find all timeline-slide elements
    $(".timeline-slide").each(function () {
      var $slide = $(this);
      var $content = $slide.find(".timeline-slide__content");

      if ($content.length > 0) {
        var contentHeight = $content.outerHeight(true); // Include padding and border

        if (contentHeight > 0) {
          $slide.css("height", contentHeight + "px");
        }
      }
    });
  }

  // Function to set height of slick-slide elements inside timerline-slide__carousel
  function setSlickSlideHeight() {
    // Only run for screen sizes 768px and larger
    if (!isScreenSize768Plus()) {
      return;
    }

    // Find all timerline-slide__carousel elements
    $(".timerline-slide__carousel").each(function () {
      var $carousel = $(this);
      var $nearestContent = $carousel.closest(".timeline-slide__content");

      if ($nearestContent.length > 0) {
        var contentHeight = $nearestContent.outerHeight(true); // Include padding and border

        if (contentHeight > 0) {
          // Set height for all slick-slide elements inside this carousel
          $carousel.find(".slick-slide").css("height", contentHeight + "px");
        }
      }
    });
  }

  // Wait for DOM to be fully loaded
  $(function () {
    // Initial calculation after a short delay to ensure all content is rendered
    setTimeout(function () {
      setDynamicTimelineHeight();
      setTimelineSlideHeight();
      setSlickSlideHeight();
    }, 100);

    // Also calculate after Slick carousel is initialized
    $(".timeline-slider").on("init", function () {
      setTimeout(function () {
        setDynamicTimelineHeight();
        setTimelineSlideHeight();
        setSlickSlideHeight();
        removeMobileHeightConstraints();
      }, 200);
    });

    // Recalculate after slide changes
    $(".timeline-slider").on("afterChange", function () {
      setTimeout(function () {
        setDynamicTimelineHeight();
        setTimelineSlideHeight();
        setSlickSlideHeight();
        removeMobileHeightConstraints();
      }, 100);
    });
  });

  // Recalculate on window resize with debouncing
  var heightResizeTimer;
  $(document).ready(function () {
    $(window).on("resize", function () {
      clearTimeout(heightResizeTimer);
      heightResizeTimer = setTimeout(function () {
        setDynamicTimelineHeight();
        setTimelineSlideHeight();
        setSlickSlideHeight();
      }, 250); // Debounce resize events
    });
  });
})();

// Center Slider - IIFE Pattern
(function () {
  "use strict";

  // Function to initialize center sliders independently
  function initializeCenterSliders() {
    // Destroy existing slick instances if they exist
    $(".center-slider").each(function () {
      if ($(this).hasClass("slick-initialized")) {
        $(this).slick("unslick");
      }
    });

    // Initialize each center-slider independently
    $(".center-slider").each(function (index) {
      var $slider = $(this);
      var sliderId = "center-slider-" + index;

      // Add unique identifier to the slider
      $slider.attr("data-slider-id", sliderId);

      // Initialize each slider independently
      $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
        arrows: true,
        dots: false,
        speed: 1000,
        mobileFirst: true,
        infinite: true,
        autoplaySpeed: 5000,
        autoplay: false,
        // Add unique settings to prevent state sharing
        asNavFor: null, // Ensure no navigation linking between sliders
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              centerMode: false,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              centerMode: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: false,
            },
          },
          {
            breakpoint: 0,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: false,
            },
          },
        ],
      });

      $slider.off('afterChange.centerFix').on('afterChange.centerFix', function () {
        addClassesToCenterSlider();
      });
      // ✅ Hook afterChange for every center-slider
      $slider.off('afterChange.centerUpdate').on('afterChange.centerUpdate', function () {
        addClassesToCenterSlider();
      });

      // Remove mobile height constraints after center slider initialization
      $slider.on('init', function() {
        setTimeout(function() {
          removeMobileHeightConstraints();
        }, 100);
      });
      // Add debugging to verify independent sliders
      // console.log("Initialized independent slider:", sliderId);
    });
  }

  // Function to initialize custom navigation for center sliders
  function initializeCenterSliderNavigation() {
    // console.log("Initializing center slider navigation...");

    // Find all center-slider instances
    $(".center-slider").each(function (index) {
      var $slider = $(this);
      var sliderId = $slider.attr("data-slider-id");

      // Find the nearest timerline-slide__menu-list within the same timeline-slide__content
      var $menuList = $slider
        .closest(".timeline-slide__content")
        .find(".timerline-slide__menu-list");

      if ($menuList.length > 0) {
        // console.log("Found menu list for slider:", sliderId);

        // Get all anchor tags in the menu list
        var $menuLinks = $menuList.find("a");

        // Remove any existing click handlers
        $menuLinks.off("click");

        // Add click handlers to each anchor tag
        $menuLinks.each(function (linkIndex) {
          var $link = $(this);

          // Add click handler
          $link.on("click", function (e) {
            e.preventDefault();
            // console.log(
            //   "Menu link clicked for slider:",
            //   sliderId,
            //   "going to slide:",
            //   linkIndex
            // );

            // Go to the specific slide in the corresponding center-slider
            $slider.slick("slickGoTo", linkIndex);

            // Update active state for all links in this menu
            $menuLinks.removeClass("active");
            $link.addClass("active");
          });

          // Add keyboard navigation
          $link.attr({
            tabindex: "0",
            role: "button",
            "aria-label": "Navigate to slide " + (linkIndex + 1),
          });

          $link.on("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              $link.click();
            }
          });
        });

        // Handle slick events to update active state
        $slider
          .off("afterChange")
          .on("afterChange", function (event, slick, currentSlide) {
            // Update active state based on current slide
            $menuLinks.removeClass("active");
            $menuLinks.eq(currentSlide).addClass("active");
          });

        // Set initial active state
        $menuLinks.first().addClass("active");
      }
    });
  }

  // Initialize when DOM is ready
  $(document).ready(function () {
    initializeCenterSliders();

    // Initialize navigation after sliders are set up
    setTimeout(function () {
      initializeCenterSliderNavigation();
      // Trigger custom event for center slider state management
      $(document).trigger('centerSlidersInitialized');
    }, 500);
  });

  // Re-initialize on window resize
  var centerSliderResizeTimer;
  $(window).on("resize", function () {
    clearTimeout(centerSliderResizeTimer);
    centerSliderResizeTimer = setTimeout(function () {
      initializeCenterSliders();
      // Re-initialize navigation after resize
      setTimeout(function () {
        initializeCenterSliderNavigation();
        // Trigger custom event for center slider state management
        $(document).trigger('centerSlidersInitialized');
        // Remove mobile height constraints after center slider reinitialization
        removeMobileHeightConstraints();
      }, 100);
    }, 250);
  });

  // Re-initialize when timeline slides change
  $(".timeline-slider").on("afterChange", function () {
    setTimeout(function () {
      initializeCenterSliders();
      // Re-initialize navigation after timeline change
      setTimeout(function () {
        initializeCenterSliderNavigation();
        // Trigger custom event for center slider state management
        $(document).trigger('centerSlidersInitialized');
        // Remove mobile height constraints after timeline slide change
        removeMobileHeightConstraints();
      }, 100);
    }, 100);
  });

  // Expose functions globally for testing
  window.initializeCenterSliderNavigation = initializeCenterSliderNavigation;
})();

// Custom Tab Navigation - IIFE Pattern
(function () {
  "use strict";

  document.addEventListener("focusin", () => {
    // console.log("Currently focused element:", document.activeElement);
  });

  function initializeCustomTabNavigation() {
    // console.log("Initializing custom tab navigation...");

    // Function to make all elements in hidden slides non-focusable
    function makeHiddenSlidesNonFocusable() {
      // Find all slick-slide elements with tabindex="-1" (hidden slides)
      $('.slick-slide[tabindex="-1"]').each(function() {
        var $hiddenSlide = $(this);

        // Make all focusable elements inside hidden slides non-focusable
        $hiddenSlide.find('a, button, input, select, textarea, [tabindex]').each(function() {
          $(this).attr('tabindex', '-1');
        });
      });

      // Ensure visible slides have proper tabindex
      $('.timeline-slide.slick-current.slick-center.slick-active:not(.slick-cloned)').each(function() {
        var $visibleSlide = $(this);
        if ($visibleSlide.attr('tabindex') !== '-1') {
          $visibleSlide.find('.timerline-slide__menu-list a').attr('tabindex', '0');
        }
      });
    }

    function getCurrentTimelineSlide() {
      // Visible center slide only, no slick clones, and not tabindex="-1"
      return $(
        '.timeline-slide.slick-current.slick-center.slick-active:not(.slick-cloned)'
      ).filter(function () {
        return $(this).attr("tabindex") !== "-1";
      });
    }

    function getFirstMenuListItem() {
      var $currentSlide = getCurrentTimelineSlide();
      if ($currentSlide.length > 0) {
        return $currentSlide.find(
          ".timerline-slide__menu-list li:first-child a"
        );
      }
      return $();
    }

    function getLastMenuListItem() {
      // Find the currently visible center slide (not hidden, not cloned, and not tabindex="-1")
      var $currentSlide = $(
        '.timeline-slide.slick-current.slick-center.slick-active:not(.slick-cloned)'
      ).filter(function () {
        return $(this).attr("tabindex") !== "-1";
      });

      if ($currentSlide.length > 0) {
        return $currentSlide.find(
          ".timerline-slide__menu-list li:last-child a"
        );
      }
      return $();
    }

    function getTimelineNavItems() {
      return $(".timeline-nav .timeline-nav__item");
    }

    function logFocusedElement($element) {
      if ($element.length > 0) {
        var elementType = $element.is(".timerline-slide__menu-list a")
          ? "Menu List Item"
          : "Timeline Nav Item";
        var elementText = $element.text().trim();
        // console.log(`Tab Focus: ${elementType} - "${elementText}"`);
      }
    }

    // Forward tab: last menu item → first timeline nav item
    $(document).on("keydown", ".timerline-slide__menu-list a", function (e) {
      if (e.key === "Tab" && !e.shiftKey) {
        var $currentItem = $(this);
        var $allMenuItems = $currentItem
          .closest(".timerline-slide__menu-list")
          .find("a");
        var currentIndex = $allMenuItems.index($currentItem);

        if (currentIndex === $allMenuItems.length - 1) {
          e.preventDefault();
          e.stopPropagation();

          var $firstTimelineNavItem = getTimelineNavItems().first();
          if ($firstTimelineNavItem.length > 0) {
            $firstTimelineNavItem.focus();
            logFocusedElement($firstTimelineNavItem);
          }
        }
      }
    });

    // Backward tab: first timeline nav item → last menu item in visible center slide (no tabindex=-1)
    $(document).on("keydown", ".timeline-nav__item", function (e) {
      if (e.key === "Tab" && e.shiftKey) {
        var $currentItem = $(this);
        var $allTimelineNavItems = getTimelineNavItems();
        var currentIndex = $allTimelineNavItems.index($currentItem);

        if (currentIndex === 0) {
          // First, ensure hidden slides are non-focusable
          makeHiddenSlidesNonFocusable();

          var $lastMenuListItem = getLastMenuListItem();

          // Debug: Log the found menu item
          if ($lastMenuListItem.length > 0) {
            // console.log('Found last menu item:', $lastMenuListItem.text().trim(), 'in slide:', $lastMenuListItem.closest('.timeline-slide').attr('class'));
          } else {
            // console.log('No last menu item found in current visible slide');
          }

          if ($lastMenuListItem.length > 0) {
            var prevElement = document.activeElement;
            if (prevElement !== $lastMenuListItem[0]) {
              e.preventDefault();
              e.stopPropagation();
              $lastMenuListItem.focus();
              logFocusedElement($lastMenuListItem);
            }
          }
        }
      }
    });

    $(document).on(
      "focus",
      ".timerline-slide__menu-list a, .timeline-nav__item",
      function () {
        logFocusedElement($(this));
      }
    );

    $(".timeline-slider").on("afterChange", function () {
      setTimeout(function () {
        // Make hidden slides non-focusable
        makeHiddenSlidesNonFocusable();

        var $currentSlide = getCurrentTimelineSlide();
        if ($currentSlide.length > 0) {
          $currentSlide.find(".timerline-slide__menu-list a").attr({
            tabindex: "0",
            role: "button",
          });
          getTimelineNavItems().attr({
            tabindex: "0",
            role: "button",
          });
        }
      }, 100);
    });

    setTimeout(function () {
      // Make hidden slides non-focusable
      makeHiddenSlidesNonFocusable();

      $(".timerline-slide__menu-list a").attr({
        tabindex: "0",
        role: "button",
      });
      getTimelineNavItems().attr({
        tabindex: "0",
        role: "button",
      });
      // Remove mobile height constraints after custom tab navigation initialization
      removeMobileHeightConstraints();
      // console.log("Custom tab navigation initialized");
    }, 1000);
  }

  $(function () {
    setTimeout(function () {
      initializeCustomTabNavigation();
    }, 1500);

    // Global handler to prevent focus on hidden slide elements
    $(document).on('keydown', function(e) {
      if (e.key === 'Tab') {
        // Check if the next element would be in a hidden slide
        setTimeout(function() {
          var $focusedElement = $(document.activeElement);
          if ($focusedElement.closest('.slick-slide[tabindex="-1"]').length > 0) {
            // If focus landed on a hidden slide, redirect to visible slide
            var $lastMenuListItem = getLastMenuListItem();
            if ($lastMenuListItem.length > 0) {
              $lastMenuListItem.focus();
            }
          }
        }, 0);
      }
    });
  });

  var customTabResizeTimer;
  $(window).on("resize", function () {
    clearTimeout(customTabResizeTimer);
    customTabResizeTimer = setTimeout(function () {
      initializeCustomTabNavigation();
      // Remove mobile height constraints after custom tab navigation reinitialization
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    }, 300);
  });

  $(".timeline-slider").on("afterChange", function () {
    setTimeout(function () {
      initializeCustomTabNavigation();
      // Remove mobile height constraints after custom tab navigation reinitialization
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    }, 200);
  });

  window.initializeCustomTabNavigation = initializeCustomTabNavigation;
})();

// Center Slider Class Management - IIFE Pattern
(function () {
  "use strict";

  // Function to add classes to center slider slides
  function addClassesToCenterSlider() {

    // console.log('Adding classes to center slider slides...');

    // Target the slide item with slick-slide slick-current slick-center classes
    var $currentSlide = $('.slick-slide.slick-current.slick-center');

    if ($currentSlide.length === 0) {
      // console.log('No current slide found with slick-slide slick-current slick-center classes');
      return;
    }

    // console.log('Found current slide:', $currentSlide.attr('class'));

    // Go inside and find element with center-slider slick-initialized slick-slider classes
    var $centerSlider = $currentSlide.find('.center-slider.slick-initialized.slick-slider');

    if ($centerSlider.length === 0) {
      // console.log('No center slider found with center-slider slick-initialized slick-slider classes');
      return;
    }

    // console.log('Found center slider, managing slide classes...');

    // First, remove all slick-current and slick-active classes from all slides
    $centerSlider.find('.slick-slide:not(.slick-cloned)').removeClass('slick-current slick-active');

    // Get the current slide index from the center slider
    var currentSlideIndex = $centerSlider.slick('slickCurrentSlide');
    // console.log('Current slide index in center slider:', currentSlideIndex);

    // Add slick-current and slick-active to the actual current slide
    var $currentCenterSlide = $centerSlider.find('.slick-slide:not(.slick-cloned)').eq(currentSlideIndex);
    if ($currentCenterSlide.length > 0) {
      $currentCenterSlide.addClass('slick-current slick-active');
      // console.log('Added slick-current and slick-active to slide at index:', currentSlideIndex);
    }

    // Add slick-active to the next two slides (if they exist)
    var $nextSlide = $centerSlider.find('.slick-slide:not(.slick-cloned)').eq(currentSlideIndex + 1);
    if ($nextSlide.length > 0) {
      $nextSlide.addClass('slick-active');
      // console.log('Added slick-active to next slide at index:', currentSlideIndex + 1);
    }

    var $nextNextSlide = $centerSlider.find('.slick-slide:not(.slick-cloned)').eq(currentSlideIndex + 2);
    if ($nextNextSlide.length > 0) {
      $nextNextSlide.addClass('slick-active');
      // console.log('Added slick-active to slide at index:', currentSlideIndex + 2);
    }

    // console.log('Center slider class management complete');



  }

  // Function to initialize center slider class management
  function initializeCenterSliderClassManagement() {
    // console.log('Initializing center slider class management...');

    // Handle timeline navigation button clicks
    $('.timeline-prev-btn, .timeline-next-btn').off('click.centerSliderClasses').on('click.centerSliderClasses', function() {
      // console.log('Timeline navigation button clicked, managing center slider classes...');

      // Wait for the timeline slider to finish changing
      setTimeout(function() {
        addClassesToCenterSlider();
        // Remove mobile height constraints after timeline navigation button click
        removeMobileHeightConstraints();
      }, 100);
    });

    // Handle timeline nav item clicks
    $('.timeline-nav__item').off('click.centerSliderClasses').on('click.centerSliderClasses', function() {
      // console.log('Timeline nav item clicked, managing center slider classes...');

      // Wait for the timeline slider to finish changing
      setTimeout(function() {
        addClassesToCenterSlider();
        // Remove mobile height constraints after timeline nav item click
        removeMobileHeightConstraints();
      }, 100);
    });

    // Handle timeline slider afterChange event
    $('.timeline-slider').off('afterChange.centerSliderClasses').on('afterChange.centerSliderClasses', function() {
      // console.log('Timeline slider changed, managing center slider classes...');

      setTimeout(function() {
        addClassesToCenterSlider();
        // Remove mobile height constraints after timeline slider change
        removeMobileHeightConstraints();
      }, 100);
    });

    // Initial class management
    setTimeout(function() {
      addClassesToCenterSlider();
      // Remove mobile height constraints after center slider class management initialization
      removeMobileHeightConstraints();
    }, 1000);
  }

  // Initialize when DOM is ready
  $(function() {
    // Wait for timeline navigation to be initialized
    setTimeout(function() {
      initializeCenterSliderClassManagement();
    }, 1500);
  });

  // Re-initialize on window resize
  var centerSliderClassResizeTimer;
  $(window).on('resize', function() {
    clearTimeout(centerSliderClassResizeTimer);
    centerSliderClassResizeTimer = setTimeout(function() {
      initializeCenterSliderClassManagement();
      // Remove mobile height constraints after center slider class management reinitialization
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    }, 300);
  });

  // Also trigger when center sliders are reinitialized
  $(document).on('centerSlidersInitialized', function() {
    setTimeout(function() {
      addClassesToCenterSlider();
      removeMobileHeightConstraints();
    }, 100);
  });

  // Expose functions globally for testing
  window.addClassesToCenterSlider = addClassesToCenterSlider;
  window.initializeCenterSliderClassManagement = initializeCenterSliderClassManagement;
})();

// Disable all slick-slide divs inside .timeline-nav
(function () {
  "use strict";

  function disableTimelineNavSlides() {
    $(".timeline-nav .slick-slide").each(function () {
      // Make visually unchanged but non-interactive
      $(this)
        .attr("aria-disabled", "true")
        .css({
          "pointer-events": "none",
          "user-select": "none"
        });
    });
  }

  // Run after DOM ready
  $(function () {
    disableTimelineNavSlides();

    // Also re-apply after Slick events that might re-render slides
    $(".timeline-nav").on("init reInit afterChange setPosition", function () {
      disableTimelineNavSlides();
      // Remove mobile height constraints after timeline nav slide disable
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    });
  });
})();

// Global utility functions
(function () {
  "use strict";

  // Function to check if screen size is less than 768px
  function isScreenSizeLessThan768() {
    return window.innerWidth < 768;
  }

  // Function to remove height constraints and ensure natural heights for mobile
  window.removeMobileHeightConstraints = function() {
    // Only run for screen sizes less than 768px
    if (!isScreenSizeLessThan768()) {
      return;
    }

    // Fix positioning and height for timeline-slide__content
    $(".timeline-slide__content").each(function () {
      var $content = $(this);
      $content.css({
        "position": "relative",
        "height": "auto",
        "min-height": "auto",
        "max-height": "none",
        "top": "auto",
        "left": "auto",
        "right": "auto",
        "opacity": "1",
        "display": "flex",
        "flex-direction": "column"
      });
    });

    // Fix timeline-slide positioning and height
    $(".timeline-slide").each(function () {
      var $slide = $(this);
      $slide.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none",
        "position": "relative"
      });
    });

    // Fix timeline-slider height and positioning
    $(".timeline-slider").each(function () {
      var $slider = $(this);
      $slider.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix timeline-wrapper height
    $(".timeline-wrapper").each(function () {
      var $wrapper = $(this);
      $wrapper.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix slick-list and slick-track
    $(".slick-list, .slick-track").each(function () {
      var $element = $(this);
      $element.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix all slick-slide elements
    $(".slick-slide").each(function () {
      var $slide = $(this);
      $slide.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix center-slider elements
    $(".center-slider .slick-slide").each(function () {
      var $slide = $(this);
      $slide.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix timerline-slide__carousel elements
    $(".timerline-slide__carousel .slick-slide").each(function () {
      var $slide = $(this);
      $slide.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix carousel items
    $(".timerline-slide__carousel-item").each(function () {
      var $item = $(this);
      $item.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Fix timerline-slide__menu height on mobile
    $(".timerline-slide__menu").each(function () {
      var $menu = $(this);
      $menu.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "374px",
        "overflow-y": "auto"
      });
    });

    // Ensure proper spacing between elements
    $(".timeline-slider").css("margin-bottom", "24px");
    $(".timeline-nav").css("margin-bottom", "24px");

    // Force a reflow to ensure changes take effect
    $(".timeline-wrapper")[0] && $(".timeline-wrapper")[0].offsetHeight;
  };

  // Function to initialize mobile layout immediately
  window.initializeMobileLayout = function() {
    if (isScreenSizeLessThan768()) {
      // Apply mobile layout immediately
      removeMobileHeightConstraints();
      fixMobileTimelineGap();

      // Also ensure timeline content is visible
      $(".timeline-slide__content").css("opacity", "1");

      // Force layout recalculation
      setTimeout(function() {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
      }, 10);
    }
  };

  // Function to specifically fix the gap issue on mobile
  window.fixMobileTimelineGap = function() {
    if (!isScreenSizeLessThan768()) {
      return;
    }

    // Add CSS override to eliminate gaps
    if (!$("#mobile-timeline-gap-fix").length) {
      $("head").append(`
        <style id="mobile-timeline-gap-fix">
          @media (max-width: 767px) {
            .timeline-slide__content {
              position: relative !important;
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              top: 0 !important;
              left: 0 !important;
              right: auto !important;
              opacity: 1 !important;
              display: flex !important;
              flex-direction: column !important;
              margin-bottom: 0 !important;
            }

            .timeline-slide {
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              position: relative !important;
              margin-bottom: 0 !important;
            }

            .timeline-slider {
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              margin-bottom: 24px !important;
            }

            .slick-list, .slick-track {
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
            }

            .timeline-slide:after {
              display: none !important;
            }

            .timeline-wrapper {
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
            }
          }
        </style>
      `);
    }

    // Ensure timeline content flows naturally without gaps
    $(".timeline-slide__content").each(function() {
      var $content = $(this);
      $content.css({
        "position": "relative",
        "height": "auto",
        "min-height": "auto",
        "max-height": "none",
        "top": "0",
        "left": "0",
        "right": "auto",
        "opacity": "1",
        "display": "flex",
        "flex-direction": "column",
        "margin-bottom": "0"
      });
    });

    // Ensure timeline slide has no extra height
    $(".timeline-slide").each(function() {
      var $slide = $(this);
      $slide.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none",
        "position": "relative",
        "margin-bottom": "0"
      });
    });

    // Ensure timeline slider has no extra height
    $(".timeline-slider").each(function() {
      var $slider = $(this);
      $slider.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none",
        "margin-bottom": "24px"
      });
    });

    // Ensure slick elements don't create gaps
    $(".slick-list, .slick-track").each(function() {
      var $element = $(this);
      $element.css({
        "height": "auto",
        "min-height": "auto",
        "max-height": "none"
      });
    });

    // Remove any after pseudo-elements that might create gaps
    $(".timeline-slide").each(function() {
      var $slide = $(this);
      $slide.find("&:after").css("display", "none");
    });
  };

  // Call mobile layout initialization immediately
  $(document).ready(function() {
    initializeMobileLayout();
  });

  // Also call on window load to ensure all content is loaded
  $(window).on('load', function() {
    initializeMobileLayout();
  });
})();

// Center Slider Slick Slide Height Management for Mobile - IIFE Pattern
(function () {
  "use strict";

  // Function to check if screen size is less than 768px
  function isScreenSizeLessThan768() {
    return window.innerWidth < 768;
  }

  // Function to calculate and set dynamic height for timeline-slider elements (only for desktop)
  function setTimelineSliderHeight() {
    // Only run for screen sizes 768px and larger
    if (isScreenSizeLessThan768()) {
      return;
    }

    // Find all timeline-slider elements
    $(".timeline-slider").each(function () {
      var $timelineSlider = $(this);
      var maxHeight = 0;

      // Find all timeline-slide__content elements within this timeline-slider
      var $timelineSlideContents = $timelineSlider.find(".timeline-slide__content");

      // Calculate the maximum height among all timeline-slide__content elements
      $timelineSlideContents.each(function () {
        var contentHeight = $(this).outerHeight(true); // Include padding and border
        if (contentHeight > maxHeight) {
          maxHeight = contentHeight;
        }
      });

      // Set the height for the timeline-slider element
      if (maxHeight > 0) {
        $timelineSlider.css("height", maxHeight + "px");
      }
    });
  }

  // Function to calculate and set dynamic height for timeline-wrapper divs (only for desktop)
  function setTimelineWrapperHeight() {
    // Only run for screen sizes 768px and larger
    if (isScreenSizeLessThan768()) {
      return;
    }

    // Find all timeline-wrapper elements
    $(".timeline-wrapper").each(function () {
      var $timelineWrapper = $(this);
      var totalHeight = 0;

      // Get the direct children: timeline-slider, timeline-nav, timeline-buttons-wrap
      var $timelineSlider = $timelineWrapper.find("> .timeline-slider");
      var $timelineNav = $timelineWrapper.find("> .timeline-nav");
      var $timelineButtonsWrap = $timelineWrapper.find("> .timeline-buttons-wrap");

      // Calculate combined height of all direct children
      if ($timelineSlider.length) {
        totalHeight += $timelineSlider.outerHeight(true); // Include padding and border
      }
      if ($timelineNav.length) {
        totalHeight += $timelineNav.outerHeight(true); // Include padding and border
      }
      if ($timelineButtonsWrap.length) {
        totalHeight += $timelineButtonsWrap.outerHeight(true); // Include padding and border
      }

      // Set the height for the timeline-wrapper
      if (totalHeight > 0) {
        $timelineWrapper.css("height", totalHeight + "px");
      }
    });
  }

  // Wait for DOM to be fully loaded
  $(function () {
    // Initial calculation after a short delay to ensure all content is rendered
    setTimeout(function () {
      removeMobileHeightConstraints();
      fixMobileTimelineGap();
      setTimelineSliderHeight();
      setTimelineWrapperHeight();
    }, 100);

    // Also remove mobile height constraints immediately on load
    removeMobileHeightConstraints();
    fixMobileTimelineGap();

    // Also calculate after Slick carousel is initialized
    $(".center-slider").on("init", function () {
      setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
        setTimelineSliderHeight();
        setTimelineWrapperHeight();
      }, 200);
    });

    // Recalculate after slide changes
    $(".center-slider").on("afterChange", function () {
      setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
        setTimelineSliderHeight();
        setTimelineWrapperHeight();
      }, 100);
    });

    // Also remove mobile height constraints after center slider slide changes
    $(".center-slider").on("afterChange", function () {
      setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
      }, 50);
    });

    // Also handle timeline-slider events
    $(".timeline-slider").on("init afterChange", function () {
      setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
        setTimelineSliderHeight();
        setTimelineWrapperHeight();
      }, 100);
    });

    // Also remove mobile height constraints after timeline slider slide changes
    $(".timeline-slider").on("afterChange", function () {
      setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
      }, 50);
    });
  });

  // Recalculate on window resize with debouncing
  var mobileHeightResizeTimer;
  var timelineSliderHeightResizeTimer;
  var timelineWrapperHeightResizeTimer;
  $(document).ready(function () {
    $(window).on("resize", function () {
      clearTimeout(mobileHeightResizeTimer);
      clearTimeout(timelineSliderHeightResizeTimer);
      clearTimeout(timelineWrapperHeightResizeTimer);

      mobileHeightResizeTimer = setTimeout(function () {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
      }, 250); // Debounce resize events

      // Also remove mobile height constraints immediately on resize for mobile devices
      if (isScreenSizeLessThan768()) {
        removeMobileHeightConstraints();
        fixMobileTimelineGap();
      }

      timelineSliderHeightResizeTimer = setTimeout(function () {
        setTimelineSliderHeight();
      }, 250); // Debounce resize events

      timelineWrapperHeightResizeTimer = setTimeout(function () {
        setTimelineWrapperHeight();
      }, 250); // Debounce resize events
    });
  });
})();

// Dynamic Timeline Line - IIFE Pattern
(function () {
  "use strict";

  // Function to create dynamic timeline line element
  function createDynamicTimelineLine() {
    var $timelineNav = $(".timeline-nav");

    // Remove existing dynamic line if it exists
    $timelineNav.find(".timeline-dynamic-line").remove();

    // Create new dynamic line element
    var $dynamicLine = $('<div class="timeline-dynamic-line"></div>');
    $timelineNav.append($dynamicLine);

    return $dynamicLine;
  }

  // Function to calculate and set dynamic line position and width
  function updateDynamicTimelineLine() {
    var $timelineNav = $(".timeline-nav");

    if ($timelineNav.length === 0) {
      return;
    }

    // Get or create dynamic line element
    var $dynamicLine = $timelineNav.find(".timeline-dynamic-line");
    if ($dynamicLine.length === 0) {
      $dynamicLine = createDynamicTimelineLine();
    }

    // Get all visible timeline nav items (not cloned)
    var $navItems = $timelineNav.find(".timeline-nav__item:not(.slick-cloned)");

    if ($navItems.length < 2) {
      // Hide dynamic line if there are less than 2 items
      $dynamicLine.hide();
      $timelineNav.removeClass("timeline-dynamic-line-active");
      return;
    }

    // Get first and last nav items
    var $firstItem = $navItems.first();
    var $lastItem = $navItems.last();

    // Get positions relative to timeline-nav
    var timelineNavOffset = $timelineNav.offset();
    var firstItemOffset = $firstItem.offset();
    var lastItemOffset = $lastItem.offset();

    if (!timelineNavOffset || !firstItemOffset || !lastItemOffset) {
      return;
    }

    // Calculate positions relative to timeline-nav
    var firstItemLeft = firstItemOffset.left - timelineNavOffset.left;
    var lastItemLeft = lastItemOffset.left - timelineNavOffset.left;

    // Get the center position of the first and last items
    var firstItemCenter = firstItemLeft + ($firstItem.outerWidth() / 2);
    var lastItemCenter = lastItemLeft + ($lastItem.outerWidth() / 2);

    // Calculate line properties
    var lineLeft = firstItemCenter;
    var lineWidth = lastItemCenter - firstItemCenter;

    // Ensure minimum width
    if (lineWidth < 10) {
      lineWidth = 10;
    }

    // Set line position and width
    $dynamicLine.css({
      left: lineLeft + "px",
      width: lineWidth + "px",
      display: "block"
    });

    // Add active class to timeline-nav to hide static line
    $timelineNav.addClass("timeline-dynamic-line-active");
  }

  // Function to initialize dynamic timeline line
  function initializeDynamicTimelineLine() {
    // Create initial dynamic line
    createDynamicTimelineLine();

    // Initial update
    setTimeout(function() {
      updateDynamicTimelineLine();
    }, 10);

    // Fallback: ensure static line is visible if dynamic line fails
    setTimeout(function() {
      var $dynamicLine = $(".timeline-dynamic-line");
      if ($dynamicLine.length === 0 || $dynamicLine.css("display") === "none") {
        $(".timeline-nav").removeClass("timeline-dynamic-line-active");
      }
    }, 100);

    // Update after timeline navigation is initialized
    $(".timeline-nav").on("init", function() {
      setTimeout(function() {
        updateDynamicTimelineLine();
        // Remove mobile height constraints after timeline navigation initialization
        setTimeout(function() {
          removeMobileHeightConstraints();
        }, 100);
      }, 50);
    });

    // Update after slide changes
    $(".timeline-nav").on("afterChange", function() {
      setTimeout(function() {
        updateDynamicTimelineLine();
        // Remove mobile height constraints after timeline nav slide change
        setTimeout(function() {
          removeMobileHeightConstraints();
        }, 100);
      }, 0);
    });

    // Update after responsive breakpoint changes
    $(".timeline-nav").on("breakpoint", function() {
      setTimeout(function() {
        updateDynamicTimelineLine();
        // Remove mobile height constraints after responsive breakpoint change
        setTimeout(function() {
          removeMobileHeightConstraints();
        }, 100);
      }, 100);
    });

    // Update after reinitialization
    $(".timeline-nav").on("reInit", function() {
      setTimeout(function() {
        updateDynamicTimelineLine();
        // Remove mobile height constraints after timeline nav reinitialization
        setTimeout(function() {
          removeMobileHeightConstraints();
        }, 100);
      }, 200);
    });
  }

  // Initialize when DOM is ready
  $(function() {
    // Wait for timeline navigation to be initialized
    setTimeout(function() {
      initializeDynamicTimelineLine();
      // Remove mobile height constraints after dynamic timeline line initialization
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    }, 1500);
  });

  // Re-initialize on window resize with debouncing
  var dynamicLineResizeTimer;
  $(window).on("resize", function() {
    clearTimeout(dynamicLineResizeTimer);
    dynamicLineResizeTimer = setTimeout(function() {
      updateDynamicTimelineLine();
      // Remove mobile height constraints after dynamic timeline line resize update
      setTimeout(function() {
        removeMobileHeightConstraints();
      }, 100);
    }, 250);
  });

  // Re-initialize when timeline slides change
  $(".timeline-slider").on("afterChange", function() {
    setTimeout(function() {
      updateDynamicTimelineLine();
      // Remove mobile height constraints after dynamic timeline line update
      removeMobileHeightConstraints();
    }, 100);
  });

  // Expose functions globally for testing
  window.updateDynamicTimelineLine = updateDynamicTimelineLine;
  window.initializeDynamicTimelineLine = initializeDynamicTimelineLine;
})();

