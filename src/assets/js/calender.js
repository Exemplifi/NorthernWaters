document.addEventListener('DOMContentLoaded', function () {
  // Hide all .event-extra-details initially
  document.querySelectorAll('.event-extra-details').forEach(function (el) {
    el.style.display = 'none';
    el.style.overflow = 'hidden';
    el.style.maxHeight = '0';
    el.style.transition = 'max-height 0.3s ease';
  });

  // Set all .event-card-btn svg to 90deg initially, with transition
  document.querySelectorAll('.event-card-btn svg').forEach(function(svg) {
    svg.style.transform = 'rotate(90deg)';
    svg.style.transition = 'transform 0.3s ease';
  });

  function slideDown(element) {
    element.style.display = 'flex';
    element.style.overflow = 'hidden';
    element.style.transition = 'max-height 0.3s ease-in';
    // Force reflow to enable transition
    element.offsetHeight;
    element.style.maxHeight = element.scrollHeight + 'px';
  }

  function slideUp(element) {
    // Remove transition for immediate close
    element.style.transition = 'none';
    element.style.maxHeight = '0';
    setTimeout(function () {
      element.style.display = 'none';
      // Restore transition for next open
      element.style.transition = 'max-height 0.3s ease';
    }, 0);
  }

  document.querySelectorAll('.event-card-btn .tertiary-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // Find the closest .event-card-body
      var cardBody = btn.closest('.event-card-body');
      if (!cardBody) return;
      var details = cardBody.querySelector('.event-extra-details');
      if (!details) return;
      // Find the svg in this button
      var svg = btn.querySelector('svg');
      // Toggle only this one, do not close others
      // Find the text node (not the span) inside the button
      var btnTextNode = Array.from(btn.childNodes).find(function(node) {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '';
      });
      if (details.style.display === 'flex' && details.style.maxHeight !== '0px') {
        slideUp(details);
        if (svg) {
          svg.style.transform = 'rotate(90deg)';
        }
        if (btnTextNode) {
          btnTextNode.textContent = ' View More ';
        }
      } else {
        slideDown(details);
        if (svg) {
          svg.style.transform = 'rotate(-90deg)';
        }
        if (btnTextNode) {
          btnTextNode.textContent = ' View Less ';
        }
      }
    });
  });
});
