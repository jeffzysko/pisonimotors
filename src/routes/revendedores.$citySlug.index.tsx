import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { ChevronRight, Loader2, MapPin, Phone } from "lucide-react";
import { listDealersByCity, type Dealer } from "@/lib/dealers";

export const Route = createFileRoute("/revendedores/$citySlug/")({
  head: ({ params }) => {
    const cityName = params.citySlug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `Revendedores PISONI em ${cityName}` },
        { name: "description", content: `Encontre os revendedores PISONI em ${cityName} e fale diretamente com a loja mais próxima.` },
        { property: "og:title", content: `Revendedores PISONI em ${cityName}` },
        { property: "og:description", content: `Lojas e representantes oficiais PISONI em ${cityName}.` },
      ],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl mb-4">Cidade não encontrada</h1>
        <Link to="/revendedores" className="text-[var(--brand-blue)] underline">Ver todas as cidades</Link>
      </div>
    </SiteLayout>
  ),
});

function CityPage() {
  const { citySlug } = Route.useParams();
  const [dealers, setDealers] = useState<Dealer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listDealersByCity(citySlug)
      .then(setDealers)
      .catch(() => setDealers([]))
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="container-x py-32 flex justify-center"><Loader2 className="animate-spin" /></div>
      </SiteLayout>
    );
  }

  if (!dealers || dealers.length === 0) {
    throw notFound();
  }

  const cityName = dealers[0].city;
  const state = dealers[0].state;

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-x max-w-5xl">
          <nav className="text-xs text-foreground/60 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground">Início</Link>
            <ChevronRight size={12} />
            <Link to="/revendedores" className="hover:text-foreground">Revendedores</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{cityName}</span>
          </nav>

          <div className="eyebrow mb-3">{state}</div>
          <h1 className="text-4xl md:text-5xl">Revendedores PISONI em {cityName}.</h1>
          <p className="mt-4 text-foreground/70">
            {dealers.length} {dealers.length === 1 ? "loja oficial" : "lojas oficiais"} para você visitar e conhecer de perto.
          </p>

          <ul className="mt-10 grid gap-5">
            {dealers.map((d) => (
              <li key={d.id}>
                <Link
                  to="/revendedores/$citySlug/$slug"
                  params={{ citySlug: d.city_slug, slug: d.slug }}
                  className="block border border-border bg-card p-6 hover:border-[var(--brand-blue)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-display text-xl md:text-2xl">{d.name}</div>
                      {d.address && (
                        <div className="text-sm text-foreground/60 mt-2 flex items-start gap-1.5">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span>{d.address}</span>
                        </div>
                      )}
                      {d.phone && (
                        <div className="text-sm text-foreground/60 mt-1 flex items-center gap-1.5">
                          <Phone size={14} /> {d.phone}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-[var(--brand-blue)] uppercase tracking-wider self-center">
                      Ver detalhes →
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
