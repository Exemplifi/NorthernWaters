
document.addEventListener("DOMContentLoaded", function () {
  const heroVideos = document.querySelectorAll(".hero-video");

  heroVideos.forEach(function (video) {
    video.addEventListener("error", function (e) {
      video.classList.add("video-error");
    });
  });
});
