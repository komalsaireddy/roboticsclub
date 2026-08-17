import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://roboticsclub-eight.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/member/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
