import type { MetadataRoute } from "next";

const SITE_URL = "https://daryanto-web-ra9i.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
