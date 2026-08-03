export type Flavor = {
  key: string;
  name: string;
  tagline: string;
  note: string;
  /** page background gradient stops while this flavor is on stage */
  bgA: string;
  bgB: string;
};

export const FLAVORS: Flavor[] = [
  {
    key: "mango",
    name: "Mango",
    tagline: "First light over the canopy",
    note: "Ripe mango pressed into cold-brewed mate. Bright, dense, a little wild.",
    bgA: "#3E8E4E",
    bgB: "#E8912A",
  },
  {
    key: "pineapple",
    name: "Pineapple",
    tagline: "Gold cut from the understory",
    note: "Charred pineapple sweetness against the green bite of the leaf.",
    bgA: "#F0C232",
    bgB: "#9A7410",
  },
  {
    key: "peach",
    name: "Peach",
    tagline: "Dusk on the river bend",
    note: "Stone fruit rounded off with hibiscus. The softest can in the line.",
    bgA: "#E4606D",
    bgB: "#7E2838",
  },
  {
    key: "kiwi",
    name: "Kiwi",
    tagline: "Rain on new leaves",
    note: "Tart kiwi over grassy mate. Sharpest of the four, zero apologies.",
    bgA: "#B5D334",
    bgB: "#557F1D",
  },
];

/** Deep canopy green — the backdrop for the Dive section. */
export const CANOPY = { bgA: "#123B27", bgB: "#0B1F15" };

/** Editorial off-white — the backdrop once the site "lands" in the bento grid. */
export const PAPER = { bgA: "#F6F3EA", bgB: "#EAE4D3" };
