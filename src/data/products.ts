export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  flavor: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  colorRgb: string;
  gradientFrom: string;
  gradientTo: string;
  image: string;
  backImage: string;
  price: number;
  originalPrice: number;
  weight: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  nutrition: {
    energy: string;
    protein: string;
    carbohydrate: string;
    totalFat: string;
    dietaryFibre: string;
    sodium: string;
  };
  highlights: string[];
  allergenInfo: string;
  storageInstructions: string[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "love-bite",
    name: "Love Bite",
    emoji: "❤️",
    flavor: "Cheese",
    tagline: "Cheesy enough to make you smile, sharp enough to leave a mark.",
    description: "Rich, cheesy & absolutely addictive. Every bite is a love letter wrapped in crunch.",
    longDescription: "Love Bite isn't just a snack — it's a confession. Made with premium fox nuts roasted to golden perfection and dusted with a rich, bold cheese seasoning that clings to every curve. Each bite delivers that irresistible cheesy tang followed by a satisfying crunch that keeps you coming back. Whether it's movie night, a late-night craving, or you're looking for the perfect sharing snack, Love Bite speaks the language of indulgence.",
    color: "#D4961A",
    colorRgb: "212, 150, 26",
    gradientFrom: "#D4961A",
    gradientTo: "#8B6914",
    image: "/products/6.png",
    backImage: "/products/back/6.png",
    price: 299,
    originalPrice: 349,
    weight: "100g",
    badge: "Bestseller",
    isBestseller: true,
    rating: 4.8,
    reviewCount: 342,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Cheese Seasoning", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
  {
    id: "2",
    slug: "blush",
    name: "Blush",
    emoji: "🩷",
    flavor: "Tangy Tomato",
    tagline: "I'm the reason your cheeks turn red and your heart beats a little faster.",
    description: "Zesty, tangy & bursting with taste. The kind of blush you can't hide.",
    longDescription: "Blush is that tangy, irresistible temptation you didn't know you needed. Roasted makhana meets a zesty tomato seasoning that hits all the right notes — a burst of tang, a whisper of spice, and a crunch that echoes. It's the snack equivalent of that first flutter in your chest. Bold enough to make a statement, light enough to keep you reaching for more.",
    color: "#C94040",
    colorRgb: "201, 64, 64",
    gradientFrom: "#C94040",
    gradientTo: "#8B1A1A",
    image: "/products/5.png",
    backImage: "/products/back/5.png",
    price: 299,
    originalPrice: 349,
    weight: "100g",
    isNew: true,
    badge: "New",
    rating: 4.7,
    reviewCount: 189,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Tomato Seasoning", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
  {
    id: "3",
    slug: "green-flag",
    name: "Green Flag",
    emoji: "💚",
    flavor: "Mint",
    tagline: "Finally, a green flag that doesn't ghost you.",
    description: "Cool, herby & refreshing. The only commitment that actually refreshes.",
    longDescription: "Green Flag is the snack that shows up, stays consistent, and never lets you down. Infused with cool mint and aromatic herbs, each makhana is a breath of fresh air — literally. The perfect balance of herby freshness and roasted crunch makes this one a keeper. No mixed signals here. Just pure, refreshing flavor that's always green-light-go.",
    color: "#2D5016",
    colorRgb: "45, 80, 22",
    gradientFrom: "#3D6B22",
    gradientTo: "#1A3A0A",
    image: "/products/3.png",
    backImage: "/products/back/3.png",
    price: 299,
    originalPrice: 349,
    weight: "100g",
    rating: 4.6,
    reviewCount: 256,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Mint Seasoning", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
  {
    id: "4",
    slug: "red-flag",
    name: "Red Flag",
    emoji: "❤️",
    flavor: "Peri Peri",
    tagline: "The only red flag you'll actually fall for.",
    description: "Fiery, bold & full of flavour. Spicy enough to steal your heart.",
    longDescription: "Red Flag is dangerously addictive — and it knows it. Coated in a fiery peri peri seasoning that builds heat with every crunch, this is the snack that warns you first and seduces you second. Bold, unapologetic, and impossible to resist. Sure, it's a red flag. But some red flags are worth it.",
    color: "#8B1A1A",
    colorRgb: "139, 26, 26",
    gradientFrom: "#B22222",
    gradientTo: "#5C0A0A",
    image: "/products/2.png",
    backImage: "/products/back/2.png",
    price: 299,
    originalPrice: 349,
    weight: "100g",
    badge: "Spicy",
    isBestseller: true,
    rating: 4.9,
    reviewCount: 412,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Peri Peri Seasoning", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
  {
    id: "5",
    slug: "crush-me",
    name: "Crush Me",
    emoji: "🤍",
    flavor: "Classic Salted",
    tagline: "I'm ready to be your midnight snack… if you're ready to break the ice.",
    description: "Simple, light & timeless. The classic that started it all.",
    longDescription: "Crush Me is the OG. No fancy frills, no complicated flavors — just perfectly roasted makhana kissed with a whisper of salt. It's honest, it's crunchy, and it's the kind of snack that never tries too hard but always delivers. The one you keep coming back to when everything else feels like too much. Understated. Irresistible. Classic.",
    color: "#C4A265",
    colorRgb: "196, 162, 101",
    gradientFrom: "#C4A265",
    gradientTo: "#8B7340",
    image: "/products/1.png",
    backImage: "/products/back/1.png",
    price: 249,
    originalPrice: 299,
    weight: "100g",
    rating: 4.7,
    reviewCount: 523,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
  {
    id: "6",
    slug: "soulmate",
    name: "Soulmate",
    emoji: "💜",
    flavor: "Cream & Onion",
    tagline: "Creamy, dreamy, and made just for you. Shall we make this official?",
    description: "Classic, creamy & perfectly savoury. Your perfect match in every bite.",
    longDescription: "Soulmate is the one. The creamy richness of premium cream seasoning meets the savory depth of onion, all wrapped around a perfectly roasted makhana. It's comfort in a crunch — familiar yet exciting, reliable yet surprising. Every handful feels like coming home to something (and someone) you love. This isn't just a flavor. It's a feeling.",
    color: "#6B3FA0",
    colorRgb: "107, 63, 160",
    gradientFrom: "#7B4FBF",
    gradientTo: "#4A2D75",
    image: "/products/4.png",
    backImage: "/products/back/4.png",
    price: 299,
    originalPrice: 349,
    weight: "100g",
    isNew: true,
    badge: "New",
    rating: 4.8,
    reviewCount: 178,
    ingredients: ["Makhana (Fox Nuts)", "Edible Vegetable Oil", "Cream & Onion Seasoning", "Iodised Salt"],
    nutrition: {
      energy: "375 kcal",
      protein: "9.2 g",
      carbohydrate: "76.1 g",
      totalFat: "2.4 g",
      dietaryFibre: "7.5 g",
      sodium: "320 mg",
    },
    highlights: ["Roasted, Not Fried", "High in Protein", "Gluten Free", "No Preservatives", "Rich in Fibre"],
    allergenInfo: "Processed in a facility that also processes nuts.",
    storageInstructions: ["Store in a cool, dry place", "Keep away from direct sunlight", "Once opened, keep the jar tightly closed"],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, 4);
};

export const getRelatedProducts = (currentSlug: string): Product[] => {
  return products.filter((p) => p.slug !== currentSlug).slice(0, 3);
};
