"use client";

import * as React from "react";
/**
 * Intelligent sticky header scroll behavior.
 *
 * Mobile (< 1024px):
 *   - Visible on initial load.
 *   - Hides (slides up) when scrolling down past a threshold.
 *   - Reveals immediately when scrolling up.
 *   - Always visible at the very top of the page.
 *   - Anti-flicker: ignores scroll movements smaller than a dead zone.
 *
 * Desktop (>= 1024px):
 *   - Always visible (never hides).
 *   - Enters compact mode when scrolled.
 *
 * Performance:
 *   - Uses `requestAnimationFrame` to batch scroll updates (max one update per frame).
 *   - Uses `passive` scroll listeners.
 *   - Caches `matchMedia` result (updated on resize) to avoid per-frame calls.
 *   - All state is tracked in refs; `setState` is called only when something
 *     actually changes — avoids unnecessary re-renders.
 *   - No ref mutations inside the `setState` updater.
 *
 * Algorithm:
 *   Direction is computed per-frame from `prevScrollY` (the previous frame's
 *   scroll position), NOT from the last state-change position. This makes the
 *   behavior robust against non-monotonic scroll values (e.g. iOS rubber-
 *   banding, scroll-to animations with slight overshoot). A small dead zone
 *   (5px) ignores micro-movements to prevent flicker.
 *
 * @param forceVisible When true, the header is always shown (e.g. when a
 *   mobile drawer is open so the hamburger button stays reachable).
 */
export function useScrollHeader(forceVisible = false) {
  const [state, setState] = React.useState({
    hidden: false,
    compact: false
  });

  // Refs mirror the current state so we can compute new values outside
  // the setState updater (avoids stale-closure / double-invoke issues).
  const hiddenRef = React.useRef(false);
  const compactRef = React.useRef(false);
  const prevScrollY = React.useRef(0);
  const ticking = React.useRef(false);
  const forceVisibleRef = React.useRef(forceVisible);
  const isMobileRef = React.useRef(false);

  // Keep forceVisibleRef in sync and immediately reveal when it turns true.
  React.useEffect(() => {
    forceVisibleRef.current = forceVisible;
    if (forceVisible && hiddenRef.current) {
      hiddenRef.current = false;
      setState(prev => ({
        ...prev,
        hidden: false
      }));
    }
  }, [forceVisible]);

  // Cache the mobile/desktop breakpoint check and update on resize.
  React.useEffect(() => {
    const updateMobile = () => {
      isMobileRef.current = window.matchMedia("(max-width: 1023px)").matches;
      // If we switch to desktop, make sure the header isn't hidden.
      if (!isMobileRef.current && hiddenRef.current) {
        hiddenRef.current = false;
        setState(prev => ({
          ...prev,
          hidden: false
        }));
      }
    };
    updateMobile();
    window.addEventListener("resize", updateMobile, {
      passive: true
    });
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  // Core scroll listener — set up once.
  React.useEffect(() => {
    const TOP_THRESHOLD = 8; // px from top — always visible within this range
    const COMPACT_THRESHOLD = 16; // px scrolled to enter compact mode
    const DEAD_ZONE = 5; // px — ignore scroll deltas smaller than this to prevent flicker

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const isMobile = isMobileRef.current;
      const delta = currentScrollY - prevScrollY.current;

      // Update prevScrollY for the next frame.
      prevScrollY.current = currentScrollY;

      // Compute new values from refs (not from React state).
      const compact = currentScrollY > COMPACT_THRESHOLD;
      let hidden = hiddenRef.current;
      if (forceVisibleRef.current) {
        hidden = false;
      } else if (isMobile) {
        if (currentScrollY < TOP_THRESHOLD) {
          // At the very top: always show.
          hidden = false;
        } else if (Math.abs(delta) > DEAD_ZONE) {
          // Only react to meaningful scroll movements (anti-flicker).
          if (delta > 0 && !hiddenRef.current) {
            // Scrolling down → hide.
            hidden = true;
          } else if (delta < 0 && hiddenRef.current) {
            // Scrolling up → reveal.
            hidden = false;
          }
        }
      } else {
        // Desktop: never hide.
        hidden = false;
      }
      const changed = hidden !== hiddenRef.current || compact !== compactRef.current;

      // Update refs BEFORE calling setState.
      hiddenRef.current = hidden;
      compactRef.current = compact;
      if (changed) {
        setState({
          hidden,
          compact
        });
      }
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollState);
      }
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    // Run once to pick up the initial scroll position (e.g. on page restore).
    updateScrollState();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}
