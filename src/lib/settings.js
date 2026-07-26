import { db } from "@/lib/db";

/** Always returns a Settings row, creating the default one on first read. */
export async function getSettings() {
  return db.settings.upsert({
    where: {
      id: "default"
    },
    update: {},
    create: {
      id: "default"
    }
  });
}

/** Non-sensitive subset safe to expose to any visitor (used to price carts/checkout). */
export function publicSettings(settings) {
  return {
    currency: settings.currency,
    flatShippingRate: settings.flatShippingRate,
    freeShippingThreshold: settings.freeShippingThreshold,
    enableFreeShipping: settings.enableFreeShipping,
    internationalShipping: settings.internationalShipping
  };
}

export function shippingConfigFromSettings(settings) {
  return {
    shippingFee: settings.flatShippingRate,
    freeShippingThreshold: settings.freeShippingThreshold,
    enableFreeShipping: settings.enableFreeShipping
  };
}
