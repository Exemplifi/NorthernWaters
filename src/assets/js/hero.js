console.log("Hero component JS loaded");
// Placeholder for future hero interactivity (e.g., play/pause, animations)

// Hero video fallback handling
document.addEventListener("DOMContentLoaded", function () {
  const heroVideos = document.querySelectorAll(".hero-video");

  heroVideos.forEach(function (video) {
    video.addEventListener("error", function (e) {
      video.classList.add("video-error");
    });
  });
});
