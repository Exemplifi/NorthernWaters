import $ from "jquery";

$(document).ready(function() {
  // Enhance Bootstrap carousel arrows and add custom logic if needed
  // Example: Log when a carousel slide changes
  var carousels = document.querySelectorAll(".carousel");
  carousels.forEach(function (carousel) {
    carousel.addEventListener("slide.bs.carousel", function (event) {
      // You can add custom logic here
      // console.log('Carousel slide event:', event);
    });
  });

  // Example: Custom arrow logic (if you want to do something extra)
  // const nextButtons = document.querySelectorAll('.carousel-control-next');
  // nextButtons.forEach(btn => {
  //   btn.addEventListener('click', function() {
  //     // Custom logic for next arrow
  //   });
  // });

  // Enhance Slick Slider for all carousel variants

  // Variant 1: 4 cards on desktop, 2 on tablet, 1 on mobile
  if (window.$ && $(".slick-carousel-v1").length) {
    $(".slick-carousel-v1").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
      ],
    });
  }

  // Variant 2: 3 cards on desktop, 2 on tablet, 1 on mobile
  if (window.$ && $(".slick-carousel-v2").length) {
    $(".slick-carousel-v2").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
      ],
    });
  }

  // Variant 3: 3 cards on desktop, 2 on tablet, 1 on mobile
  if (window.$ && $(".slick-carousel-v3").length) {
    $(".slick-carousel-v3").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
      ],
    });
  }

  $(".search-result-card").hover(
    function () {
      $(this).prev(".search-result-card").addClass("highlight");
    },
    function () {
      $(this).prev(".search-result-card").removeClass("highlight");
    }
  );

  $(".read-more-btn").each(function () {
    var $btn = $(this);
    var showMoreText = "Show More";
    var showLessText = "Show Less";
    $btn.on("click", function () {
      // Find the nearest .mgt-desc-wrap, then its .mgt-details child
      var $descWrap = $btn.closest(".mgt-desc-wrap");
      var $details = $descWrap.find(".mgt-details");
      var isExpanded = $details.hasClass("expand");

      if (!isExpanded) {
        $details.addClass("expand");
        $btn.attr("aria-expanded", "true");
        $btn.addClass("rotate");
        // Update button text to "Show Less"
        $btn
          .contents()
          .filter(function () {
            return this.nodeType === 3; // Node.TEXT_NODE
          })
          .first()
          .replaceWith(showLessText + " ");
      } else {
        $details.removeClass("expand");
        $btn.attr("aria-expanded", "false");
        $btn.removeClass("rotate");
        // Update button text to "Show More"
        $btn
          .contents()
          .filter(function () {
            return this.nodeType === 3; // Node.TEXT_NODE
          })
          .first()
          .replaceWith(showMoreText + " ");
      }
    });
  });

  //Slider Script
  // Initialize card sliders only if they exist
  if ($(".card-slider").length) {
    // Common slider configuration
    var sliderConfig = {
      dots: false,
      arrows: false,
      infinite: false,
      autoplay: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      accessibility: true,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    // Initialize all card sliders
    $(".card-slider").each(function () {
      var $slider = $(this);
      $slider.slick(sliderConfig);

      // Bind navigation buttons for this specific slider
      var $section = $slider.closest(".slider-section");
      var $prevBtn = $section.find(".slider-btn-wrap .prev-btn");
      var $nextBtn = $section.find(".slider-btn-wrap .next-btn");

      $prevBtn.on("click", function () {
        $slider.slick("slickPrev");
        checkIfFirstOrLastSlideActive($slider);
      });

      $nextBtn.on("click", function () {
        $slider.slick("slickNext");
        checkIfFirstOrLastSlideActive($slider);
      });

      // Initialize button states
      checkIfFirstOrLastSlideActive($slider);

      // Update button states on slide change
      $slider.on("init reInit afterChange", function () {
        checkIfFirstOrLastSlideActive($slider);
      });
    });

    function checkIfFirstOrLastSlideActive($slider) {
      var $slides = $slider.find(".slick-slide");
      var $firstSlide = $slides.first();
      var $lastSlide = $slides.last();
      var $section = $slider.closest(".slider-section");
      var $prevBtn = $section.find(".slider-btn-wrap .prev-btn");
      var $nextBtn = $section.find(".slider-btn-wrap .next-btn");

      // Check if first slide is active
      if ($firstSlide.hasClass("slick-active")) {
        $prevBtn
          .addClass("disabled")
          .attr("disabled", true)
          .attr("aria-disabled", true);
      } else {
        $prevBtn
          .removeClass("disabled")
          .removeAttr("disabled")
          .attr("aria-disabled", false);
      }

      // Check if last slide is active
      if ($lastSlide.hasClass("slick-active")) {
        $nextBtn
          .addClass("disabled")
          .attr("disabled", true)
          .attr("aria-disabled", true);
      } else {
        $nextBtn
          .removeClass("disabled")
          .removeAttr("disabled")
          .attr("aria-disabled", false);
      }
    }
  }
  // Counter animation with intersection observer
  // Added commas to the counter
  (function () {
    let counterAnimationTriggered = false;

    if ($(".counter-count").length > 0) {
      const counterContainer = document.querySelector(".counter-count-container");

      const formatNumber = (num) =>
        new Intl.NumberFormat('en-US').format(Math.ceil(num));

      if (counterContainer) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                entry.intersectionRatio >= 0.3 &&
                !counterAnimationTriggered
              ) {
                counterAnimationTriggered = true;

                $(".counter-count").each(function () {
                  const $this = $(this);
                  const target = parseInt($this.attr("data-count"), 10) || 0;

                  $this.prop("Counter", 0).animate(
                    { Counter: target },
                    {
                      duration: 5000,
                      easing: "swing",
                      step: function (now) {
                        $this.text(formatNumber(now));
                      },
                    }
                  );
                });

                observer.disconnect();
              }
            });
          },
          {
            threshold: 0.3,
            rootMargin: "0px",
          }
        );

        observer.observe(counterContainer);
      } else {
        // Fallback if container not found
        $(".counter-count").each(function () {
          const $this = $(this);
          const target = parseInt($this.attr("data-count"), 10) || 0;

          $this.prop("Counter", 0).animate(
            { Counter: target },
            {
              duration: 5000,
              easing: "swing",
              step: function (now) {
                $this.text(formatNumber(now));
              },
            }
          );
        });
      }
    }
  })();


  //table right side blur script
  const $tableWrappers = $(".table-wrap .table-responsive");
  $tableWrappers.each(function () {
    const $wrapper = $(this);
    const $parent = $wrapper.parent();
    const $table = $wrapper.find("table");
    const $thead = $table.find("thead");

    // Function to check horizontal scroll and add relevant classes
    function checkScroll() {
      if ($wrapper[0].scrollWidth > $wrapper[0].clientWidth) {
        $parent.addClass("has-scroll");

        if (
          $wrapper.scrollLeft() + $wrapper.width() >=
          $wrapper[0].scrollWidth - 2
        ) {
          $parent.addClass("at-end");
        } else {
          $parent.removeClass("at-end");
        }
      } else {
        $parent.removeClass("has-scroll at-end");
      }
    }

    checkScroll();

    $wrapper.on("scroll", function () {
      checkScroll();
    });

    $(window).on("scroll resize", function () {
      checkScroll();
    });
  });

  const reveals = document.querySelectorAll(".reveal");

  function checkReveal() {
    const windowHeight = window.innerHeight;

    // Group elements by top position
    const groupedByTop = {};

    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (rect.top < windowHeight && rect.bottom > 0) {
        if (!groupedByTop[top]) groupedByTop[top] = [];
        groupedByTop[top].push(el);
      } else if (rect.top >= windowHeight) {
        el.classList.remove("revealed");
      }
    });

    // Sort groups by vertical position and reveal each group with delay
    Object.entries(groupedByTop)
      .sort((a, b) => a[0] - b[0])
      .forEach(([_, group], index) => {
        setTimeout(() => {
          group.forEach((el) => el.classList.add("revealed"));
        }, index * 100); // delay between blocks
      });
  }

  // Add scroll/resize listeners
  window.addEventListener("scroll", checkReveal);
  window.addEventListener("resize", checkReveal);
  checkReveal();

});

