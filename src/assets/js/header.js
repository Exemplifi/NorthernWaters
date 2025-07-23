// Header Component JavaScript
const setupHeader = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const searchBtn = header.querySelector(".header__search-btn");
  const mobileToggle = header.querySelector(".header__toggle");
  const navbarCollapse = header.querySelector(".navbar-collapse");

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search clicked");
  };

  const handleMobileMenu = () => {
    document.body.classList.toggle("menu-open");
    // Update ARIA expanded state
    if (mobileToggle) {
      const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", !isExpanded);
    }
  };

  const handleOutsideClick = (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !header.contains(e.target)
    ) {
      mobileToggle.click();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      mobileToggle.click();
    }
  };

  const setupDropdownKeyboardNavigation = () => {
    const dropdowns = header.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".dropdown-toggle");
      const menu = dropdown.querySelector(".dropdown-menu");
      const menuIcon = trigger?.querySelector(".header__menu-icon");

      if (trigger && menu) {
        // Add click event listener for icon rotation
        trigger.addEventListener("click", () => {
          if (menuIcon) {
            menuIcon.classList.toggle("rotated");
          }
        });

        trigger.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            trigger.click();
          }
        });
      }
    });
  };

  const setupAccessibility = () => {
    // Ensure proper ARIA states for mobile menu
    if (mobileToggle && navbarCollapse) {
      const updateAriaExpanded = () => {
        const isExpanded = document.body.classList.contains("menu-open");
        mobileToggle.setAttribute("aria-expanded", isExpanded);
      };

      // Update ARIA states when menu opens/closes
      const observer = new MutationObserver(() => {
        updateAriaExpanded();
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    // Add keyboard navigation for dropdowns
    const dropdowns = header.querySelectorAll(".dropdown-menu");
    dropdowns.forEach((dropdown) => {
      const items = dropdown.querySelectorAll(".dropdown-item");

      items.forEach((item, index) => {
        item.addEventListener("keydown", (e) => {
          let targetItem;

          switch (e.key) {
            case "ArrowUp":
              e.preventDefault();
              targetItem = items[index - 1] || items[items.length - 1];
              break;
            case "ArrowDown":
              e.preventDefault();
              targetItem = items[index + 1] || items[0];
              break;
            case "Escape":
              e.preventDefault();
              dropdown
                .closest(".dropdown")
                .querySelector(".dropdown-toggle")
                .click();
              break;
          }

          if (targetItem) {
            targetItem.focus();
          }
        });
      });
    });
  };

  // Bind events
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }

  if (mobileToggle && navbarCollapse) {
    mobileToggle.addEventListener("click", handleMobileMenu);
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
  }

  setupDropdownKeyboardNavigation();
  setupAccessibility();

  // Header On Scroll Script
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const headers = document.querySelectorAll(".header");

    if (scrollTop === 0) {
      // At the very top of the page – remove both classes
      headers.forEach((el) => el.classList.remove("upwards", "downwards"));
    } else if (scrollTop > lastScrollTop) {
      // Scrolling down
      headers.forEach((el) => {
        el.classList.add("downwards");
        el.classList.remove("upwards");
      });
    } else if (scrollTop < lastScrollTop) {
      // Scrolling up
      headers.forEach((el) => {
        el.classList.add("upwards");
        el.classList.remove("downwards");
      });
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative values
  });
};

// Initialize header
document.addEventListener("DOMContentLoaded", setupHeader);

