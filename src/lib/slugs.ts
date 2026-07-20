/** Maps friendly URL slugs to canonical product slugs in products.ts */
export const SLUG_ALIASES: Record<string, string> = {
  "peri-peri": "red-flag",
  peri: "red-flag",
  mint: "green-flag",
  "green-apple": "green-flag",
  "cream-onion": "soulmate",
  "classic-salt": "crush-me",
  cheese: "love-bite",
  tomato: "blush",
  "tangy-tomato": "blush",
};

export function resolveProductSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

export function getAllFlavourRouteSlugs(canonicalSlugs: string[]): string[] {
  const aliases = Object.entries(SLUG_ALIASES)
    .filter(([, canonical]) => canonicalSlugs.includes(canonical))
    .map(([alias]) => alias);
  return [...new Set([...canonicalSlugs, ...aliases])];
}
