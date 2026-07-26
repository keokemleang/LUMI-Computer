"use client";

import * as React from "react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/pricing";

const DEFAULT_CONFIG = {
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingFee: SHIPPING_FEE,
  enableFreeShipping: true
};

/** Live shipping config from admin settings, falling back to static defaults until it loads. */
export function useShippingSettings() {
  const [config, setConfig] = React.useState(DEFAULT_CONFIG);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (cancelled || !data.ok) return;
      setConfig({
        freeShippingThreshold: data.settings.freeShippingThreshold,
        shippingFee: data.settings.flatShippingRate,
        enableFreeShipping: data.settings.enableFreeShipping
      });
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
