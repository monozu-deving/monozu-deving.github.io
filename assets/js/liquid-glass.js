/**
 * Premium Glass Spotlight & Mobile Menu Interaction
 */
(function () {
  function bindSpotlight() {
    const btns = document.querySelectorAll('.masthead__menu-item a, .search__toggle, .mobile-menu__toggle');

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

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    bindSpotlight();
    bindMobileMenu();
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
