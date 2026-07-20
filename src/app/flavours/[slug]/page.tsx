import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/flavour/ProductDetailPage";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/products";
import { getProductAssets } from "@/lib/getProductAssets";
import { getProductTheme } from "@/lib/productThemes";
import {
  getAllFlavourRouteSlugs,
  resolveProductSlug,
} from "@/lib/slugs";

interface FlavourPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const canonicalSlugs = products.map((p) => p.slug);
  return getAllFlavourRouteSlugs(canonicalSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FlavourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = resolveProductSlug(slug);
  const product = getProductBySlug(canonicalSlug);

  if (!product) {
    return { title: "Flavour Not Found — Vellari" };
  }

  return {
    title: `${product.name} — ${product.flavor} | Vellari`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Vellari`,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function FlavourPage({ params }: FlavourPageProps) {
  const { slug } = await params;
  const canonicalSlug = resolveProductSlug(slug);
  const product = getProductBySlug(canonicalSlug);

  if (!product) {
    notFound();
  }

  const assets = getProductAssets(canonicalSlug, product);
  const theme = getProductTheme(canonicalSlug);
  const related = getRelatedProducts(canonicalSlug);

  return (
    <ProductDetailPage
      product={product}
      assets={assets}
      theme={theme}
      related={related}
    />
  );
}