// Mega Menu - Vanilla JavaScript
const setupMegaMenu = () => {
  const isMobile = () => window.innerWidth < 992;
  const menuItems = document.querySelectorAll('.header__menu-item.has-mega-menu');
  
  // Helper to close all mega menus
  const closeAllMegaMenus = () => {
    menuItems.forEach(item => {
      const megaMenu = item.querySelector('.mega-menu-wrapper');
      if (megaMenu) {
        megaMenu.classList.remove('show');
        megaMenu.style.removeProperty('--dynamic-height');
        megaMenu.classList.remove('mega-menu-dynamic-height');
      }
      item.classList.remove('active');
      // Remove active from all level 2 and 3 items
      const level2s = megaMenu?.querySelectorAll('.level-2-menu > li');
      level2s?.forEach(l2 => l2.classList.remove('active'));
      const level3s = megaMenu?.querySelectorAll('.level-3-menu > li');
      level3s?.forEach(l3 => l3.classList.remove('active'));
    });
  };

  // Utility: Safely get scrollHeight even if element is hidden
  function getNaturalScrollHeight(el) {
    if (!el) return 0;
    const prevDisplay = el.style.display;
    const prevVisibility = el.style.visibility;
    const prevPosition = el.style.position;
    let needRestore = false;
    if (window.getComputedStyle(el).display === 'none') {
      el.style.display = 'block';
      el.style.visibility = 'hidden';
      el.style.position = 'absolute';
      needRestore = true;
    }
    const height = el.scrollHeight;
    if (needRestore) {
      el.style.display = prevDisplay;
      el.style.visibility = prevVisibility;
      el.style.position = prevPosition;
    }
    return height;
  }

  // Calculate dynamic height for columns (excluding label)
  const calculateDynamicHeight = (megaMenu) => {
    const level2 = megaMenu.querySelector('.level-2-menu');
    const level3s = megaMenu.querySelectorAll('.level-3-menu');
    const level4s = megaMenu.querySelectorAll('.level-4-menu');
    const labelHeight = megaMenu.querySelector('.label-wrapper')?.scrollHeight || 0;
    const h2 = getNaturalScrollHeight(level2);
    // Always measure all, not just visible
    let h3 = 0;
    level3s.forEach(l3 => {
      h3 = Math.max(h3, getNaturalScrollHeight(l3));
    });
    let h4 = 0;
    level4s.forEach(l4 => {
      h4 = Math.max(h4, getNaturalScrollHeight(l4));
    });
    let maxColHeight = Math.max(h2, h3, h4, 250);
    // Set height only on visible columns
    if (level2) {
      level2.style.height = maxColHeight + 'px';
      level2.style.maxHeight = maxColHeight + 'px';
    }
    level3s.forEach(l3 => {
      if (l3.offsetParent !== null) {
        l3.style.height = maxColHeight + 'px';
        l3.style.maxHeight = maxColHeight + 'px';
      } else {
        l3.style.height = '';
        l3.style.maxHeight = '';
      }
    });
    level4s.forEach(l4 => {
      if (l4.offsetParent !== null) {
        l4.style.height = maxColHeight + 'px';
        l4.style.maxHeight = maxColHeight + 'px';
      } else {
        l4.style.height = '';
        l4.style.maxHeight = '';
      }
    });
    let wrapperHeight = maxColHeight + labelHeight;
    const viewportLimit = window.innerHeight - 150;
    if (wrapperHeight > viewportLimit) {
      wrapperHeight = viewportLimit;
      megaMenu.classList.add('scrollable');
    } else {
      megaMenu.classList.remove('scrollable');
    }
    megaMenu.style.setProperty('--dynamic-height', `${wrapperHeight}px`);
    megaMenu.classList.add('mega-menu-dynamic-height');
    return wrapperHeight;
  };

  // Desktop hover/focus logic
  menuItems.forEach(item => {
    const trigger = item.querySelector('.dropdown-toggle');
    const megaMenu = item.querySelector('.mega-menu-wrapper');
    if (!trigger || !megaMenu) return;

    // ARIA attributes for accessibility
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', megaMenu.id || '');

    // Open mega menu on hover/focus (desktop only)
    item.addEventListener('mouseenter', () => {
      if (!isMobile()) {
        closeAllMegaMenus();
        calculateDynamicHeight(megaMenu); // Only here!
        megaMenu.classList.add('show');
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!isMobile()) {
        setTimeout(() => {
          if (!item.matches(':hover') && !megaMenu.matches(':hover')) {
            megaMenu.classList.remove('show');
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            // Remove active from all level 2 and 3 items
            const level2s = megaMenu.querySelectorAll('.level-2-menu > li');
            level2s.forEach(l2 => l2.classList.remove('active'));
            const level3s = megaMenu.querySelectorAll('.level-3-menu > li');
            level3s.forEach(l3 => l3.classList.remove('active'));
          }
        }, 100);
      }
    });

    // Keyboard navigation for mega menu
    trigger.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !isMobile()) {
        e.preventDefault();
        closeAllMegaMenus();
          calculateDynamicHeight(megaMenu);
          megaMenu.classList.add('show');
          item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        // Focus first level 2 item
        const firstL2 = megaMenu.querySelector('.level-2-menu > li > a');
        if (firstL2) firstL2.focus();
      }
    });

    // Level 2 logic
    const level2Items = megaMenu.querySelectorAll('.level-2-menu > li');
    level2Items.forEach(l2 => {
      const l2Link = l2.querySelector('a');
      const l3Menu = l2.querySelector('.level-3-menu');
      if (l3Menu) {
        // ARIA for level 2
        l2Link.setAttribute('aria-haspopup', 'true');
        l2Link.setAttribute('aria-expanded', 'false');
        l2Link.setAttribute('tabindex', '0');
        // Hover/focus/click
        const activateL2 = () => {
          // Remove active from all level 2 and 3
          level2Items.forEach(i => i.classList.remove('active'));
          const allL3 = megaMenu.querySelectorAll('.level-3-menu > li');
          allL3.forEach(i => i.classList.remove('active'));
          l2.classList.add('active');
          l2Link.setAttribute('aria-expanded', 'true');
          // Removed: calculateDynamicHeight(megaMenu);
        };
        l2.addEventListener('mouseenter', () => {
          if (!isMobile()) {
            activateL2();
          }
        });
        l2Link.addEventListener('click', (e) => {
          if (!isMobile()) {
            activateL2();
          }
        });
        // Keyboard navigation for level 2
        l2Link.addEventListener('keydown', (e) => {
          if ((e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') && !isMobile()) {
            e.preventDefault();
            activateL2();
            // Focus first level 3 item
            const firstL3 = l3Menu.querySelector('li > a');
            if (firstL3) firstL3.focus();
          }
        });
      }
    });

    // Level 3 logic
    const level3Items = megaMenu.querySelectorAll('.level-3-menu > li');
    level3Items.forEach(l3 => {
      const l3Link = l3.querySelector('a');
      const l4Menu = l3.querySelector('.level-4-menu');
      if (l4Menu) {
        // ARIA for level 3
        l3Link.setAttribute('aria-haspopup', 'true');
        l3Link.setAttribute('aria-expanded', 'false');
        l3Link.setAttribute('tabindex', '0');
        // Hover/focus/click
        const activateL3 = () => {
          // Remove active from all level 3
          level3Items.forEach(i => i.classList.remove('active'));
          l3.classList.add('active');
          l3Link.setAttribute('aria-expanded', 'true');
          // Removed: calculateDynamicHeight(megaMenu);
        };
        l3.addEventListener('mouseenter', () => {
          if (!isMobile()) {
            activateL3();
          }
        });
        l3Link.addEventListener('click', (e) => {
          if (!isMobile()) {
            activateL3();
          }
        });
        // Keyboard navigation for level 3
        l3Link.addEventListener('keydown', (e) => {
          if ((e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') && !isMobile()) {
            e.preventDefault();
            activateL3();
            // Focus first level 4 item
            const firstL4 = l4Menu.querySelector('li > a');
            if (firstL4) firstL4.focus();
          }
        });
      }
    });
  });

  // Handle level 3 and 4 hover states with height adjustment
  document.addEventListener('mouseenter', (e) => {
    if (e.target.closest('.has-level-3-children') || e.target.closest('.has-level-4-children')) {
      const megaMenuWrapper = e.target.closest('.mega-menu-wrapper');
      if (megaMenuWrapper) {
        // Recalculate height when submenus are revealed
        setTimeout(() => calculateDynamicHeight(megaMenuWrapper), 50);
      }
    }
  }, true);

  // Close mega menu on outside click or Escape
  document.addEventListener('click', (e) => {
    const target = e.target.nodeType === 1 ? e.target : e.target.parentElement;
    if (
      !(target && target.closest && target.closest('.header__menu-item.has-mega-menu')) &&
      !(target && target.closest && target.closest('.mega-menu-wrapper'))
    ) {
      closeAllMegaMenus();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMegaMenus();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (isMobile()) {
    closeAllMegaMenus();
    }
  });
};

// Initialize mega menu
document.addEventListener("DOMContentLoaded", setupMegaMenu);
