import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://pisonimotors.com.br";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const staticPaths = ["/", "/modelos/c23", "/modelos/p112", "/representantes", "/revendedores", "/sobre", "/contato"];

        // Fetch dealers for dynamic URLs
        const dealerUrls: string[] = [];
        const citySet = new Set<string>();
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient(url, key);
            const { data } = await sb
              .from("dealers")
              .select("city_slug, slug")
              .eq("published", true);
            if (data) {
              for (const d of data as { city_slug: string; slug: string }[]) {
                citySet.add(d.city_slug);
                dealerUrls.push(`/revendedores/${d.city_slug}/${d.slug}`);
              }
            }
          }
        } catch {
          // ignore — sitemap still works with static routes
        }
        const cityUrls = Array.from(citySet).map((c) => `/revendedores/${c}`);

        const allPaths = [...staticPaths, ...cityUrls, ...dealerUrls];
        const urls = allPaths
          .map((p) => {
            const priority = p === "/"
              ? "1.0"
              : (p.startsWith("/modelos") || p === "/representantes" || p === "/revendedores")
                ? "0.9"
                : p.startsWith("/revendedores/")
                  ? "0.8"
                  : "0.7";
            return `  <url><loc>${BASE_URL}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
          })
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
