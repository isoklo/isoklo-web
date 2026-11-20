"use client";

import { useEffect } from "react";

/** When the drawing has finished, lift it into the header (FLIP) while the page rises underneath. */
const LIFT_AT_MS = 1860;
const LIFT_MS = 760;
const LIFT_FAST_MS = 380;

export function IntroController() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "full" || "introDone" in html.dataset) return;

    const overlay = document.querySelector<HTMLElement>("[data-intro-overlay]");
    const art = document.querySelector<SVGSVGElement>("[data-intro-art]");
    const slot = document.querySelector<HTMLElement>("[data-logo-slot]");
    if (!overlay || !art || !slot) {
      html.dataset.introDone = "";
      return;
    }

    let lifted = false;
    let timer = 0;

    const finish = () => {
      html.dataset.introDone = "";
      delete html.dataset.introLift;
      delete html.dataset.introSkip;
    };

    const lift = (fast: boolean) => {
      if (lifted) return;
      lifted = true;
      window.clearTimeout(timer);
      if (fast) html.dataset.introSkip = "";

      const from = art.getBoundingClientRect();
      const to = slot.getBoundingClientRect();
      const scale = to.width / from.width;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);

      html.dataset.introLift = "";
      const motion = art.animate(
        [
          { transform: "translate(0, 0) scale(1)" },
          { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        ],
        { duration: fast ? LIFT_FAST_MS : LIFT_MS, easing: "cubic-bezier(0.7, 0, 0.18, 1)", fill: "forwards" },
      );
      motion.onfinish = finish;
      motion.oncancel = finish;
    };

    const elapsed = performance.now();
    timer = window.setTimeout(() => lift(false), Math.max(0, LIFT_AT_MS - elapsed));

    const skip = () => lift(true);
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchmove", skip, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, []);

  return null;
}
