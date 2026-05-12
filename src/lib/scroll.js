/**
 * Sets up dynamic scroll-snap with height detection.
 * Clean approach: no sentinels, just proper height classes + proximity snap.
 *
 * - Sections that fit viewport → height: 100dvh (fullscreen)
 * - Sections that overflow → min-height: 100dvh (grow naturally)
 * - scroll-snap-type: y proximity — native browser snap near boundaries
 * - IntersectionObserver tracks current page for nav
 *
 * @param {HTMLElement} container - the <main> scroll container
 * @param {(page: number) => void} onPageChange - callback for current page tracking
 * @returns {() => void} cleanup function
 */
export function setupScrollSnap(container, onPageChange) {
  const pages = Array.from(container.querySelectorAll('[data-page]'));
  let observer = null;

  function classifySections() {
    const viewportH = container.clientHeight;

    pages.forEach((page) => {
      const contentH = page.scrollHeight;
      if (contentH <= viewportH) {
        // Fits viewport → full screen snap
        page.classList.remove('snap-tall');
        page.classList.add('snap-fit');
        page.style.alignItems = '';
      } else {
        // Overflows → min-height, top-aligned, natural scroll
        page.classList.remove('snap-fit');
        page.classList.add('snap-tall');
        page.style.alignItems = 'flex-start';
      }
    });

    container.style.scrollSnapType = 'y proximity';
  }

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIdx = Number(entry.target.getAttribute('data-page'));
            if (!isNaN(pageIdx)) onPageChange(pageIdx);
          }
        });
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0, root: container }
    );
    pages.forEach((page) => observer.observe(page));
  }

  // Inject global styles
  const styleId = 'scroll-snap-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      [data-page].snap-fit {
        height: 100dvh;
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }
      [data-page].snap-tall {
        min-height: 100dvh;
        scroll-snap-align: start;
        scroll-snap-stop: normal;
      }
    `;
    document.head.appendChild(style);
  }

  // Initial setup
  classifySections();
  setupObserver();

  // Resize handler with debounce
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      classifySections();
      observer.disconnect();
      setupObserver();
    }, 150);
  };
  window.addEventListener('resize', onResize);

  // Cleanup
  return () => {
    observer?.disconnect();
    window.removeEventListener('resize', onResize);
    pages.forEach(p => {
      p.classList.remove('snap-fit', 'snap-tall');
      p.style.alignItems = '';
    });
  };
}
