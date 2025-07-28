// Header Component JavaScript
const setupHeader = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const searchBtn = header.querySelector(".header__search-btn");
  const mobileToggle = header.querySelector(".header__toggle");
  const navbarCollapse = header.querySelector(".navbar-collapse");

  const handleSearch = () => {
    setupSearchOverlay();
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

  // Mobile Mega Menu Functionality
  const setupMobileMegaMenu = () => {
    const isMobile = () => window.innerWidth < 992;

    // Handle main dropdown navigation items
    const dropdownNavItems = header.querySelectorAll('.nav-item.dropdown.has-mega-menu');
    
    dropdownNavItems.forEach(item => {
      const trigger = item.querySelector('.dropdown-toggle');
      const megaMenuWrapper = item.querySelector('.mega-menu-wrapper');
      
      if (trigger && megaMenuWrapper) {
        // Set initial ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', megaMenuWrapper.id || `mega-menu-${Math.random().toString(36).substr(2, 9)}`);
        megaMenuWrapper.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Only apply mobile logic if we're on mobile
          if (!isMobile()) return;
          
          const isCurrentlyActive = item.classList.contains('active');
          
          // Remove active class from all dropdown nav items
          dropdownNavItems.forEach(navItem => {
            navItem.classList.remove('active');
            const navTrigger = navItem.querySelector('.dropdown-toggle');
            const navMegaMenu = navItem.querySelector('.mega-menu-wrapper');
            
            if (navTrigger) {
              navTrigger.setAttribute('aria-expanded', 'false');
            }
            if (navMegaMenu) {
              navMegaMenu.setAttribute('aria-hidden', 'true');
            }
          });
          
          // Toggle current item if it wasn't active
          if (!isCurrentlyActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            megaMenuWrapper.setAttribute('aria-hidden', 'false');
            
            // Set focus to first focusable element in mega menu
            const firstFocusable = megaMenuWrapper.querySelector('a, button');
            if (firstFocusable) {
              setTimeout(() => firstFocusable.focus(), 100);
            }
          }
        });
        
        // Keyboard navigation for main dropdown triggers
        trigger.addEventListener('keydown', (e) => {
          if (!isMobile()) return;
          
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger.click();
          } else if (e.key === 'Escape') {
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            megaMenuWrapper.setAttribute('aria-hidden', 'true');
            trigger.focus();
          }
        });
      }
    });

    // Handle level-3 children
    const level3Items = header.querySelectorAll('.has-level-3-children');
    
    level3Items.forEach(item => {
      const trigger = item.querySelector('a');
      const level3Menu = item.querySelector('.level-3-menu');
      
      if (trigger && level3Menu) {
        // Set initial ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', level3Menu.id || `level3-menu-${Math.random().toString(36).substr(2, 9)}`);
        level3Menu.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          // Only apply mobile logic if we're on mobile
          if (!isMobile()) return;
          
          e.preventDefault();
          
          const isCurrentlyActive = item.classList.contains('active');
          
          // Remove active class from all level-3 children in the same parent
          const parentMegaMenu = item.closest('.mega-menu-wrapper');
          if (parentMegaMenu) {
            const siblingLevel3Items = parentMegaMenu.querySelectorAll('.has-level-3-children');
            siblingLevel3Items.forEach(siblingItem => {
              siblingItem.classList.remove('active');
              const siblingTrigger = siblingItem.querySelector('a');
              const siblingMenu = siblingItem.querySelector('.level-3-menu');
              
              if (siblingTrigger) {
                siblingTrigger.setAttribute('aria-expanded', 'false');
              }
              if (siblingMenu) {
                siblingMenu.setAttribute('aria-hidden', 'true');
              }
            });
          }
          
          // Toggle current item if it wasn't active
          if (!isCurrentlyActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            level3Menu.setAttribute('aria-hidden', 'false');
            
            // Set focus to first focusable element in level 3 menu
            const firstFocusable = level3Menu.querySelector('a, button');
            if (firstFocusable) {
              setTimeout(() => firstFocusable.focus(), 100);
            }
          }
        });
        
        // Keyboard navigation for level 3 triggers
        trigger.addEventListener('keydown', (e) => {
          if (!isMobile()) return;
          
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger.click();
          } else if (e.key === 'Escape') {
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            level3Menu.setAttribute('aria-hidden', 'true');
            trigger.focus();
          }
        });
      }
    });

    // Handle level-4 children
    const level4Items = header.querySelectorAll('.has-level-4-children');
    
    level4Items.forEach(item => {
      const trigger = item.querySelector('a');
      const level4Menu = item.querySelector('.level-4-menu');
      
      if (trigger && level4Menu) {
        // Set initial ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', level4Menu.id || `level4-menu-${Math.random().toString(36).substr(2, 9)}`);
        level4Menu.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          // Only apply mobile logic if we're on mobile
          if (!isMobile()) return;
          
          e.preventDefault();
          
          const isCurrentlyActive = item.classList.contains('active');
          
          // Remove active class from all level-4 children in the same parent
          const parentLevel3Menu = item.closest('.level-3-menu');
          if (parentLevel3Menu) {
            const siblingLevel4Items = parentLevel3Menu.querySelectorAll('.has-level-4-children');
            siblingLevel4Items.forEach(siblingItem => {
              siblingItem.classList.remove('active');
              const siblingTrigger = siblingItem.querySelector('a');
              const siblingMenu = siblingItem.querySelector('.level-4-menu');
              
              if (siblingTrigger) {
                siblingTrigger.setAttribute('aria-expanded', 'false');
              }
              if (siblingMenu) {
                siblingMenu.setAttribute('aria-hidden', 'true');
              }
            });
          }
          
          // Toggle current item if it wasn't active
          if (!isCurrentlyActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            level4Menu.setAttribute('aria-hidden', 'false');
            
            // Set focus to first focusable element in level 4 menu
            const firstFocusable = level4Menu.querySelector('a, button');
            if (firstFocusable) {
              setTimeout(() => firstFocusable.focus(), 100);
            }
          }
        });
        
        // Keyboard navigation for level 4 triggers
        trigger.addEventListener('keydown', (e) => {
          if (!isMobile()) return;
          
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger.click();
          } else if (e.key === 'Escape') {
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            level4Menu.setAttribute('aria-hidden', 'true');
            trigger.focus();
          }
        });
      }
    });
    
    // Handle window resize to reset mobile states
    const handleResize = () => {
      if (!isMobile()) {
        // Reset all active states when switching to desktop
        dropdownNavItems.forEach(item => {
          item.classList.remove('active');
          const trigger = item.querySelector('.dropdown-toggle');
          const megaMenu = item.querySelector('.mega-menu-wrapper');
          
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
        });
        
        level3Items.forEach(item => {
          item.classList.remove('active');
          const trigger = item.querySelector('a');
          const menu = item.querySelector('.level-3-menu');
          
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (menu) menu.setAttribute('aria-hidden', 'true');
        });
        
        level4Items.forEach(item => {
          item.classList.remove('active');
          const trigger = item.querySelector('a');
          const menu = item.querySelector('.level-4-menu');
          
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (menu) menu.setAttribute('aria-hidden', 'true');
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
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
  setupMobileMegaMenu();

  // Header On Scroll Script (Desktop Only)
  let lastScrollTop = 0;
  const isDesktop = () => window.innerWidth >= 992;

  const handleHeaderScroll = () => {
    // Only apply scroll effects on desktop
    if (!isDesktop()) return;

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
  };

  // Reset header scroll classes when switching to mobile
  const resetHeaderScrollClasses = () => {
    const headers = document.querySelectorAll(".header");
    headers.forEach((el) => el.classList.remove("upwards", "downwards"));
  };

  // Handle window resize for scroll behavior
  const handleScrollResize = () => {
    if (!isDesktop()) {
      // Reset scroll classes when switching to mobile
      resetHeaderScrollClasses();
    }
  };

  window.addEventListener("scroll", handleHeaderScroll);
  window.addEventListener("resize", handleScrollResize);
};

// Initialize header
document.addEventListener("DOMContentLoaded", setupHeader);

// Mega Menu - Vanilla JavaScript
const setupMegaMenu = () => {
  const isMobile = () => window.innerWidth < 992;
  const menuItems = document.querySelectorAll('.header__menu-item.has-mega-menu');
  
  // Helper to close all mega menus
  const closeAllMegaMenus = (exceptMenu) => {
    menuItems.forEach(item => {
      const megaMenu = item.querySelector('.mega-menu-wrapper');
      if (megaMenu && megaMenu !== exceptMenu) {
        megaMenu.classList.remove('show');
        megaMenu.classList.remove('mega-menu-dynamic-height');
        item.classList.remove('active');
        
        // Remove inline height styles from all menu levels
        const level2 = megaMenu.querySelector('.level-2-menu');
        const level3s = megaMenu.querySelectorAll('.level-3-menu');
        const level4s = megaMenu.querySelectorAll('.level-4-menu');
        
        // Clear heights and scroll classes
        if (level2) {
          level2.style.removeProperty('height');
          level2.style.removeProperty('min-height');
          level2.style.removeProperty('max-height');
          level2.classList.remove('mega-menu-scroll');
        }
        level3s.forEach(l3 => {
          l3.style.removeProperty('height');
          l3.style.removeProperty('min-height');
          l3.style.removeProperty('max-height');
          l3.classList.remove('mega-menu-scroll');
        });
        level4s.forEach(l4 => {
          l4.style.removeProperty('height');
          l4.style.removeProperty('min-height');
          l4.style.removeProperty('max-height');
          l4.classList.remove('mega-menu-scroll');
        });
        
        // Remove active from all level 2 and 3 items
        const level2s = megaMenu?.querySelectorAll('.level-2-menu-container > li');
        level2s?.forEach(l2 => l2.classList.remove('active'));
        const level3sItems = megaMenu?.querySelectorAll('.level-3-menu-container > li');
        level3sItems?.forEach(l3 => l3.classList.remove('active'));
      }
    });
  };

  // Improved function to calculate and set heights for level-2, level-3, and level-4 menus
  function setMegaMenuColumnHeights(megaMenu) {
    // Enhanced height calculation that handles hidden elements
    function getContentHeight(element) {
      if (!element) return 0;
      
      // Store original styles more comprehensively
      const originalStyles = {};
      const stylesToCheck = ['height', 'minHeight', 'maxHeight', 'overflow', 'display', 'visibility', 'position', 'left', 'top'];
      
      stylesToCheck.forEach(prop => {
        originalStyles[prop] = element.style[prop] || '';
      });
      
      // Store computed display to check if hidden
      const wasHidden = window.getComputedStyle(element).display === 'none';
      
      // Make element measurable (but keep it off-screen if it was hidden)
      if (wasHidden) {
        element.style.display = 'flex';
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
      }
      
      // Reset height-related styles to get natural height
      element.style.height = 'auto';
      element.style.minHeight = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      
      // Force reflow
      element.offsetHeight;
      
      // Get the actual scrollHeight
      const naturalHeight = element.scrollHeight;
      
      // Restore ALL original styles completely
      stylesToCheck.forEach(prop => {
        if (originalStyles[prop]) {
          element.style[prop] = originalStyles[prop];
        } else {
          // Remove the property completely if it wasn't set originally
          element.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        }
      });
      
      return naturalHeight;
    }

    // Get all menu elements
    const level2 = megaMenu.querySelector('.level-2-menu');
    const level3s = Array.from(megaMenu.querySelectorAll('.level-3-menu'));
    const level4s = Array.from(megaMenu.querySelectorAll('.level-4-menu'));
    
    // Function to clean up any leftover inline styles
    function cleanupInlineStyles(element) {
      if (!element) return;
      
      // Remove temporary positioning and visibility styles that might be left over
      const tempStyles = ['visibility', 'position', 'left', 'top'];
      tempStyles.forEach(prop => {
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (element.style[prop] === 'hidden' || 
            element.style[prop] === 'absolute' || 
            element.style[prop] === '-9999px') {
          element.style.removeProperty(kebabProp);
        }
      });
      
      // Only keep the height styles we intentionally set (remove min-height and max-height)
      const allowedStyles = ['height'];
      const currentStyles = Array.from(element.style);
      currentStyles.forEach(styleName => {
        const camelCase = styleName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (!allowedStyles.includes(styleName) && 
            !allowedStyles.includes(camelCase) &&
            (styleName.includes('height') || styleName.includes('position') || 
             styleName.includes('visibility') || styleName.includes('left') || 
             styleName.includes('top') || styleName.includes('display'))) {
          element.style.removeProperty(styleName);
        }
      });
    }
    
    // Clear any existing heights first
    [level2, ...level3s, ...level4s].forEach(element => {
      if (element) {
        element.style.removeProperty('height');
        element.style.removeProperty('min-height');
        element.style.removeProperty('max-height');
        element.classList.remove('mega-menu-scroll');
        cleanupInlineStyles(element);
      }
    });

    // Small delay to ensure DOM is settled
    setTimeout(() => {
      // Measure heights
      const heights = [];
      
      if (level2) {
        heights.push(getContentHeight(level2));
      }
      
      level3s.forEach(l3 => {
        if (l3) {
          heights.push(getContentHeight(l3));
        }
      });
      
      level4s.forEach(l4 => {
        if (l4) {
          heights.push(getContentHeight(l4));
        }
      });

      // Filter out 0 heights and calculate the maximum height
      const validHeights = heights.filter(h => h > 0);
      const maxContentHeight = Math.max(...validHeights, 300);
      
      // Check if scrolling is needed
      const navbar = document.querySelector('.header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const labelWrapper = megaMenu.querySelector('.label-wrapper');
      const labelWrapperHeight = labelWrapper ? labelWrapper.offsetHeight : 0;
      const maxAllowed = window.innerHeight - navbarHeight - labelWrapperHeight - 60;
      
      // Determine final height and scroll behavior
      const finalHeight = Math.min(maxContentHeight, maxAllowed);
      const needsScroll = maxContentHeight > maxAllowed;
      
      console.log('Heights measured:', heights, 'Valid heights:', validHeights);
      console.log('Max content height:', maxContentHeight, 'Max allowed:', maxAllowed);
      console.log('Final height:', finalHeight, 'Needs scroll:', needsScroll);

      // Apply heights to all elements (remove min-height)
      if (level2) {
        level2.style.setProperty('height', `${finalHeight}px`, 'important');
      }

      level3s.forEach(l3 => {
        if (l3) {
          l3.style.setProperty('height', `${finalHeight}px`, 'important');
        }
      });

      level4s.forEach(l4 => {
        if (l4) {
          l4.style.setProperty('height', `${finalHeight}px`, 'important');
        }
      });

      // Add scroll class if content is too tall for viewport
      if (needsScroll) {
        [level2, ...level3s, ...level4s].forEach(element => {
          if (element) {
            element.classList.add('mega-menu-scroll');
          }
        });
      }
      
      // Final cleanup - remove any leftover temporary inline styles
      [level2, ...level3s, ...level4s].forEach(element => {
        cleanupInlineStyles(element);
      });
    }, 10);
  }

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
    let heightSet = false;
    item.addEventListener('mouseenter', () => {
      if (!isMobile() && !megaMenu.classList.contains('show')) {
        closeAllMegaMenus(megaMenu); // Only close others
        setMegaMenuColumnHeights(megaMenu);
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
            
            // Remove inline height styles when closing
            const level2 = megaMenu.querySelector('.level-2-menu');
            const level3s = megaMenu.querySelectorAll('.level-3-menu');
            const level4s = megaMenu.querySelectorAll('.level-4-menu');
            
            if (level2) {
              level2.style.removeProperty('height');
              level2.style.removeProperty('min-height');
              level2.style.removeProperty('max-height');
              level2.classList.remove('mega-menu-scroll');
            }
            level3s.forEach(l3 => {
              l3.style.removeProperty('height');
              l3.style.removeProperty('min-height');
              l3.style.removeProperty('max-height');
              l3.classList.remove('mega-menu-scroll');
            });
            level4s.forEach(l4 => {
              l4.style.removeProperty('height');
              l4.style.removeProperty('min-height');
              l4.style.removeProperty('max-height');
              l4.classList.remove('mega-menu-scroll');
            });
            
            // Remove active from all level 2 and 3 items
            const level2s = megaMenu.querySelectorAll('.level-2-menu-container > li');
            level2s.forEach(l2 => l2.classList.remove('active'));
            const level3sItems = megaMenu.querySelectorAll('.level-3-menu-container > li');
            level3sItems.forEach(l3 => l3.classList.remove('active'));
          }
        }, 100);
      }
    });

    // Keyboard navigation for mega menu
    trigger.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !isMobile()) {
        e.preventDefault();
        closeAllMegaMenus();
          megaMenu.classList.add('show');
          item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        // Focus first level 2 item
        const firstL2 = megaMenu.querySelector('.level-2-menu-container > li > a');
        if (firstL2) firstL2.focus();
      }
    });

    // Level 2 logic
    const level2Items = megaMenu.querySelectorAll('.level-2-menu-container > li');
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
          const allL3 = megaMenu.querySelectorAll('.level-3-menu-container > li');
          allL3.forEach(i => i.classList.remove('active'));
          l2.classList.add('active');
          l2Link.setAttribute('aria-expanded', 'true');
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
            const firstL3 = l3Menu.querySelector('.level-3-menu-container > li > a');
            if (firstL3) firstL3.focus();
          }
        });
      }
    });

    // Level 3 logic
    const level3Items = megaMenu.querySelectorAll('.level-3-menu-container > li');
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
            const firstL4 = l4Menu.querySelector('.level-4-menu-container > li > a');
            if (firstL4) firstL4.focus();
          }
        });
      }
    });
  });

  // Handle level 3 and 4 hover states with height adjustment
  document.addEventListener('mouseenter', (e) => {
    const target = getClosestElement(e.target, '.has-level-3-children') || 
                   getClosestElement(e.target, '.has-level-4-children');
    if (target) {
      const megaMenuWrapper = getClosestElement(e.target, '.mega-menu-wrapper');
      if (megaMenuWrapper) {
        setTimeout(() => {
          // No dynamic height calculation, just ensure it's visible
          megaMenuWrapper.classList.add('show');
        }, 50);
      }
    }
  }, true);

  // Close mega menu on outside click or Escape
  // Fix: ensure e.target.closest is only called on Elements
  function getClosestElement(target, selector) {
    let el = target;
    while (el && el.nodeType !== 1) {
      el = el.parentElement;
    }
    return el && el.closest ? el.closest(selector) : null;
  }
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      !getClosestElement(target, '.header__menu-item.has-mega-menu') &&
      !getClosestElement(target, '.mega-menu-wrapper')
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

