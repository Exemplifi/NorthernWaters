document.addEventListener('DOMContentLoaded', () => {
  const accordionHeaders = document.getElementsByClassName('accordian_header');
  const accordionContents = document.getElementsByClassName('accordian_content');

  // Set initial ARIA attributes and roles
  Array.from(accordionHeaders).forEach((header, index) => {
    const content = accordionContents[index];
    const headerId = `accordion-header-${index}`;
    const contentId = `accordion-content-${index}`;

    // Set ARIA attributes for accessibility
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', contentId);
    header.id = headerId;

    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', headerId);
    content.id = contentId;
    content.setAttribute('aria-hidden', 'true');

    // Add keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Function to update accordion content height
  const updateContentHeight = (content, isExpanding) => {
    // Get the actual height of the content
    const contentHeight = content.scrollHeight;

    // Set a specific max-height based on content height when expanding
    if (isExpanding) {
      content.style.maxHeight = `${contentHeight}px`;
    } else {
      content.style.maxHeight = '0px';
    }
  };

  // Add click handlers
  Array.from(accordionHeaders).forEach((header, index) => {
    header.addEventListener('click', () => {
      const content = accordionContents[index];
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other accordions (optional - remove if you want multiple open)
      Array.from(accordionHeaders).forEach((otherHeader, otherIndex) => {
        if (otherIndex !== index && otherHeader.getAttribute('aria-expanded') === 'true') {
          const otherContent = accordionContents[otherIndex];
          otherContent.classList.remove('show');
          otherHeader.setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('aria-hidden', 'true');
          updateContentHeight(otherContent, false);
        }
      });

      // Toggle current accordion
      content.classList.toggle('show');
      header.setAttribute('aria-expanded', !isExpanded);
      content.setAttribute('aria-hidden', isExpanded);

      // Update max-height based on content
      updateContentHeight(content, !isExpanded);
    });
  });
});