// AAA Accessibility: Screen reader announcements
const announceMenuChange = (message) => {
  const liveRegion = document.getElementById('menu-announcements');
  if (liveRegion) {
    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
};

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
    const isMenuOpen = document.body.classList.contains("menu-open");
    
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };
  
  const openMobileMenu = () => {
    document.body.classList.add("menu-open");
    
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "true");
      mobileToggle.setAttribute("aria-label", "Close main navigation menu");
    }
    
    if (navbarCollapse) {
      navbarCollapse.classList.add("show");
      navbarCollapse.setAttribute("aria-hidden", "false");
      
      setupMobileNavigationOrder();
      enforceLevel4TabOrder();
      
      setTimeout(() => {
        const firstMainMenuItem = navbarCollapse.querySelector('.header__menu-link[role="menuitem"]');
        
        if (firstMainMenuItem) {
          firstMainMenuItem.setAttribute('tabindex', '0');
          firstMainMenuItem.focus();
          announceMenuChange("Navigation menu opened. Use arrow keys to navigate between sections, Enter to expand");
        }
        
        enforceLevel4TabOrder();
      }, 350);
    }
    
    document.body.style.overflow = 'hidden';
  };
  
  const closeMobileMenu = () => {
    if (navbarCollapse) {
      navbarCollapse.classList.remove("show");
      navbarCollapse.setAttribute("aria-hidden", "true");
    }
    
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-label", "Open main navigation menu");
    }
    
    cleanupMobileKeyboardListeners();
    
    setTimeout(() => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = '';
      
      if (mobileToggle) {
        mobileToggle.focus();
      }
      
      const activeMegaMenus = header.querySelectorAll('.nav-item.dropdown.has-mega-menu.active');
      activeMegaMenus.forEach(item => {
        item.classList.remove('active');
        const trigger = item.querySelector('.dropdown-toggle');
        const megaMenu = item.querySelector('.mega-menu-wrapper');
        
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
      });
      
      const allLevel3Containers = header.querySelectorAll('.has-level-3-children.active');
      const allLevel4Containers = header.querySelectorAll('.has-level-4-children.active');
      
      [...allLevel3Containers, ...allLevel4Containers].forEach(container => {
        container.classList.remove('active');
        const trigger = container.querySelector('a');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        
        const menu = container.querySelector('.level-3-menu, .level-4-menu');
        if (menu) menu.setAttribute('aria-hidden', 'true');
      });
      
      const allMegaMenuItems = header.querySelectorAll('.mega-menu-wrapper a');
      allMegaMenuItems.forEach(item => item.setAttribute('tabindex', '-1'));
      
      enforceLevel4TabOrder();
    }, 300);
    
    announceMenuChange("Main navigation menu closed");
  };

  const setupMobileNavigationOrder = () => {
    if (!navbarCollapse) return;
    
    const allMegaMenus = navbarCollapse.querySelectorAll('.mega-menu-wrapper');
    allMegaMenus.forEach(megaMenu => {
      megaMenu.setAttribute('aria-hidden', 'true');
      
      const level2Items = megaMenu.querySelectorAll('.level-2-menu-container > li > a');
      const level3Items = megaMenu.querySelectorAll('.level-3-menu-container > li > a');
      const level4Items = megaMenu.querySelectorAll('.level-4-menu-container > li > a');
      
      level2Items.forEach(item => {
        item.setAttribute('tabindex', '-1');
        item.setAttribute('role', 'menuitem');
      });
      
      [...level3Items, ...level4Items].forEach(item => {
        item.setAttribute('tabindex', '-1');
        item.setAttribute('role', 'menuitem');
      });
      
      const level3Menus = megaMenu.querySelectorAll('.level-3-menu');
      const level4Menus = megaMenu.querySelectorAll('.level-4-menu');
      
      [...level3Menus, ...level4Menus].forEach(menu => {
        menu.setAttribute('aria-hidden', 'true');
      });
      
      const level3Containers = megaMenu.querySelectorAll('.has-level-3-children');
      const level4Containers = megaMenu.querySelectorAll('.has-level-4-children');
      
      [...level3Containers, ...level4Containers].forEach(container => {
        container.classList.remove('active');
        const trigger = container.querySelector('a');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
    
    setTimeout(() => {
      enforceLevel4TabOrder();
    }, 100);
    
    setupMobileKeyboardNavigation();
  };
  
  const enforceLevel4TabOrder = () => {
    const isMobile = () => window.innerWidth < 992;
    if (!isMobile()) return;
    
    const level4Containers = document.querySelectorAll('.has-level-4-children');
    
    level4Containers.forEach(container => {
      const isActive = container.classList.contains('active');
      const level4Menu = container.querySelector('.level-4-menu');
      const trigger = container.querySelector('a');
      
      if (level4Menu) {
        if (!isActive) {
          level4Menu.setAttribute('aria-hidden', 'true');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          
          const level4Items = level4Menu.querySelectorAll('li > a');
          level4Items.forEach(item => {
            item.setAttribute('tabindex', '-1');
          });
        }
      }
    });
  };

  let mobileKeyboardListeners = [];
  
  const setupMobileKeyboardNavigation = () => {
    const isMobile = () => window.innerWidth < 992;
    
    cleanupMobileKeyboardListeners();
    
    const mainMenuItems = navbarCollapse.querySelectorAll('.header__menu-link[role="menuitem"]');
    
    mainMenuItems.forEach((menuItem, index) => {
      const keydownHandler = (e) => {
        if (!isMobile() || !document.body.classList.contains('menu-open')) return;
        
        if (menuItem.getAttribute('tabindex') === '-1') return;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            e.stopPropagation();
            const nextMainItem = mainMenuItems[index + 1] || mainMenuItems[0];
            nextMainItem.focus();
            announceMenuChange(`${nextMainItem.textContent.trim()} section`);
            break;
            
          case 'ArrowUp':
            e.preventDefault();
            e.stopPropagation();
            const prevMainItem = mainMenuItems[index - 1] || mainMenuItems[mainMenuItems.length - 1];
            prevMainItem.focus();
            announceMenuChange(`${prevMainItem.textContent.trim()} section`);
            break;
            
          case 'Enter':
          case ' ':
            e.preventDefault();
            e.stopPropagation();
            expandMobileMenuSection(menuItem);
            break;
            
          case 'Escape':
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
            break;
        }
      };
      
      menuItem.addEventListener('keydown', keydownHandler);
      mobileKeyboardListeners.push({ element: menuItem, handler: keydownHandler });
    });
  };
  
  const cleanupMobileKeyboardListeners = () => {
    mobileKeyboardListeners.forEach(({ element, handler }) => {
      element.removeEventListener('keydown', handler);
    });
    mobileKeyboardListeners = [];
  };

  const expandMobileMenuSection = (triggerElement) => {
    const menuItem = triggerElement.closest('.nav-item.dropdown.has-mega-menu');
    if (!menuItem) return;
    
    const megaMenuWrapper = menuItem.querySelector('.mega-menu-wrapper');
    if (!megaMenuWrapper) return;
    
    const allMegaMenus = navbarCollapse.querySelectorAll('.nav-item.dropdown.has-mega-menu');
    allMegaMenus.forEach(item => {
      if (item !== menuItem) {
        item.classList.remove('active');
        const otherWrapper = item.querySelector('.mega-menu-wrapper');
        const otherTrigger = item.querySelector('.dropdown-toggle');
        
        if (otherWrapper) otherWrapper.setAttribute('aria-hidden', 'true');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        
        const isMobile = () => window.innerWidth < 992;
        if (isMobile()) {
          const otherLevel2Items = otherWrapper?.querySelectorAll('.level-2-menu-container > li > a') || [];
          const otherLevel3Items = otherWrapper?.querySelectorAll('.level-3-menu-container > li > a') || [];
          const otherLevel4Items = otherWrapper?.querySelectorAll('.level-4-menu-container > li > a') || [];
          
          [...otherLevel2Items, ...otherLevel3Items, ...otherLevel4Items].forEach(item => {
            item.setAttribute('tabindex', '-1');
          });
        }
      }
    });
    
    const isCurrentlyExpanded = menuItem.classList.contains('active');
    const isMobile = () => window.innerWidth < 992;
    
    if (isCurrentlyExpanded) {
      menuItem.classList.remove('active');
      megaMenuWrapper.setAttribute('aria-hidden', 'true');
      triggerElement.setAttribute('aria-expanded', 'false');
      
      if (isMobile()) {
        const allMenuItems = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a, .level-3-menu-container > li > a, .level-4-menu-container > li > a');
        allMenuItems.forEach(item => item.setAttribute('tabindex', '-1'));
      }
      
      announceMenuChange(`${triggerElement.textContent.trim()} section collapsed`);
      
    } else {
      menuItem.classList.add('active');
      megaMenuWrapper.setAttribute('aria-hidden', 'false');
      triggerElement.setAttribute('aria-expanded', 'true');
      
      if (isMobile()) {
        const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
        const level3Items = megaMenuWrapper.querySelectorAll('.level-3-menu-container > li > a');
        const level4Items = megaMenuWrapper.querySelectorAll('.level-4-menu-container > li > a');
        
        level2Items.forEach(item => item.setAttribute('tabindex', '0'));
        [...level3Items, ...level4Items].forEach(item => item.setAttribute('tabindex', '-1'));
      }
      
      setupLevel2Navigation(megaMenuWrapper);
      
      setTimeout(() => {
        const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
        if (level2Items[0]) {
          level2Items[0].focus();
          announceMenuChange(`${triggerElement.textContent.trim()} section expanded. ${level2Items.length} items available. Use arrow keys to navigate.`);
        }
      }, 100);
    }
  };

  const setupLevel2Navigation = (megaMenuWrapper) => {
    const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
    
    level2Items.forEach((item, index) => {
      item.removeEventListener('keydown', handleLevel2Navigation);
      item.addEventListener('keydown', handleLevel2Navigation);
    });
    
    function handleLevel2Navigation(e) {
      const isMobile = () => window.innerWidth < 992;
      if (!isMobile() || !document.body.classList.contains('menu-open')) return;
      
      const currentIndex = Array.from(level2Items).indexOf(e.target);
      const parentLi = e.target.closest('li');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextItem = level2Items[currentIndex + 1] || level2Items[0];
          nextItem.focus();
          announceMenuChange(`${nextItem.textContent.trim()}`);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const prevItem = level2Items[currentIndex - 1] || level2Items[level2Items.length - 1];
          prevItem.focus();
          announceMenuChange(`${prevItem.textContent.trim()}`);
          break;
          
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          if (parentLi && parentLi.classList.contains('has-level-3-children')) {
            e.preventDefault();
            expandLevel3Menu(parentLi, e.target);
          }
          break;
          
        case 'ArrowLeft':
        case 'Escape':
          e.preventDefault();
          const mainTrigger = megaMenuWrapper.closest('.nav-item').querySelector('.dropdown-toggle');
          if (mainTrigger) {
            const isMobile = () => window.innerWidth < 992;
            
            const menuItem = megaMenuWrapper.closest('.nav-item.dropdown.has-mega-menu');
            if (menuItem) {
              menuItem.classList.remove('active');
              megaMenuWrapper.setAttribute('aria-hidden', 'true');
              mainTrigger.setAttribute('aria-expanded', 'false');
            }
            
            collapseAllSubmenus(megaMenuWrapper);
            
            if (isMobile()) {
              const mainMenuItems = navbarCollapse.querySelectorAll('.header__menu-link[role="menuitem"]');
              mainMenuItems.forEach(item => item.setAttribute('tabindex', '0'));
            }
            
            mainTrigger.focus();
            announceMenuChange(`Returned to main navigation`);
          }
          break;
      }
    }
  };
  
  const expandLevel3Menu = (level2Li, trigger) => {
    const level3Menu = level2Li.querySelector('.level-3-menu');
    if (!level3Menu) return;
    
    const isMobile = () => window.innerWidth < 992;
    
    const megaMenuWrapper = level2Li.closest('.mega-menu-wrapper');
    const allLevel3Items = megaMenuWrapper.querySelectorAll('.has-level-3-children');
    
    allLevel3Items.forEach(item => {
      if (item !== level2Li) {
        item.classList.remove('active');
        const otherLevel3 = item.querySelector('.level-3-menu');
        const otherLevel3Items = otherLevel3?.querySelectorAll('li > a') || [];
        if (isMobile()) {
          otherLevel3Items.forEach(link => link.setAttribute('tabindex', '-1'));
        }
      }
    });
    
    const isExpanded = level2Li.classList.contains('active');
    
    if (isExpanded) {
      level2Li.classList.remove('active');
      const level3Items = level3Menu.querySelectorAll('li > a');
      
      if (isMobile()) {
        level3Items.forEach(item => item.setAttribute('tabindex', '-1'));
        
        const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
        level2Items.forEach(item => item.setAttribute('tabindex', '0'));
        
        const level4Items = megaMenuWrapper.querySelectorAll('.level-4-menu-container > li > a');
        level4Items.forEach(item => item.setAttribute('tabindex', '-1'));
      }
      
      trigger.setAttribute('aria-expanded', 'false');
      announceMenuChange(`${trigger.textContent.trim()} collapsed`);
      
    } else {
      level2Li.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      
      if (isMobile()) {
        const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
        const level3Items = level3Menu.querySelectorAll('li > a');
        const level4Items = megaMenuWrapper.querySelectorAll('.level-4-menu-container > li > a');
        
        [...level2Items, ...level4Items].forEach(item => item.setAttribute('tabindex', '-1'));
        level3Items.forEach(item => item.setAttribute('tabindex', '0'));
      }
      
      setupLevel3Navigation(level3Menu);
      
      setTimeout(() => {
        const level3Items = level3Menu.querySelectorAll('li > a');
        if (level3Items[0]) {
          level3Items[0].focus();
          announceMenuChange(`${trigger.textContent.trim()} expanded. ${level3Items.length} items available.`);
        }
      }, 100);
    }
  };
  
  const setupLevel3Navigation = (level3Menu) => {
    const level3Items = level3Menu.querySelectorAll('li > a');
    
    level3Items.forEach((item, index) => {
      item.removeEventListener('keydown', handleLevel3Navigation);
      item.addEventListener('keydown', handleLevel3Navigation);
    });
    
    function handleLevel3Navigation(e) {
      const isMobile = () => window.innerWidth < 992;
      if (!isMobile() || !document.body.classList.contains('menu-open')) return;
      
      const currentIndex = Array.from(level3Items).indexOf(e.target);
      const parentLi = e.target.closest('li');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextItem = level3Items[currentIndex + 1] || level3Items[0];
          nextItem.focus();
          announceMenuChange(`${nextItem.textContent.trim()}`);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const prevItem = level3Items[currentIndex - 1] || level3Items[level3Items.length - 1];
          prevItem.focus();
          announceMenuChange(`${prevItem.textContent.trim()}`);
          break;
          
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          if (parentLi && parentLi.classList.contains('has-level-4-children')) {
            e.preventDefault();
            expandLevel4Menu(parentLi, e.target);
          }
          break;
          
        case 'ArrowLeft':
        case 'Escape':
          e.preventDefault();
          const level2Trigger = level3Menu.closest('.has-level-3-children').querySelector('a');
          if (level2Trigger) {
            const isMobile = () => window.innerWidth < 992;
            
            const level2Li = level2Trigger.closest('li');
            if (level2Li) {
              level2Li.classList.remove('active');
              level2Trigger.setAttribute('aria-expanded', 'false');
              
              if (isMobile()) {
                const level3Items = level3Menu.querySelectorAll('li > a');
                level3Items.forEach(item => item.setAttribute('tabindex', '-1'));
                
                const megaMenuWrapper = level3Menu.closest('.mega-menu-wrapper');
                if (megaMenuWrapper) {
                  const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
                  level2Items.forEach(item => item.setAttribute('tabindex', '0'));
                }
              }
            }
            
            level2Trigger.focus();
            announceMenuChange(`Returned to level 2`);
          }
          break;
      }
    }
  };
  
  const setupLevel4Navigation = (level4Menu) => {
    const level4Items = level4Menu.querySelectorAll('li > a');
    
    level4Items.forEach((item, index) => {
      item.removeEventListener('keydown', handleLevel4Navigation);
      item.addEventListener('keydown', handleLevel4Navigation);
    });
    
    function handleLevel4Navigation(e) {
      const isMobile = () => window.innerWidth < 992;
      if (!isMobile() || !document.body.classList.contains('menu-open')) return;
      
      const currentIndex = Array.from(level4Items).indexOf(e.target);
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextItem = level4Items[currentIndex + 1] || level4Items[0];
          nextItem.focus();
          announceMenuChange(`${nextItem.textContent.trim()}`);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const prevItem = level4Items[currentIndex - 1] || level4Items[level4Items.length - 1];
          prevItem.focus();
          announceMenuChange(`${prevItem.textContent.trim()}`);
          break;
          
        case 'ArrowLeft':
        case 'Escape':
          e.preventDefault();
          const level3Trigger = level4Menu.closest('.has-level-4-children').querySelector('a');
          if (level3Trigger) {
            const isMobile = () => window.innerWidth < 992;
            
            const level3Li = level3Trigger.closest('li');
            if (level3Li) {
              level3Li.classList.remove('active');
              level3Trigger.setAttribute('aria-expanded', 'false');
              
              if (isMobile()) {
                const level4Items = level4Menu.querySelectorAll('li > a');
                level4Items.forEach(item => item.setAttribute('tabindex', '-1'));
                
                const level3Menu = level4Menu.closest('.level-3-menu');
                if (level3Menu) {
                  const level3Items = level3Menu.querySelectorAll('li > a');
                  level3Items.forEach(item => item.setAttribute('tabindex', '0'));
                }
              }
            }
            
            level3Trigger.focus();
            announceMenuChange(`Returned to level 3`);
          }
          break;
          
        case 'Home':
          e.preventDefault();
          const firstL4Item = level4Items[0];
          if (firstL4Item) firstL4Item.focus();
          break;
          
        case 'End':
          e.preventDefault();
          const lastL4Item = level4Items[level4Items.length - 1];
          if (lastL4Item) lastL4Item.focus();
          break;
      }
    }
  };
  
  const expandLevel4Menu = (level3Li, trigger) => {
    const level4Menu = level3Li.querySelector('.level-4-menu');
    if (!level4Menu) return;
    
    const isMobile = () => window.innerWidth < 992;
    
    const isExpanded = level3Li.classList.contains('active');
    
    if (isExpanded) {
      level3Li.classList.remove('active');
      const level4Items = level4Menu.querySelectorAll('li > a');
      
      if (isMobile()) {
        level4Items.forEach(item => item.setAttribute('tabindex', '-1'));
        
        const level3Menu = level3Li.closest('.level-3-menu');
        if (level3Menu) {
          const level3Items = level3Menu.querySelectorAll('li > a');
          level3Items.forEach(item => item.setAttribute('tabindex', '0'));
        }
        
        const megaMenuWrapper = level4Menu.closest('.mega-menu-wrapper');
        if (megaMenuWrapper) {
          const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
          level2Items.forEach(item => item.setAttribute('tabindex', '-1'));
        }
      }
      
      trigger.setAttribute('aria-expanded', 'false');
      announceMenuChange(`${trigger.textContent.trim()} collapsed`);
      
    } else {
      level3Li.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      
      const level4Items = level4Menu.querySelectorAll('li > a');
      
      if (isMobile()) {
        const level3Menu = level3Li.closest('.level-3-menu');
        const megaMenuWrapper = level4Menu.closest('.mega-menu-wrapper');
        
        if (level3Menu) {
          const level3Items = level3Menu.querySelectorAll('li > a');
          level3Items.forEach(item => item.setAttribute('tabindex', '-1'));
        }
        
        if (megaMenuWrapper) {
          const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
          level2Items.forEach(item => item.setAttribute('tabindex', '-1'));
        }
        
        level4Items.forEach(item => item.setAttribute('tabindex', '0'));
        
        setupLevel4Navigation(level4Menu);
      }
      
      setTimeout(() => {
        if (level4Items[0]) {
          level4Items[0].focus();
          announceMenuChange(`${trigger.textContent.trim()} expanded. ${level4Items.length} items available.`);
        }
      }, 100);
    }
  };
  
  const collapseAllSubmenus = (megaMenuWrapper) => {
    const isMobile = () => window.innerWidth < 992;
    
    const allExpandedItems = megaMenuWrapper.querySelectorAll('.active');
    allExpandedItems.forEach(item => {
      item.classList.remove('active');
      const trigger = item.querySelector('a');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    
    if (isMobile()) {
      const allSubItems = megaMenuWrapper.querySelectorAll('.level-3-menu a, .level-4-menu a');
      allSubItems.forEach(item => item.setAttribute('tabindex', '-1'));
      
      const level2Items = megaMenuWrapper.querySelectorAll('.level-2-menu-container > li > a');
      level2Items.forEach(item => item.setAttribute('tabindex', '0'));
    }
  };

  const handleOutsideClick = (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !header.contains(e.target)
    ) {
      closeMobileMenu();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      if (document.body.classList.contains("menu-open")) {
        e.preventDefault();
        closeMobileMenu();
      }
    }
  };

  const setupDropdownKeyboardNavigation = () => {
    const dropdowns = header.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".dropdown-toggle");
      const menu = dropdown.querySelector(".dropdown-menu");
      const menuIcon = trigger?.querySelector(".header__menu-icon");

      if (trigger && menu) {
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
    if (mobileToggle && navbarCollapse) {
      const updateAriaExpanded = () => {
        const isExpanded = document.body.classList.contains("menu-open");
        mobileToggle.setAttribute("aria-expanded", isExpanded);
      };

      const observer = new MutationObserver(() => {
        updateAriaExpanded();
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

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

  const setupMobileMegaMenu = () => {
    const isMobile = () => window.innerWidth < 992;

    const dropdownNavItems = header.querySelectorAll('.nav-item.dropdown.has-mega-menu');
    
    dropdownNavItems.forEach(item => {
      const trigger = item.querySelector('.dropdown-toggle');
      const megaMenuWrapper = item.querySelector('.mega-menu-wrapper');
      
      if (trigger && megaMenuWrapper) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', megaMenuWrapper.id || `mega-menu-${Math.random().toString(36).substr(2, 9)}`);
        megaMenuWrapper.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          
          if (!isMobile()) return;
          
          expandMobileMenuSection(trigger);
        });
      }
    });

    const level3Items = header.querySelectorAll('.has-level-3-children');
    
    level3Items.forEach(item => {
      const trigger = item.querySelector('a');
      const level3Menu = item.querySelector('.level-3-menu');
      
      if (trigger && level3Menu) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', level3Menu.id || `level3-menu-${Math.random().toString(36).substr(2, 9)}`);
        level3Menu.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          if (!isMobile()) return;
          
          e.preventDefault();
          expandLevel3Menu(item, trigger);
        });
      }
    });

    const level4Items = header.querySelectorAll('.has-level-4-children');
    
    level4Items.forEach(item => {
      const trigger = item.querySelector('a');
      const level4Menu = item.querySelector('.level-4-menu');
      
      if (trigger && level4Menu) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', level4Menu.id || `level4-menu-${Math.random().toString(36).substr(2, 9)}`);
        level4Menu.setAttribute('aria-hidden', 'true');
        
        trigger.addEventListener('click', (e) => {
          if (!isMobile()) return;
          
          e.preventDefault();
          expandLevel4Menu(item, trigger);
        });
      }
    });
    
    const handleResize = () => {
      if (!isMobile()) {
        dropdownNavItems.forEach(item => {
          const trigger = item.querySelector('.dropdown-toggle');
          const megaMenu = item.querySelector('.mega-menu-wrapper');
          
          if (megaMenu && megaMenu.contains(document.activeElement) && trigger) {
            trigger.focus();
          }
          
          item.classList.remove('active');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
        });
        
        const allMenuItems = header.querySelectorAll('.mega-menu-wrapper a');
        allMenuItems.forEach(item => item.setAttribute('tabindex', '0'));
        
        cleanupMobileKeyboardListeners();
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
    if (!isDesktop()) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const headers = document.querySelectorAll(".header");

    if (scrollTop === 0) {
      headers.forEach((el) => el.classList.remove("upwards", "downwards"));
    } else if (scrollTop > lastScrollTop) {
      headers.forEach((el) => {
        el.classList.add("downwards");
        el.classList.remove("upwards");
      });
    } else if (scrollTop < lastScrollTop) {
      headers.forEach((el) => {
        el.classList.add("upwards");
        el.classList.remove("downwards");
      });
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  const resetHeaderScrollClasses = () => {
    const headers = document.querySelectorAll(".header");
    headers.forEach((el) => el.classList.remove("upwards", "downwards"));
  };

  const handleScrollResize = () => {
    if (!isDesktop()) {
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
  
  const closeAllMegaMenus = (exceptMenu) => {
    menuItems.forEach(item => {
      const megaMenu = item.querySelector('.mega-menu-wrapper');
      const trigger = item.querySelector('.dropdown-toggle');
      
      if (megaMenu && megaMenu !== exceptMenu) {
        const focusedElement = document.activeElement;
        const isFocusInside = megaMenu.contains(focusedElement);
        
        if (isFocusInside && trigger) {
          trigger.focus();
        }
        
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
        megaMenu.setAttribute('aria-hidden', 'true');
        
        megaMenu.classList.remove('show');
        megaMenu.classList.remove('mega-menu-dynamic-height');
        item.classList.remove('active');
        
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
        
        const level2s = megaMenu?.querySelectorAll('.level-2-menu-container > li');
        level2s?.forEach(l2 => l2.classList.remove('active'));
        const level3sItems = megaMenu?.querySelectorAll('.level-3-menu-container > li');
        level3sItems?.forEach(l3 => l3.classList.remove('active'));
      }
    });
  };

  function setMegaMenuColumnHeights(megaMenu) {
    function getContentHeight(element) {
      if (!element) return 0;
      
      const originalStyles = {};
      const stylesToCheck = ['height', 'minHeight', 'maxHeight', 'overflow', 'display', 'visibility', 'position', 'left', 'top'];
      
      stylesToCheck.forEach(prop => {
        originalStyles[prop] = element.style[prop] || '';
      });
      
      const wasHidden = window.getComputedStyle(element).display === 'none';
      
      if (wasHidden) {
        element.style.display = 'flex';
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
      }
      
      element.style.height = 'auto';
      element.style.minHeight = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      
      element.offsetHeight;
      
      const naturalHeight = element.scrollHeight;
      
      stylesToCheck.forEach(prop => {
        if (originalStyles[prop]) {
          element.style[prop] = originalStyles[prop];
        } else {
          element.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        }
      });
      
      return naturalHeight;
    }

    function cleanupInlineStyles(element) {
      if (!element) return;
      
      const tempStyles = ['visibility', 'position', 'left', 'top'];
      tempStyles.forEach(prop => {
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (element.style[prop] === 'hidden' || 
            element.style[prop] === 'absolute' || 
            element.style[prop] === '-9999px') {
          element.style.removeProperty(kebabProp);
        }
      });
      
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
    
    const level2 = megaMenu.querySelector('.level-2-menu');
    const level3s = Array.from(megaMenu.querySelectorAll('.level-3-menu'));
    const level4s = Array.from(megaMenu.querySelectorAll('.level-4-menu'));
    
    [level2, ...level3s, ...level4s].forEach(element => {
      if (element) {
        element.style.removeProperty('height');
        element.style.removeProperty('min-height');
        element.style.removeProperty('max-height');
        element.classList.remove('mega-menu-scroll');
        cleanupInlineStyles(element);
      }
    });

    setTimeout(() => {
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

      const validHeights = heights.filter(h => h > 0);
      const maxContentHeight = Math.max(...validHeights, 300);
      
      const navbar = document.querySelector('.header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const labelWrapper = megaMenu.querySelector('.label-wrapper');
      const labelWrapperHeight = labelWrapper ? labelWrapper.offsetHeight : 0;
      const maxAllowed = window.innerHeight - navbarHeight - labelWrapperHeight - 60;
      
      const finalHeight = Math.min(maxContentHeight, maxAllowed);
      const needsScroll = maxContentHeight > maxAllowed;
      
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

      if (needsScroll) {
        [level2, ...level3s, ...level4s].forEach(element => {
          if (element) {
            element.classList.add('mega-menu-scroll');
          }
        });
      }
      
      [level2, ...level3s, ...level4s].forEach(element => {
        cleanupInlineStyles(element);
      });
    }, 10);
  }

  menuItems.forEach(item => {
    const trigger = item.querySelector('.dropdown-toggle');
    const megaMenu = item.querySelector('.mega-menu-wrapper');
    if (!trigger || !megaMenu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', megaMenu.id || '');

    megaMenu.setAttribute('aria-hidden', 'true');

    let heightSet = false;
    item.addEventListener('mouseenter', () => {
      if (!isMobile() && !megaMenu.classList.contains('show')) {
        closeAllMegaMenus(megaMenu);
        setMegaMenuColumnHeights(megaMenu);
        megaMenu.classList.add('show');
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        megaMenu.setAttribute('aria-hidden', 'false');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!isMobile()) {
        setTimeout(() => {
          if (!item.matches(':hover') && !megaMenu.matches(':hover')) {
            const focusedElement = document.activeElement;
            const isFocusInside = megaMenu.contains(focusedElement);
            
            if (isFocusInside) {
              return;
            }
            
            megaMenu.classList.remove('show');
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            megaMenu.setAttribute('aria-hidden', 'true');
            
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
            
            const level2s = megaMenu.querySelectorAll('.level-2-menu-container > li');
            level2s.forEach(l2 => l2.classList.remove('active'));
            const level3sItems = megaMenu.querySelectorAll('.level-3-menu-container > li');
            level3sItems.forEach(l3 => l3.classList.remove('active'));
          }
        }, 100);
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (!isMobile()) {
        switch(e.key) {
          case 'ArrowDown':
          case 'Enter':
          case ' ':
        e.preventDefault();
        closeAllMegaMenus();
            setMegaMenuColumnHeights(megaMenu);
          megaMenu.classList.add('show');
          item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
            megaMenu.setAttribute('aria-hidden', 'false');
            
        const firstL2 = megaMenu.querySelector('.level-2-menu-container > li > a');
            if (firstL2) {
              firstL2.focus();
              announceMenuChange(`${trigger.textContent} menu opened. Use arrow keys to navigate.`);
            }
            break;
            
          case 'Escape':
            closeAllMegaMenus();
            trigger.focus();
            announceMenuChange('Menu closed');
            break;
            
          case 'Tab':
            if (megaMenu.classList.contains('show')) {
              break;
            }
            break;
        }
      }
    });

    const level2Items = megaMenu.querySelectorAll('.level-2-menu-container > li');
    level2Items.forEach(l2 => {
      const l2Link = l2.querySelector('a');
      const l3Menu = l2.querySelector('.level-3-menu');
      if (l3Menu) {
        l2Link.setAttribute('aria-haspopup', 'true');
        l2Link.setAttribute('aria-expanded', 'false');
        l2Link.setAttribute('tabindex', '0');
        
        if (l3Menu) {
          l3Menu.setAttribute('aria-hidden', 'true');
        }
        const activateL2 = () => {
          level2Items.forEach(i => {
            i.classList.remove('active');
            const l3Menu = i.querySelector('.level-3-menu');
            if (l3Menu) {
              l3Menu.setAttribute('aria-hidden', 'true');
            }
            const l2Link = i.querySelector('a');
            if (l2Link) {
              l2Link.setAttribute('aria-expanded', 'false');
            }
          });
          const allL3 = megaMenu.querySelectorAll('.level-3-menu-container > li');
          allL3.forEach(i => i.classList.remove('active'));
          l2.classList.add('active');
          l2Link.setAttribute('aria-expanded', 'true');
          
          if (l3Menu) {
            l3Menu.setAttribute('aria-hidden', 'false');
          }
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
        l2Link.addEventListener('keydown', (e) => {
          if (!isMobile()) {
            const currentL2Index = Array.from(level2Items).indexOf(l2);
            
            switch(e.key) {
              case 'ArrowRight':
              case 'Enter':
              case ' ':
                if (l3Menu) {
            e.preventDefault();
            activateL2();
            const firstL3 = l3Menu.querySelector('.level-3-menu-container > li > a');
                  if (firstL3) {
                    firstL3.focus();
                    announceMenuChange(`${l2Link.textContent} submenu opened`);
                  }
                }
                break;
                
              case 'ArrowDown':
                e.preventDefault();
                const nextL2 = level2Items[currentL2Index + 1] || level2Items[0];
                const nextL2Link = nextL2.querySelector('a');
                if (nextL2Link) nextL2Link.focus();
                break;
                
              case 'ArrowUp':
                e.preventDefault();
                const prevL2 = level2Items[currentL2Index - 1] || level2Items[level2Items.length - 1];
                const prevL2Link = prevL2.querySelector('a');
                if (prevL2Link) prevL2Link.focus();
                break;
                
              case 'ArrowLeft':
              case 'Escape':
                e.preventDefault();
                const mainTrigger = megaMenu.closest('.has-mega-menu').querySelector('.dropdown-toggle');
                if (mainTrigger) {
                  mainTrigger.focus();
                  announceMenuChange('Returned to main menu');
                }
                break;
                
              case 'Home':
                e.preventDefault();
                const firstL2Link = level2Items[0].querySelector('a');
                if (firstL2Link) firstL2Link.focus();
                break;
                
              case 'End':
                e.preventDefault();
                const lastL2Link = level2Items[level2Items.length - 1].querySelector('a');
                if (lastL2Link) lastL2Link.focus();
                break;
                
              case 'Tab':
                break;
            }
          }
        });
      }
    });

    const level3Items = megaMenu.querySelectorAll('.level-3-menu-container > li');
    level3Items.forEach(l3 => {
      const l3Link = l3.querySelector('a');
      const l4Menu = l3.querySelector('.level-4-menu');
      if (l4Menu) {
        l3Link.setAttribute('aria-haspopup', 'true');
        l3Link.setAttribute('aria-expanded', 'false');
        l3Link.setAttribute('tabindex', '0');
        
        if (l4Menu) {
          l4Menu.setAttribute('aria-hidden', 'true');
        }
        const activateL3 = () => {
          level3Items.forEach(i => {
            i.classList.remove('active');
            const l4Menu = i.querySelector('.level-4-menu');
            if (l4Menu) {
              l4Menu.setAttribute('aria-hidden', 'true');
            }
            const l3Link = i.querySelector('a');
            if (l3Link) {
              l3Link.setAttribute('aria-expanded', 'false');
            }
          });
          l3.classList.add('active');
          l3Link.setAttribute('aria-expanded', 'true');
          
          if (l4Menu) {
            l4Menu.setAttribute('aria-hidden', 'false');
          }
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
        l3Link.addEventListener('keydown', (e) => {
          if (!isMobile()) {
            const currentL3Index = Array.from(level3Items).indexOf(l3);
            
            switch(e.key) {
              case 'ArrowRight':
              case 'Enter':
              case ' ':
                if (l4Menu) {
            e.preventDefault();
            activateL3();
            const firstL4 = l4Menu.querySelector('.level-4-menu-container > li > a');
                  if (firstL4) {
                    firstL4.focus();
                    announceMenuChange(`${l3Link.textContent} submenu opened`);
                  }
                }
                break;
                
              case 'ArrowDown':
                e.preventDefault();
                const nextL3 = level3Items[currentL3Index + 1] || level3Items[0];
                const nextL3Link = nextL3.querySelector('a');
                if (nextL3Link) nextL3Link.focus();
                break;
                
              case 'ArrowUp':
                e.preventDefault();
                const prevL3 = level3Items[currentL3Index - 1] || level3Items[level3Items.length - 1];
                const prevL3Link = prevL3.querySelector('a');
                if (prevL3Link) prevL3Link.focus();
                break;
                
              case 'ArrowLeft':
              case 'Escape':
                e.preventDefault();
                const parentL2 = l3.closest('.level-2-menu').querySelector('.level-2-menu-container .active > a');
                if (parentL2) {
                  parentL2.focus();
                  announceMenuChange('Returned to previous menu level');
                }
                break;
                
              case 'Home':
                e.preventDefault();
                const firstL3Link = level3Items[0].querySelector('a');
                if (firstL3Link) firstL3Link.focus();
                break;
                
              case 'End':
                e.preventDefault();
                const lastL3Link = level3Items[level3Items.length - 1].querySelector('a');
                if (lastL3Link) lastL3Link.focus();
                break;
                
              case 'Tab':
                break;
            }
          }
        });
      }
    });
  });

  document.addEventListener('mouseenter', (e) => {
    const target = getClosestElement(e.target, '.has-level-3-children') || 
                   getClosestElement(e.target, '.has-level-4-children');
    if (target) {
      const megaMenuWrapper = getClosestElement(e.target, '.mega-menu-wrapper');
      if (megaMenuWrapper) {
        setTimeout(() => {
          megaMenuWrapper.classList.add('show');
        }, 50);
      }
    }
  }, true);

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
      announceMenuChange('All menus closed');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const focusedElement = document.activeElement;
      const currentMegaMenu = getClosestElement(focusedElement, '.mega-menu-wrapper');
      
      if (currentMegaMenu) {
        const parentMenuItem = currentMegaMenu.closest('.has-mega-menu');
        const trigger = parentMenuItem?.querySelector('.dropdown-toggle');
        
        if (trigger) {
          trigger.focus();
          announceMenuChange('Menu closed, focus returned to trigger');
        }
      }
      
      closeAllMegaMenus();
    }
  });

  window.addEventListener('resize', () => {
    if (isMobile()) {
    closeAllMegaMenus();
    }
  });
};

// Initialize mega menu
document.addEventListener("DOMContentLoaded", () => {
  setupMegaMenu();
  
  setTimeout(() => {
    const allMegaMenus = document.querySelectorAll('.mega-menu-wrapper');
    allMegaMenus.forEach(menu => {
      if (!menu.classList.contains('show')) {
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }, 50);
});

const validateMegaMenuAccessibility = () => {
  const menuItems = document.querySelectorAll('.has-mega-menu');
  const issues = [];
  
  menuItems.forEach((item, index) => {
    const trigger = item.querySelector('.dropdown-toggle');
    const megaMenu = item.querySelector('.mega-menu-wrapper');
    
    if (!trigger?.hasAttribute('aria-expanded')) {
      issues.push(`Menu ${index + 1}: Missing aria-expanded on trigger`);
    }
    
    if (!trigger?.hasAttribute('aria-controls')) {
      issues.push(`Menu ${index + 1}: Missing aria-controls on trigger`);
    }
    
    if (!megaMenu?.hasAttribute('aria-hidden')) {
      issues.push(`Menu ${index + 1}: Missing aria-hidden on mega menu`);
    }
    
    const megaMenuId = megaMenu?.id;
    if (megaMenuId) {
      const duplicates = document.querySelectorAll(`#${megaMenuId}`);
      if (duplicates.length > 1) {
        issues.push(`Menu ${index + 1}: Duplicate ID "${megaMenuId}"`);
      }
    }
  });
  
  return issues.length === 0;
};

const validateMobileMenu = () => {
  const issues = [];
  
  const toggle = document.querySelector('.header__toggle');
  if (toggle) {
    if (!toggle.hasAttribute('aria-label')) {
      issues.push('Mobile toggle button missing aria-label');
    }
    if (!toggle.hasAttribute('aria-expanded')) {
      issues.push('Mobile toggle button missing aria-expanded');
    }
  }
  
  const navbarCollapse = document.querySelector('#headerNavigation');
  if (navbarCollapse) {
    if (!navbarCollapse.classList.contains('navbar-collapse')) {
      issues.push('Mobile navigation missing navbar-collapse class');
    }
  }
  
  return issues.length === 0;
};

document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
    validateMegaMenuAccessibility();
    validateMobileMenu();
  }, 100);
});

const setupSearchOverlay = () => {
  const searchOverlay = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.querySelector('.search-form');
  const closeBtn = document.getElementById('searchCloseBtn');
  const suggestionItems = document.querySelectorAll('.search-suggestion-item');
  
  if (!searchOverlay) {
    return;
  }
  
  const openSearch = () => {
    searchOverlay.classList.add('show');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-open');
    
    setTimeout(() => {
      searchInput?.focus();
    }, 200);
    
    const searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) {
      searchBtn.setAttribute('aria-expanded', 'true');
    }
  };
  
  const closeSearch = () => {
    searchOverlay.classList.remove('show');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-open');
    
    if (searchInput) {
      searchInput.value = '';
    }
    
    const searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) {
      searchBtn.setAttribute('aria-expanded', 'false');
      searchBtn.focus();
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim();
    
    if (query) {
      closeSearch();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    const searchTerm = suggestion.getAttribute('data-search');
    if (searchInput && searchTerm) {
      searchInput.value = searchTerm;
      handleSearchSubmit(new Event('submit'));
    }
  };
  
  const handleSuggestionKeydown = (e, suggestion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };
  
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
      e.preventDefault();
      closeSearch();
    }
  };
  
  const handleOutsideClick = (e) => {
    if (searchOverlay.classList.contains('show') && e.target === searchOverlay) {
      closeSearch();
    }
  };
  
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
  
  document.addEventListener('keydown', handleEscapeKey);
  searchOverlay.addEventListener('click', handleOutsideClick);
  
  openSearch();
};

const setupSearchKeyboardNavigation = () => {
  const searchInput = document.getElementById('searchInput');
  const suggestions = document.querySelectorAll('.search-suggestion-item');
  
  if (!searchInput || !suggestions.length) return;
  
  let currentIndex = -1;
  
  const updateFocus = (index) => {
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

document.addEventListener('DOMContentLoaded', () => {
  setupSearchKeyboardNavigation();
});
