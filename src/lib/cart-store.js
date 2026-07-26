"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useCart = create()(persist((set, get) => ({
  items: [],
  add: (item, qty = 1) => set(state => {
    const existing = state.items.find(i => i.slug === item.slug);
    if (existing) {
      return {
        items: state.items.map(i => i.slug === item.slug ? {
          ...i,
          qty: i.qty + qty
        } : i)
      };
    }
    return {
      items: [...state.items, {
        ...item,
        qty
      }]
    };
  }),
  remove: slug => set(state => ({
    items: state.items.filter(i => i.slug !== slug)
  })),
  setQty: (slug, qty) => set(state => ({
    items: state.items.map(i => i.slug === slug ? {
      ...i,
      qty: Math.max(1, qty)
    } : i).filter(i => i.qty > 0)
  })),
  clear: () => set({
    items: []
  }),
  count: () => get().items.reduce((s, i) => s + i.qty, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.qty * i.price, 0)
}), {
  name: "kbsc-cart"
}));
