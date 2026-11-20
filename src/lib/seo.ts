export const OG_IMAGE = "/images/og-default.jpg";

export function seo({ title, description, image = OG_IMAGE, noindex = false }: { title: string; description: string; image?: string; noindex?: boolean }) {
  const fullTitle = title.includes("MERPORT") ? title : `${title} | MERPORT`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "MERPORT, importateur et distributeur de matériel électrique à Casablanca" },
      { name: "twitter:image", content: image },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
  };
}
