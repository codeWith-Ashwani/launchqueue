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
            const hero = root.current.querySelectorAll("[data-hero]");
            if (hero.length)
              gsap.from(hero, {
                y: 28,
                opacity: 0,
                duration: 0.85,
                stagger: 0.09,
                ease: "power3.out",
                clearProps: "all",
              });
            root.current
              .querySelectorAll("[data-reveal]")
              .forEach((element) => {
                gsap.from(element, {
                  y: 22,
                  opacity: 0,
                  duration: 0.65,
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
