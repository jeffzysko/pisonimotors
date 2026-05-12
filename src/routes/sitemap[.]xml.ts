import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://pisonimotors.com.br";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const paths = ["/", "/modelos/c23", "/modelos/p112", "/representantes", "/encontre-um-revendedor", "/sobre", "/contato"];
        const urls = paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : (p.startsWith("/modelos") || p === "/representantes") ? "0.9" : "0.7"}</priority></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
