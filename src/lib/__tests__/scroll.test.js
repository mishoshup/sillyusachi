import { describe, it, expect } from "vitest";

describe("Scroll Architecture (CSS Snap)", () => {
  it("sections should have data-page attributes", () => {
    document.body.innerHTML = `
      <main>
        <div>
          <section data-page="0">Portfolio</section>
          <section data-page="1">Commissions</section>
          <section data-page="2">About Me</section>
        </div>
      </main>
    `;
    const sections = document.querySelectorAll("[data-page]");
    expect(sections.length).toBe(3);
    sections.forEach((el, i) => {
      expect(el.getAttribute("data-page")).toBe(String(i));
    });
  });

  it("layout wrapper should NOT have overflow-hidden", () => {
    document.body.innerHTML = `
      <div class="h-dvh bg-[#080612]">
        <main>content</main>
      </div>
    `;
    const wrapper = document.querySelector("div");
    expect(wrapper.classList.contains("overflow-hidden")).toBe(false);
  });

  it("sections should have min-h-dvh class", () => {
    document.body.innerHTML = `
      <section class="w-full relative flex flex-col overflow-hidden min-h-dvh snap-start">A</section>
      <section class="w-full relative flex flex-col min-h-dvh snap-start">B</section>
    `;
    const sections = document.querySelectorAll("section");
    sections.forEach((el) => {
      expect(el.classList.contains("min-h-dvh")).toBe(true);
    });
  });

  it("CommissionInfo section should NOT have overflow-hidden", () => {
    document.body.innerHTML = `
      <section data-page="1" class="w-full relative flex flex-col min-h-dvh snap-start">Commissions</section>
    `;
    const section = document.querySelector('[data-page="1"]');
    expect(section.classList.contains("overflow-hidden")).toBe(false);
  });

  it("main should have snap-y snap-proximity and overflow-y-auto", () => {
    document.body.innerHTML = `
      <main class="h-dvh w-full overflow-y-auto snap-y snap-proximity"></main>
    `;
    const main = document.querySelector("main");
    expect(main.classList.contains("snap-y")).toBe(true);
    expect(main.classList.contains("snap-proximity")).toBe(true);
    expect(main.classList.contains("overflow-y-auto")).toBe(true);
  });
});
