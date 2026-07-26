export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 5.99;
export const TAX_RATE = 0.08;

/**
 * `config` lets callers override the shipping rules with live values from
 * admin settings; any field omitted falls back to the static defaults
 * above so this keeps working even before settings have loaded.
 */
export function computeOrderTotals(subtotal, config = {}) {
  const freeShippingThreshold = config.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const shippingFee = config.shippingFee ?? SHIPPING_FEE;
  const enableFreeShipping = config.enableFreeShipping ?? true;
  const taxRate = config.taxRate ?? TAX_RATE;

  const shipping = subtotal === 0 || (enableFreeShipping && subtotal >= freeShippingThreshold) ? 0 : shippingFee;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
