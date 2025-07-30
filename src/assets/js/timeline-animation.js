// Wait until the full HTML document is loaded and parsed
document.addEventListener("DOMContentLoaded", () => {

    // Select all timeline list items with the class `.custom-list-item`
    const items = document.querySelectorAll(".custom-list-item");

    // Create a new IntersectionObserver to detect when elements enter the viewport
    const observer = new IntersectionObserver((entries, observer) => {

      // Loop through each entry (observed element)
      entries.forEach(entry => {
        // Check if the element is visible in the viewport (based on threshold)
        if (entry.isIntersecting) {
          // Add a CSS class to trigger animations (e.g., fade in, slide in)
          entry.target.classList.add("in-view");

          // Stop observing this item so the animation only happens once
          observer.unobserve(entry.target);
        }
      });
    }, {
      // Trigger the observer when at least 20% of the item is visible
      threshold: 0.2
    });

    // Observe each list item so we can animate them on scroll
    items.forEach(item => observer.observe(item));
  });
