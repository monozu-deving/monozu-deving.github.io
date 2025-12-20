/**
 * Premium Glass Spotlight Interaction
 */
(function () {
  function bindSpotlight() {
    const btns = document.querySelectorAll('.masthead__menu-item a, .search__toggle, .greedy-nav__toggle');

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

  // Initialize
  document.addEventListener('DOMContentLoaded', bindSpotlight);

  // Re-bind when GreedyNav moves items
  const observer = new MutationObserver((mutations) => {
    bindSpotlight();
  });

  const nav = document.querySelector('.greedy-nav');
  if (nav) {
    observer.observe(nav, { childList: true, subtree: true });
  }
})();
