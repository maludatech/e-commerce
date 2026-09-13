import { MetadataRoute } from "next";

import { getSetting } from "@/lib/actions/setting.actions";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const {
    site: { url },
  } = await getSetting();
  const baseUrl = url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/checkout", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
