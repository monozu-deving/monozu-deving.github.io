/**
 * Premium Glass Spotlight & Mobile Menu Interaction
 */
(function () {
  function bindSpotlight() {
    const btns = document.querySelectorAll('.masthead__menu-item a, .mobile-menu__toggle');

    btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        btn.style.setProperty('--rx', `${x}%`);
        btn.style.setProperty('--ry', `${y}%`);
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.setProperty('--rs', '1');
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--rs', '0');
      });
    });
  }

  function bindMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.mobile-menu__toggle');
    const close = document.querySelector('.menu-close__btn');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (close && menu) {
      close.addEventListener('click', () => {
        menu.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    const links = menu ? menu.querySelectorAll('a') : [];
    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  function bindSearch() {
    const searchToggle = document.querySelector('.search__toggle');
    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const spotlightInput = document.querySelector('.spotlight-input');

    if (searchToggle && spotlightOverlay) {
      // Toggle search overlay
      searchToggle.addEventListener('click', () => {
        spotlightOverlay.classList.toggle('is--visible');
        if (spotlightOverlay.classList.contains('is--visible')) {
          document.body.style.overflow = 'hidden';
          if (spotlightInput) {
            setTimeout(() => spotlightInput.focus(), 100);
          }
        } else {
          document.body.style.overflow = '';
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && spotlightOverlay.classList.contains('is--visible')) {
          spotlightOverlay.classList.remove('is--visible');
          document.body.style.overflow = '';
          // Clear search results when closing
          const resultsDiv = document.getElementById('results');
          if (resultsDiv) resultsDiv.innerHTML = '';
          if (spotlightInput) spotlightInput.value = '';
        }
      });

      // Close on click outside spotlight container
      spotlightOverlay.addEventListener('click', (e) => {
        // Only close if clicking directly on the overlay background
        if (e.target === spotlightOverlay) {
          e.preventDefault();
          e.stopPropagation();
          spotlightOverlay.classList.remove('is--visible');
          document.body.style.overflow = '';
          // Clear search results when closing
          const resultsDiv = document.getElementById('results');
          if (resultsDiv) resultsDiv.innerHTML = '';
          if (spotlightInput) spotlightInput.value = '';
        }
      });

      // Prevent clicks inside container from closing
      const spotlightContainer = spotlightOverlay.querySelector('.spotlight-container');
      if (spotlightContainer) {
        spotlightContainer.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }

    // Keyboard shortcut: Cmd/Ctrl + K to open search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (spotlightOverlay) {
          spotlightOverlay.classList.add('is--visible');
          document.body.style.overflow = 'hidden';
          if (spotlightInput) {
            setTimeout(() => spotlightInput.focus(), 100);
          }
        }
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    bindSpotlight();
    bindMobileMenu();
    bindSearch();
  });

  // Re-bind when mutations occur
  const observer = new MutationObserver((mutations) => {
    bindSpotlight();
  });

  const nav = document.querySelector('.greedy-nav');
  if (nav) {
    observer.observe(nav, { childList: true, subtree: true });
  }
})();