// Test function to debug height calculation - you can run this in browser console
window.debugMegaMenuHeights = function() {
  const megaMenu = document.querySelector('.mega-menu-wrapper.show');
  if (!megaMenu) {
    console.log('No open mega menu found. Please open a mega menu first.');
    return;
  }
  
  const level2 = megaMenu.querySelector('.level-2-menu');
  const level3s = Array.from(megaMenu.querySelectorAll('.level-3-menu'));
  const level4s = Array.from(megaMenu.querySelectorAll('.level-4-menu'));
  
  console.log('=== MEGA MENU HEIGHT DEBUG ===');
  console.log('Level 2 element:', level2);
  
  if (level2) {
    console.log('Level 2 scrollHeight:', level2.scrollHeight);
    console.log('Level 2 offsetHeight:', level2.offsetHeight);
    console.log('Level 2 clientHeight:', level2.clientHeight);
    console.log('Level 2 computed height:', window.getComputedStyle(level2).height);
    console.log('Level 2 computed display:', window.getComputedStyle(level2).display);
  }
  
  level3s.forEach((l3, i) => {
    console.log(`Level 3-${i} scrollHeight:`, l3.scrollHeight);
    console.log(`Level 3-${i} offsetHeight:`, l3.offsetHeight);
    console.log(`Level 3-${i} clientHeight:`, l3.clientHeight);
    console.log(`Level 3-${i} computed display:`, window.getComputedStyle(l3).display);
  });
  
  level4s.forEach((l4, i) => {
    console.log(`Level 4-${i} scrollHeight:`, l4.scrollHeight);
    console.log(`Level 4-${i} offsetHeight:`, l4.offsetHeight);
    console.log(`Level 4-${i} clientHeight:`, l4.clientHeight);
    console.log(`Level 4-${i} computed display:`, window.getComputedStyle(l4).display);
  });
  
  // Test natural height calculation with proper hidden element handling
  function testGetContentHeight(element, name) {
    if (!element) return 0;
    
    const originalStyles = {
      height: element.style.height,
      minHeight: element.style.minHeight,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      display: element.style.display,
      visibility: element.style.visibility,
      position: element.style.position
    };
    
    // Handle hidden elements
    const wasHidden = window.getComputedStyle(element).display === 'none';
    console.log(`${name} was hidden:`, wasHidden);
    
    if (wasHidden) {
      element.style.display = 'flex';
      element.style.visibility = 'hidden';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
    }
    
    element.style.height = 'auto';
    element.style.minHeight = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    
    element.offsetHeight;
    const naturalHeight = element.scrollHeight;
    
    Object.keys(originalStyles).forEach(prop => {
      if (originalStyles[prop]) {
        element.style[prop] = originalStyles[prop];
      } else {
        element.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    });
    
    console.log(`${name} natural height:`, naturalHeight);
    return naturalHeight;
  }
  
  const heights = [];
  if (level2) heights.push(testGetContentHeight(level2, 'Level 2'));
  level3s.forEach((l3, i) => heights.push(testGetContentHeight(l3, `Level 3-${i}`)));
  level4s.forEach((l4, i) => heights.push(testGetContentHeight(l4, `Level 4-${i}`)));
  
  console.log('All heights:', heights);
  const validHeights = heights.filter(h => h > 0);
  console.log('Valid heights (excluding 0):', validHeights);
  
  // Mirror the actual calculation logic
  const maxContentHeight = Math.max(...validHeights, 300);
  const navbar = document.querySelector('.header');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const labelWrapper = megaMenu.querySelector('.label-wrapper');
  const labelWrapperHeight = labelWrapper ? labelWrapper.offsetHeight : 0;
  const maxAllowed = window.innerHeight - navbarHeight - labelWrapperHeight - 60;
  const finalHeight = Math.min(maxContentHeight, maxAllowed);
  const needsScroll = maxContentHeight > maxAllowed;
  
  console.log('Max content height:', maxContentHeight);
  console.log('Max allowed height:', maxAllowed);
  console.log('Final height should be:', finalHeight);
  console.log('Should have scroll:', needsScroll);
  console.log('=== END DEBUG ===');
};

// Test function to debug level 3 menu hover - you can run this in browser console
window.debugLevel3Hover = function() {
  const megaMenu = document.querySelector('.mega-menu-wrapper.show');
  if (!megaMenu) {
    console.log('No open mega menu found. Please open a mega menu first.');
    return;
  }
  
  const level2Items = megaMenu.querySelectorAll('.level-2-menu-container > li.has-level-3-children');
  console.log('=== LEVEL 3 HOVER DEBUG ===');
  console.log('Found level 2 items with level 3 children:', level2Items.length);
  
  level2Items.forEach((l2, i) => {
    const l3Menu = l2.querySelector('.level-3-menu');
    console.log(`Level 2 item ${i}:`, l2);
    console.log(`- Has level 3 menu:`, !!l3Menu);
    if (l3Menu) {
      console.log(`- Level 3 menu display:`, window.getComputedStyle(l3Menu).display);
      console.log(`- Level 3 menu element:`, l3Menu);
      
      // Test manual hover
      console.log('Testing manual hover...');
      l2.classList.add('active');
      setTimeout(() => {
        console.log(`- Level 3 menu display after adding active:`, window.getComputedStyle(l3Menu).display);
        l2.classList.remove('active');
      }, 1000);
    }
  });
  console.log('=== END DEBUG ===');
};

// Test function to debug level 4 menu hover - you can run this in browser console
window.debugLevel4Hover = function() {
  const megaMenu = document.querySelector('.mega-menu-wrapper.show');
  if (!megaMenu) {
    console.log('No open mega menu found. Please open a mega menu first.');
    return;
  }
  
  const level3Items = megaMenu.querySelectorAll('.level-3-menu-container > li.has-level-4-children');
  console.log('=== LEVEL 4 HOVER DEBUG ===');
  console.log('Found level 3 items with level 4 children:', level3Items.length);
  
  level3Items.forEach((l3, i) => {
    const l4Menu = l3.querySelector('.level-4-menu');
    console.log(`Level 3 item ${i}:`, l3);
    console.log(`- Has level 4 menu:`, !!l4Menu);
    if (l4Menu) {
      console.log(`- Level 4 menu display:`, window.getComputedStyle(l4Menu).display);
      console.log(`- Level 4 menu element:`, l4Menu);
      
      // Check positioning
      const l3Rect = l3.getBoundingClientRect();
      const l4Rect = l4Menu.getBoundingClientRect();
      console.log(`- Level 3 position:`, {left: l3Rect.left, top: l3Rect.top, width: l3Rect.width});
      console.log(`- Level 4 position:`, {left: l4Rect.left, top: l4Rect.top, width: l4Rect.width});
      
      // Test manual hover
      console.log('Testing manual hover...');
      l3.classList.add('active');
      setTimeout(() => {
        console.log(`- Level 4 menu display after adding active:`, window.getComputedStyle(l4Menu).display);
        const l4RectAfter = l4Menu.getBoundingClientRect();
        console.log(`- Level 4 position after active:`, {left: l4RectAfter.left, top: l4RectAfter.top, width: l4RectAfter.width});
        l3.classList.remove('active');
      }, 1000);
    }
  });
  console.log('=== END DEBUG ===');
};

// Combined debug function for all levels
window.debugAllMenuLevels = function() {
  console.log('🔍 Running comprehensive menu debug...');
  debugLevel3Hover();
  setTimeout(() => {
    debugLevel4Hover();
  }, 1500);
};

// Search Overlay Functionality
const setupSearchOverlay = () => {
  const searchOverlay = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.querySelector('.search-form');
  const closeBtn = document.getElementById('searchCloseBtn');
  const suggestionItems = document.querySelectorAll('.search-suggestion-item');
  
  if (!searchOverlay) {
    console.warn('Search overlay not found');
    return;
  }
  
  // Open search overlay
  const openSearch = () => {
    searchOverlay.classList.add('show');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-open');
    
    // Focus on input after animation completes
    setTimeout(() => {
      searchInput?.focus();
    }, 200);
    
    // Update search button ARIA state
    const searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) {
      searchBtn.setAttribute('aria-expanded', 'true');
    }
  };
  
  // Close search overlay
  const closeSearch = () => {
    searchOverlay.classList.remove('show');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-open');
    
    // Clear search input
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Update search button ARIA state
    const searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) {
      searchBtn.setAttribute('aria-expanded', 'false');
      searchBtn.focus(); // Return focus to search button
    }
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim();
    
    if (query) {
      console.log('Searching for:', query);
      // TODO: Implement actual search functionality
      // Example: window.location.href = `/search?q=${encodeURIComponent(query)}`;
      
      // For now, just show an alert
      alert(`Searching for: "${query}"`);
      closeSearch();
    }
  };
  
  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.getAttribute('data-search');
    if (searchInput && searchTerm) {
      searchInput.value = searchTerm;
      handleSearchSubmit(new Event('submit'));
    }
  };
  
  // Keyboard navigation for suggestions
  const handleSuggestionKeydown = (e, suggestion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };
  
  // Handle escape key to close overlay
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
      e.preventDefault();
      closeSearch();
    }
  };
  
  // Handle click outside to close overlay
  const handleOutsideClick = (e) => {
    if (searchOverlay.classList.contains('show') && e.target === searchOverlay) {
      closeSearch();
    }
  };
  
  // Event listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }
  
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchSubmit);
  }
  
  if (suggestionItems) {
    suggestionItems.forEach(suggestion => {
      suggestion.addEventListener('click', () => handleSuggestionClick(suggestion));
      suggestion.addEventListener('keydown', (e) => handleSuggestionKeydown(e, suggestion));
    });
  }
  
  // Global event listeners
  document.addEventListener('keydown', handleEscapeKey);
  searchOverlay.addEventListener('click', handleOutsideClick);
  
  // Open the search overlay
  openSearch();
};