// Search input clear functionality
(function() {
  function initSearchClear() {
    const searchInput = document.getElementById('search-input');
    const resetButton = searchInput?.nextElementSibling;

    if (!searchInput || !resetButton) return;

    const resetIcon = resetButton.querySelector('img');
    const searchIconPath = '../assets/images/search-icon.svg';
    const closeIconPath = '../assets/images/close.svg';

    function updateResetButton() {
      if (searchInput.value) {
        resetIcon.src = closeIconPath;
      } else {
        resetIcon.src = searchIconPath;
      }
    }

    searchInput.addEventListener('input', updateResetButton);

    resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      updateResetButton();
    });
  }

  // Initialize on DOMContentLoaded and window resize
  document.addEventListener('DOMContentLoaded', initSearchClear);
  window.addEventListener('resize', initSearchClear);
})();

// Card height equalization for medium screens (576px to 991.98px)
(function() {
  function equalizeCardHeights() {
    const cardsRow = document.querySelector('.cards-row');
    if (!cardsRow) return;

    const cards = cardsRow.querySelectorAll('.card');
    const cardlinks = cardsRow.querySelectorAll('.card a');
    if (cards.length === 0) return;

    const windowWidth = window.innerWidth;
    const isMediumScreen = windowWidth >= 576 && windowWidth <= 991.98;

    if (!isMediumScreen) {
      // Reset heights for other screen sizes
      cards.forEach(card => {
        card.style.height = '';
      });
      return;
    }

    // Measure heights of all cards
    const cardHeights = [];
    cards.forEach(card => {
      // Temporarily remove any existing height to get natural height
      const originalHeight = card.style.height;
      card.style.height = '';

      // Get the computed height
      const computedHeight = card.offsetHeight;
      cardHeights.push(computedHeight);

      // Restore original height if it existed
      if (originalHeight) {
        card.style.height = originalHeight;
      }
    });

    // Find the maximum height
    const maxHeight = Math.max(...cardHeights);

    // Apply the maximum height to all cards
    cards.forEach(card => {
      card.style.height = maxHeight + 'px';
      const cardLink = card.querySelector('a');
      const cardImg = card.querySelector('.card-img-wrapper');
      console.log(cardImg.offsetHeight);
      console.log(cardImg.clientHeight);
      const cardBody = card.querySelector('.card-body');
      if (cardLink) {
        cardLink.style.height = maxHeight + 'px';
        cardBody.style.height = (maxHeight - cardImg.offsetHeight) + 'px';
      }
    });
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', equalizeCardHeights);

  // Re-equalize on window resize
  window.addEventListener('resize', equalizeCardHeights);

  // Re-equalize when images load (in case cards contain images that affect height)
  window.addEventListener('load', equalizeCardHeights);
})();


