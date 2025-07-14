// Enhance Bootstrap carousel arrows and add custom logic if needed

document.addEventListener("DOMContentLoaded", function () {
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

  if ($(".news-slider").length) {
    $(".news-slider").slick({
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      slidesToShow: 3.2,
      slidesToScroll: 1,
      accessibility: true,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2.1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1.1,
          },
        },
      ],
    });
  }

  if ($(".project-slider").length) {
    $(".project-slider").slick({
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      slidesToShow: 3.2,
      slidesToScroll: 1,
      accessibility: true,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2.1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1.1,
          },
        },
      ],
    });
  }
});