// Enhanced keyboard navigation for search suggestions
const setupSearchKeyboardNavigation = () => {
  const searchInput = document.getElementById('searchInput');
  const suggestions = document.querySelectorAll('.search-suggestion-item');
  
  if (!searchInput || !suggestions.length) return;
  
  let currentIndex = -1;
  
  const updateFocus = (index) => {
    // Remove focus from all suggestions
    suggestions.forEach(s => s.classList.remove('keyboard-focused'));
    
    if (index >= 0 && index < suggestions.length) {
      suggestions[index].classList.add('keyboard-focused');
      suggestions[index].focus();
    } else {
      searchInput.focus();
    }
    currentIndex = index;
  };
  
  searchInput.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        updateFocus(currentIndex + 1 >= suggestions.length ? 0 : currentIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        updateFocus(currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1);
        break;
      case 'Tab':
        if (currentIndex >= 0) {
          e.preventDefault();
          updateFocus(e.shiftKey ? currentIndex - 1 : currentIndex + 1);
        }
        break;
    }
  });
  
  suggestions.forEach((suggestion, index) => {
    suggestion.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          updateFocus(index + 1 >= suggestions.length ? 0 : index + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateFocus(index <= 0 ? suggestions.length - 1 : index - 1);
          break;
      }
    });
  });
};

// Initialize search overlay when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupSearchKeyboardNavigation();
});
