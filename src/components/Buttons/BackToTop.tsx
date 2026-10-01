"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@/components/Icons";

/** Floating button that appears once the hero is scrolled past; its gold ring shows reading progress. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setVisible(window.scrollY > window.innerHeight * 0.9),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0 });
    // Return keyboard focus to the start of the page.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-navy text-white shadow-[0_12px_28px_-10px_rgb(10_25_47/0.6)] transition-all duration-300 hover:bg-navy-3 sm:right-8 sm:bottom-8 sm:size-[52px] ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 52 52"
        aria-hidden="true"
        className="progress-ring absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="26"
          cy="26"
          r="24.5"
          fill="none"
          stroke="rgb(255 255 255 / 0.12)"
          strokeWidth="1.5"
        />
        <circle
          cx="26"
          cy="26"
          r="24.5"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          pathLength={1}
        />
      </svg>
      <ArrowRight className="size-[18px] -rotate-90 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
