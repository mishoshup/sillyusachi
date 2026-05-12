import Lenis from 'lenis';
import Snap from 'lenis/snap';
import 'lenis/dist/lenis.css';

/**
 * Sets up Lenis smooth scroll with snap for mixed-height sections.
 * @param {HTMLElement} wrapper - the scroll wrapper (<main>)
 * @param {(page: number) => void} onPageChange - callback for nav tracking
 * @returns {{ cleanup: () => void, scrollToPage: (index: number) => void }}
 */
export function setupLenis(wrapper, onPageChange) {
  const sections = Array.from(wrapper.querySelectorAll('[data-page]'));

  // 1. Init Lenis
  const lenis = new Lenis({
    wrapper,
    content: wrapper,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: true,
  });

  // 2. Init Snap
  const snap = new Snap(lenis, {
    type: 'lock',
    distanceThreshold: '40%',
    debounce: 500,
    lerp: 0.08,
    duration: 0.8,
  });

  // 3. Add sections with dual snap points
  sections.forEach((section) => {
    snap.addElement(section, {
      align: ['start', 'end'],
    });
  });

  // 4. Nav tracking
  snap.onSnapComplete = ({ index }) => {
    // Each section has 2 snap points (start + end)
    // index 0,1 = section 0; index 2,3 = section 1; etc.
    const pageIdx = Math.floor(index / 2);
    if (pageIdx < sections.length) onPageChange(pageIdx);
  };

  // 5. RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 6. Programmatic scroll for nav buttons
  function scrollToPage(index) {
    snap.goTo(index * 2); // Go to section's start snap point
  }

  // 7. Resize handler
  const onResize = () => snap.resize();
  window.addEventListener('resize', onResize);

  // Cleanup
  return {
    cleanup: () => {
      window.removeEventListener('resize', onResize);
      snap.destroy();
      lenis.destroy();
    },
    scrollToPage,
  };
}
