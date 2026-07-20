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
import { siteConfig } from "@/lib/siteConfig";

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

  const url = `${siteConfig.url}/flavours/${canonicalSlug}`;

  return {
    title: `${product.name} — ${product.flavor} | Vellari`,
    description: product.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.name} — Vellari`,
      description: product.tagline,
      url,
      images: [{ url: `${siteConfig.url}${product.image}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Vellari`,
      description: product.tagline,
      images: [`${siteConfig.url}${product.image}`],
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

  const url = `${siteConfig.url}/flavours/${canonicalSlug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${siteConfig.url}${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Vellari",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Flavours",
        item: `${siteConfig.url}/#products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailPage
        product={product}
        assets={assets}
        theme={theme}
        related={related}
      />
    </>
  );
}
