import type { MetadataRoute } from "next";
import { CANDIDATS } from "@/lib/data";

const SITE_URL = "https://monchoix2027.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/simulateur",
    "/methodologie",
    "/methodologie/fiscalite-patrimoine",
    "/methodologie/retraites",
    "/methodologie/jeunesse",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const candidatRoutes = CANDIDATS.map((c) => ({
    url: `${SITE_URL}/candidats/${c.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...candidatRoutes];
}
