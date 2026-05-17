export function setupScrollSnap(container, onPageChange) {
  const sections = Array.from(container.querySelectorAll("[data-page]"));

  if (!sections.length) {
    console.warn("[ScrollSnap] Missing sections");
    return { cleanup() {}, scrollToPage() {} };
  }

  function scrollToPage(index) {
    if (index >= 0 && index < sections.length) {
      sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const idx = Number(e.target.dataset.page);
          if (!isNaN(idx)) onPageChange(idx);
          break;
        }
      }
    },
    { root: container, threshold: 0.3 },
  );

  sections.forEach((el) => observer.observe(el));

  return {
    cleanup: () => observer.disconnect(),
    scrollToPage,
  };
}
