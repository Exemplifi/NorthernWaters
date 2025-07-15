document.addEventListener("DOMContentLoaded", function () {
  const heroVideos = document.querySelectorAll(".hero-video");

  heroVideos.forEach(function (video) {
    video.addEventListener("error", function (e) {
      video.classList.add("video-error");
    });
  });

  // hero tertiary
  const heroTertiary = document.querySelectorAll(".hero-tertiary");
  const header = document.querySelector('.header');

  heroTertiary.forEach(function (hero) {
    // Function to update hero height based on header height
    const updateHeroHeight = () => {
      if (header) {
        // Get total height of header including padding and borders
        const headerHeight = header.offsetHeight;
        // Apply header height to hero element
        hero.style.height = `${headerHeight}px`;
      }
    };

    // Initial height update
    updateHeroHeight();

    // Update height on window resize and orientation change
    window.addEventListener('resize', updateHeroHeight);
    window.addEventListener('orientationchange', updateHeroHeight);
  });
});
