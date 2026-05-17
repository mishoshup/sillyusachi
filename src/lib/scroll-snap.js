export function setupScrollSnap(container, onPageChange) {
  const sections = Array.from(container.querySelectorAll("[data-page]"));

  if (!sections.length) {
    console.warn("[ScrollSnap] Missing sections");
    return { cleanup() {}, scrollToPage() {} };
  }

  // Snap sentinels: inject a separate snap-end element at the bottom
  // of sections taller than the viewport. A separate element with its
  // own scroll-snap-stop:always forces a stop before advancing.
  const sentinels = [];
  sections.forEach((section) => {
    if (section.scrollHeight > container.clientHeight) {
      section.style.scrollSnapAlign = "";
      const s = document.createElement("div");
      s.style.scrollSnapAlign = "end";
      s.style.scrollSnapStop = "always";
      s.style.height = "1px";
      s.style.width = "100%";
      s.style.pointerEvents = "none";
      s.setAttribute("data-snap-sentinel", "");
      section.appendChild(s);
      sentinels.push(s);
    }
  });

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

  const onResize = () => {
    sections.forEach((section) => {
      const overflows = section.scrollHeight > container.clientHeight;
      const existing = section.querySelector(":scope > [data-snap-sentinel]");
      if (overflows && !existing) {
        const s = document.createElement("div");
        s.style.scrollSnapAlign = "end";
        s.style.scrollSnapStop = "always";
        s.style.height = "1px";
        s.style.width = "100%";
        s.style.pointerEvents = "none";
        s.setAttribute("data-snap-sentinel", "");
        section.appendChild(s);
        sentinels.push(s);
      } else if (!overflows && existing) {
        existing.remove();
      }
    });
  };
  window.addEventListener("resize", onResize);

  return {
    cleanup: () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      sentinels.forEach((s) => s.remove());
    },
    scrollToPage,
  };
}
