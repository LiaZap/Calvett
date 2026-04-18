"use client";

import { useEffect } from "react";
import { useControlMenuStore } from "@/stores/useControlMenuStore";

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const DRAWER_W = 300;
// When drawer opens, shift dashboard so Hospital da Plástica card (design x=142)
// lands exactly at drawer's right edge. This hides the nav rail behind the drawer.
const DASH_SHIFT = DRAWER_W - 142; // 158

export default function ViewportScaler() {
  const drawerOpen = useControlMenuStore((s) => s.isOpen);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const totalW = drawerOpen ? DESIGN_W + DASH_SHIFT : DESIGN_W;
      // Uniform scale — preserves aspect ratio (no stretching).
      const scale = Math.min(vw / totalW, vh / DESIGN_H);
      // When viewport is wider than 16:9, expand the design canvas horizontally
      // so right-anchored elements can stretch into what would otherwise be letterbox.
      const canvasW = Math.max(DESIGN_W, vw / scale - (drawerOpen ? DASH_SHIFT : 0));
      root.style.setProperty("--app-scale-x", String(scale));
      root.style.setProperty("--app-scale-y", String(scale));
      root.style.setProperty("--canvas-w", `${canvasW}px`);
      root.style.setProperty(
        "--dash-offset-x",
        drawerOpen ? `${DASH_SHIFT}px` : "0px",
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [drawerOpen]);

  return null;
}
