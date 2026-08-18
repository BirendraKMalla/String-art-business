/**
 * Theme constants for String Art Studio.
 * Shared between JS logic and Tailwind utility classes.
 */
export const theme = {
  colors: {
    // Warm earth tones
    cream: "#f9f5f0",
    parchment: "#fdfaf4",
    warmBeige: "#f0ebe3",
    terracotta: "#c9653b",
    burntUmber: "#805533",
    deepBrown: "#5a3e2b",
    sage: "#8a9a8a",
    sageLight: "#d4e0d4",
    charcoal: "#222222",
    goldAccent: "#d4af6b",
  },

  // Status badge colors mapped to order statuses
  statusColors: {
    pending: "bg-sageLight text-deepBrown",
    processing: "bg-warmBeige text-terracotta",
    completed: "bg-sage text-white",
    shipped: "bg-deepBrown text-goldAccent",
  },
};
