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
    const searchContent = document.querySelector('.search-content');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchContent) {
      // Toggle search overlay
      searchToggle.addEventListener('click', () => {
        searchContent.classList.toggle('is-visible');
        if (searchContent.classList.contains('is-visible')) {
          document.body.style.overflow = 'hidden';
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
          }
        } else {
          document.body.style.overflow = '';
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContent.classList.contains('is-visible')) {
          searchContent.classList.remove('is-visible');
          document.body.style.overflow = '';
        }
      });

      // Close on click outside search form
      searchContent.addEventListener('click', (e) => {
        if (e.target === searchContent) {
          searchContent.classList.remove('is-visible');
          document.body.style.overflow = '';
        }
      });
    }
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
