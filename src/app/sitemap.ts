import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = products.map((product) => ({
    url: `${siteConfig.url}/flavours/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const routes = [
    "",
    "/find-my-flavour",
    "/create-your-bowl",
    "/checkout",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.9,
  }));

  return [...routes, ...productUrls];
}
