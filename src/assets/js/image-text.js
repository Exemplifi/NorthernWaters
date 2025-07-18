// Function to adjust image height based on parent container
const adjustImageHeight = () => {
  // Only run for screens >= 992px
  if (window.innerWidth >= 992) {
    // Find all sections with img-text-equal-height class
    const equalHeightSections = document.querySelectorAll('.img-text-equal-height');

    equalHeightSections.forEach(section => {
      const imageTextRow = section.querySelector('.image-text-row');
      const imgWrap = section.querySelector('.img-wrap');

      if (imageTextRow && imgWrap) {
        // Reset height to auto first to get natural height
        imgWrap.style.height = 'auto';

        // Set image wrapper height to match parent row height
        imgWrap.style.height = `${imageTextRow.offsetHeight}px`;

        // Make sure the image inside fills the container
        const img = imgWrap.querySelector('img');
        if (img) {
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
      }
    });
  } else {
    // Reset styles for screens < 992px
    const imgWraps = document.querySelectorAll('.img-text-equal-height .img-wrap');
    imgWraps.forEach(imgWrap => {
      imgWrap.style.height = 'auto';
      const img = imgWrap.querySelector('img');
      if (img) {
        img.style.height = 'auto';
        img.style.objectFit = 'initial';
      }
    });
  }
};

// Run on page load
document.addEventListener('DOMContentLoaded', adjustImageHeight);

// Run on window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(adjustImageHeight, 250);
});
