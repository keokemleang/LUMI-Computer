"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useWishlist = create()(persist((set, get) => ({
  items: [],
  toggle: item => set(state => {
    const exists = state.items.find(i => i.slug === item.slug);
    if (exists) {
      return {
        items: state.items.filter(i => i.slug !== item.slug)
      };
    }
    return {
      items: [...state.items, item]
    };
  }),
  has: slug => !!get().items.find(i => i.slug === slug),
  remove: slug => set(state => ({
    items: state.items.filter(i => i.slug !== slug)
  })),
  clear: () => set({
    items: []
  })
}), {
  name: "kbs-wishlist"
}));
