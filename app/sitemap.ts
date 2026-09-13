import { MetadataRoute } from "next";

import { connectToDb } from "@/utils/database";
import Product from "@/db/models/product.model";
import { getSetting } from "@/lib/actions/setting.actions";
import { getAllCategories } from "@/lib/actions/product.actions";
import { i18n } from "@/i18n-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {
    site: { url },
  } = await getSetting();
  const baseUrl = url.replace(/\/$/, "");

  const locales = i18n.locales.map((locale) => locale.code);
  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
    ])
  );

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [
            locale,
            locale === i18n.defaultLocale
              ? `${baseUrl}/search`
              : `${baseUrl}/${locale}/search`,
          ])
        ),
      },
    },
  ];

  await connectToDb();
  const products = await Product.find(
    { isPublished: true },
    { slug: 1, updatedAt: 1 }
  ).lean();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => {
    const path = `/product/${product.slug}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [
            locale,
            locale === i18n.defaultLocale
              ? `${baseUrl}${path}`
              : `${baseUrl}/${locale}${path}`,
          ])
        ),
      },
    };
  });

  const categories = await getAllCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${baseUrl}/search?category=${encodeURIComponent(category)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
