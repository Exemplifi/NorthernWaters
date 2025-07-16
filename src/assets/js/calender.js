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
    element.style.transition = 'max-height 0.3s ease';
    // Force reflow to enable transition
    element.offsetHeight;
    element.style.maxHeight = element.scrollHeight + 'px';
  }

  function slideUp(element) {
    element.style.maxHeight = '0';
    setTimeout(function () {
      element.style.display = 'none';
    }, 280);
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
      // Close all other .event-extra-details in this .event-card and reset their svgs
      var eventCard = btn.closest('.event-card');
      if (eventCard) {
        eventCard.querySelectorAll('.event-card-btn .tertiary-btn').forEach(function (otherBtn) {
          var otherCardBody = otherBtn.closest('.event-card-body');
          var otherDetails = otherCardBody ? otherCardBody.querySelector('.event-extra-details') : null;
          var otherSvg = otherBtn.querySelector('svg');
          if (otherDetails && otherDetails !== details) {
            slideUp(otherDetails);
            if (otherSvg) {
              otherSvg.style.transform = 'rotate(90deg)';
            }
          }
        });
      }
      // Toggle this one
      if (details.style.display === 'flex' && details.style.maxHeight !== '0px') {
        slideUp(details);
        if (svg) {
          svg.style.transform = 'rotate(90deg)';
        }
      } else {
        slideDown(details);
        if (svg) {
          svg.style.transform = 'rotate(-90deg)';
        }
      }
    });
  });
});
