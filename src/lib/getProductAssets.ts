import fs from "fs";
import path from "path";
import type { Product } from "@/data/products";

export interface ProductAssetBundle {
  slug: string;
  hero: string;
  emotions: string[];
  ingredients: string | null;
  nutrition: string | null;
  lifestyle: string[];
  gallery: string[];
  video: string | null;
}

const PRODUCTS_ROOT = path.join(process.cwd(), "public/assets/products");
const LIFESTYLE_ROOT = path.join(process.cwd(), "public/lifestyle");

function assetUrl(slug: string, file: string): string {
  return `/assets/products/${slug}/${encodeURIComponent(file)}`;
}

function findFile(files: string[], patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = files.find((file) => pattern.test(file));
    if (match) return match;
  }
  return null;
}

function sortNumeric(files: string[]): string[] {
  return [...files].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  );
}

export function getProductAssets(slug: string, product: Product): ProductAssetBundle {
  const dir = path.join(PRODUCTS_ROOT, slug);
  const fallbackEmotions = (product.bgImages ?? []).map((file) =>
    assetUrl(slug, file)
  );

  if (!fs.existsSync(dir)) {
    return {
      slug,
      hero: product.image,
      emotions: fallbackEmotions,
      ingredients: null,
      nutrition: null,
      lifestyle: getGlobalLifestyleImages(),
      gallery: [product.image, product.backImage].filter(Boolean),
      video: null,
    };
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => !file.startsWith(".") && !file.startsWith("._"));

  const heroFile = findFile(files, [/^hero\./i]);
  const ingredientsFile = findFile(files, [/^ingredients\./i]);
  const nutritionFile = findFile(files, [/^nutrition\./i]);
  const videoFile = findFile(files, [/\.(mp4|webm|mov)$/i]);

  const emotionFiles = sortNumeric(
    files.filter((file) =>
      /^(emotion\d+|0\d+)\.(png|jpe?g|webp)$/i.test(file)
    )
  );

  const lifestyleFiles = sortNumeric(
    files.filter((file) => /^lifestyle/i.test(file) && /\.(png|jpe?g|webp)$/i.test(file))
  );

  const reserved = new Set(
    [heroFile, ingredientsFile, nutritionFile, videoFile, ...emotionFiles, ...lifestyleFiles].filter(
      Boolean
    ) as string[]
  );

  const galleryFiles = sortNumeric(
    files.filter(
      (file) =>
        /\.(png|jpe?g|webp)$/i.test(file) &&
        !reserved.has(file) &&
        !/^back\//i.test(file)
    )
  );

  const emotions =
    emotionFiles.length > 0
      ? emotionFiles.map((file) => assetUrl(slug, file))
      : fallbackEmotions;

  const lifestyle =
    lifestyleFiles.length > 0
      ? lifestyleFiles.map((file) => assetUrl(slug, file))
      : getGlobalLifestyleImages();

  const gallery = [
    ...(heroFile ? [assetUrl(slug, heroFile)] : []),
    product.image,
    product.backImage,
    ...galleryFiles.map((file) => assetUrl(slug, file)),
  ].filter((value, index, array) => array.indexOf(value) === index);

  return {
    slug,
    hero: heroFile ? assetUrl(slug, heroFile) : product.image,
    emotions,
    ingredients: ingredientsFile ? assetUrl(slug, ingredientsFile) : null,
    nutrition: nutritionFile ? assetUrl(slug, nutritionFile) : null,
    lifestyle,
    gallery,
    video: videoFile ? assetUrl(slug, videoFile) : null,
  };
}

function getGlobalLifestyleImages(): string[] {
  if (!fs.existsSync(LIFESTYLE_ROOT)) return [];
  return sortNumeric(
    fs
      .readdirSync(LIFESTYLE_ROOT)
      .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
  ).map((file) => `/lifestyle/${encodeURIComponent(file)}`);
}
