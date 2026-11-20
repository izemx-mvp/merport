import { useEffect } from "react";

/**
 * Adds `is-in` to every `.reveal` element once it enters the viewport, on every page.
 * A MutationObserver picks up elements rendered later (route changes, filters, tabs).
 */
export function useGlobalReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const scan = (root: ParentNode) => root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".reveal:not(.is-in)")) io.observe(node);
          scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
