import { useEffect } from "react";
export function usePageMotion(root, revision = "") {
  useEffect(() => {
    if (
      !window.matchMedia ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let active = true;
    let media;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (!active || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        media = gsap.matchMedia();
        media.add(
          "(prefers-reduced-motion: no-preference)",
          () => {
            // A nested motion root owns its own elements; avoid animating them twice.
            const owned = (selector) => [...root.current.querySelectorAll(selector)]
              .filter((element) => !element.closest("[data-motion-root]") || element.closest("[data-motion-root]") === root.current);
            const hero = owned("[data-hero]");
            if (hero.length)
              gsap.from(hero, {
                y: 12,
                duration: 0.35,
                stagger: 0.03,
                ease: "power3.out",
                clearProps: "all",
              });
            owned("[data-reveal]")
              .forEach((element) => {
                gsap.from(element, {
                  y: 12,
                  duration: 0.35,
                  ease: "power2.out",
                  clearProps: "all",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 94%",
                    once: true,
                  },
                });
              });
          },
          root,
        );
      })
      .catch(() => {
        /* Content stays usable when motion cannot load. */
      });
    return () => {
      active = false;
      media?.revert();
    };
  }, [root, revision]);
}
