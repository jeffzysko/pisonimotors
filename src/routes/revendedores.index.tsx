import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { Search, MapPin, Loader2, Phone } from "lucide-react";
import {
  type Dealer,
  type DealerNear,
  dealersNear,
  geocode,
  isCep,
  listDealers,
  lookupCep,
  searchDealersText,
} from "@/lib/dealers";

export const Route = createFileRoute("/revendedores/")({
  head: () => ({
    meta: [
      { title: "Revendedores PISONI — Encontre o representante mais próximo" },
      { name: "description", content: "Localize a revenda PISONI mais próxima da sua cidade ou CEP." },
      { property: "og:title", content: "Revendedores PISONI" },
      { property: "og:description", content: "Encontre o representante PISONI mais próximo de você." },
    ],
  }),
  component: RevendedoresIndex,
});

function RevendedoresIndex() {
  const [all, setAll] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [textResults, setTextResults] = useState<Dealer[] | null>(null);
  const [nearResults, setNearResults] = useState<DealerNear[] | null>(null);
  const [searchInfo, setSearchInfo] = useState<string | null>(null);

  useEffect(() => {
    listDealers()
      .then(setAll)
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  // Group by state, then city
  const byState = useMemo(() => {
    const map = new Map<string, Map<string, Dealer[]>>();
    for (const d of all) {
      if (!map.has(d.state)) map.set(d.state, new Map());
      const cities = map.get(d.state)!;
      if (!cities.has(d.city_slug)) cities.set(d.city_slug, []);
      cities.get(d.city_slug)!.push(d);
    }
    return map;
  }, [all]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      setTextResults(null);
      setNearResults(null);
      setSearchInfo(null);
      return;
    }
    setSearching(true);
    setTextResults(null);
    setNearResults(null);
    setSearchInfo(null);
    try {
      if (isCep(term)) {
        const cep = await lookupCep(term);
        if (!cep) {
          setSearchInfo("CEP não encontrado. Verifique e tente novamente.");
          return;
        }
        const coords = await geocode(`${cep.address}, ${cep.city}, ${cep.state}, Brasil`);
        if (!coords) {
          setSearchInfo(`Não foi possível localizar ${cep.city}/${cep.state}. Tente buscar pela cidade.`);
          return;
        }
        const near = await dealersNear(coords.lat, coords.lng, 10);
        setNearResults(near);
        setSearchInfo(`Revendedores próximos de ${cep.city}/${cep.state}`);
      } else {
        const res = await searchDealersText(term);
        setTextResults(res);
        setSearchInfo(`Resultados para "${term}"`);
      }
    } finally {
      setSearching(false);
    }
  };

  const showingResults = textResults !== null || nearResults !== null;

  return (
    <SiteLayout>
      <section className="py-24 md:py-32">
        <div className="container-x max-w-5xl">
          <div className="eyebrow mb-4">Rede</div>
          <h1 className="text-4xl md:text-6xl">Encontre um revendedor.</h1>
          <p className="mt-6 text-lg text-foreground/70 max-w-2xl">
            Busque pela sua cidade ou digite seu CEP para ver os representantes PISONI mais próximos.
          </p>

          <form onSubmit={handleSearch} className="mt-10 flex items-center gap-3 border-b-2 border-foreground py-3">
            <Search size={20} className="text-foreground/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cidade ou CEP"
              className="flex-1 bg-transparent outline-none text-lg"
              aria-label="Buscar por cidade ou CEP"
            />
            <button type="submit" disabled={searching} className="btn-primary !py-2 !px-4 text-xs">
              {searching ? <Loader2 size={14} className="animate-spin" /> : "Buscar"}
            </button>
          </form>

          {searchInfo && <p className="mt-4 text-sm text-foreground/60">{searchInfo}</p>}

          {/* Search results */}
          {showingResults && (
            <div className="mt-10">
              {nearResults && nearResults.length === 0 && (
                <EmptyResult message="Ainda não temos revendedores cadastrados nessa região." />
              )}
              {textResults && textResults.length === 0 && (
                <EmptyResult message="Nenhum revendedor encontrado com esse termo." />
              )}
              {nearResults && nearResults.length > 0 && (
                <ul className="grid gap-4">
                  {nearResults.map((d) => (
                    <DealerNearCard key={d.id} dealer={d} />
                  ))}
                </ul>
              )}
              {textResults && textResults.length > 0 && (
                <ul className="grid gap-4">
                  {textResults.map((d) => (
                    <DealerCard key={d.id} dealer={d} />
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Default listing by state when no search */}
          {!showingResults && (
            <div className="mt-16">
              {loading ? (
                <div className="py-16 flex justify-center"><Loader2 className="animate-spin" /></div>
              ) : all.length === 0 ? (
                <div className="border border-dashed border-border p-10 md:p-14 text-center bg-card">
                  <MapPin className="mx-auto text-[var(--brand-blue)]" size={32} strokeWidth={1.5} />
                  <h2 className="mt-6 font-display text-2xl">Estamos expandindo nossa rede.</h2>
                  <p className="mt-3 text-foreground/70 max-w-md mx-auto">
                    Caso não encontre um representante na sua cidade,{" "}
                    <Link to="/representantes" className="text-[var(--brand-orange)] underline underline-offset-4 font-medium">
                      seja você o primeiro
                    </Link>.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  <h2 className="font-display text-2xl md:text-3xl">Revendedores por estado</h2>
                  {Array.from(byState.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([state, cities]) => (
                      <div key={state}>
                        <h3 className="text-sm uppercase tracking-widest text-[var(--brand-blue)] mb-4">{state}</h3>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Array.from(cities.entries())
                            .sort(([, a], [, b]) => a[0].city.localeCompare(b[0].city))
                            .map(([citySlug, dealers]) => (
                              <li key={citySlug}>
                                <Link
                                  to="/revendedores/$citySlug"
                                  params={{ citySlug }}
                                  className="block border border-border p-4 hover:border-[var(--brand-blue)] transition-colors bg-card"
                                >
                                  <div className="font-medium">{dealers[0].city}</div>
                                  <div className="text-xs text-foreground/60 mt-1">
                                    {dealers.length} {dealers.length === 1 ? "revendedor" : "revendedores"}
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyResult({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border p-10 text-center bg-card">
      <p className="text-foreground/70">{message}</p>
      <Link to="/representantes" className="inline-block mt-4 text-[var(--brand-orange)] underline underline-offset-4 font-medium text-sm">
        Quer ser representante na sua região?
      </Link>
    </div>
  );
}

function DealerCard({ dealer }: { dealer: Dealer }) {
  return (
    <li className="border border-border bg-card p-5 hover:border-[var(--brand-blue)] transition-colors">
      <Link
        to="/revendedores/$citySlug/$slug"
        params={{ citySlug: dealer.city_slug, slug: dealer.slug }}
        className="block"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-lg">{dealer.name}</div>
            <div className="text-sm text-foreground/60 mt-1">{dealer.city} / {dealer.state}</div>
            {dealer.address && <div className="text-xs text-foreground/50 mt-1">{dealer.address}</div>}
          </div>
          {dealer.phone && (
            <div className="text-xs text-foreground/60 flex items-center gap-1.5">
              <Phone size={12} /> {dealer.phone}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

function DealerNearCard({ dealer }: { dealer: DealerNear }) {
  return (
    <li className="border border-border bg-card p-5 hover:border-[var(--brand-blue)] transition-colors">
      <Link
        to="/revendedores/$citySlug/$slug"
        params={{ citySlug: dealer.city_slug, slug: dealer.slug }}
        className="block"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-lg">{dealer.name}</div>
            <div className="text-sm text-foreground/60 mt-1">{dealer.city} / {dealer.state}</div>
            {dealer.address && <div className="text-xs text-foreground/50 mt-1">{dealer.address}</div>}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs uppercase tracking-wider text-[var(--brand-blue)]">Distância</div>
            <div className="font-display text-xl">{Math.round(dealer.distance_km)} km</div>
          </div>
        </div>
      </Link>
    </li>
  );
}
