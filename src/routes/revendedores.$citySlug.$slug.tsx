import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { ChevronRight, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getDealer, whatsappLink, type Dealer } from "@/lib/dealers";

export const Route = createFileRoute("/revendedores/$citySlug/$slug")({
  head: ({ params }) => {
    const cityName = params.citySlug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `Revendedor PISONI em ${cityName} — Loja oficial` },
        { name: "description", content: `Loja oficial PISONI em ${cityName}. Endereço, telefone, WhatsApp e horários de atendimento.` },
        { property: "og:title", content: `Revendedor PISONI em ${cityName}` },
        { property: "og:description", content: `Visite a loja oficial PISONI em ${cityName}.` },
      ],
    };
  },
  component: DealerPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl mb-4">Revendedor não encontrado</h1>
        <Link to="/revendedores" className="text-[var(--brand-blue)] underline">Ver todos os revendedores</Link>
      </div>
    </SiteLayout>
  ),
});

function DealerPage() {
  const { citySlug, slug } = Route.useParams();
  const [dealer, setDealer] = useState<Dealer | null | undefined>(undefined);

  useEffect(() => {
    getDealer(citySlug, slug)
      .then((d) => setDealer(d))
      .catch(() => setDealer(null));
  }, [citySlug, slug]);

  if (dealer === undefined) {
    return (
      <SiteLayout>
        <div className="container-x py-32 flex justify-center"><Loader2 className="animate-spin" /></div>
      </SiteLayout>
    );
  }

  if (dealer === null) throw notFound();

  const wa = whatsappLink(dealer.whatsapp);
  const mapsUrl = dealer.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.address}, ${dealer.city}, ${dealer.state}`)}`
    : null;

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-x max-w-3xl">
          <nav className="text-xs text-foreground/60 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-foreground">Início</Link>
            <ChevronRight size={12} />
            <Link to="/revendedores" className="hover:text-foreground">Revendedores</Link>
            <ChevronRight size={12} />
            <Link to="/revendedores/$citySlug" params={{ citySlug }} className="hover:text-foreground">{dealer.city}</Link>
            <ChevronRight size={12} />
            <span className="text-foreground truncate">{dealer.name}</span>
          </nav>

          <div className="eyebrow mb-3">Revendedor oficial PISONI</div>
          <h1 className="text-4xl md:text-5xl">{dealer.name}</h1>
          <p className="mt-3 text-foreground/70">{dealer.city} / {dealer.state}</p>

          <div className="mt-10 grid gap-px bg-border border border-border">
            {dealer.address && (
              <InfoRow icon={MapPin} label="Endereço">
                {mapsUrl ? (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-blue)] underline-offset-4 hover:underline">
                    {dealer.address}
                  </a>
                ) : (
                  dealer.address
                )}
              </InfoRow>
            )}
            {dealer.phone && (
              <InfoRow icon={Phone} label="Telefone">
                <a href={`tel:${dealer.phone}`} className="hover:text-[var(--brand-blue)]">{dealer.phone}</a>
              </InfoRow>
            )}
            {dealer.whatsapp && (
              <InfoRow icon={MessageCircle} label="WhatsApp">
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-blue)] underline-offset-4 hover:underline">
                    {dealer.whatsapp}
                  </a>
                ) : (
                  dealer.whatsapp
                )}
              </InfoRow>
            )}
            {dealer.email && (
              <InfoRow icon={Mail} label="E-mail">
                <a href={`mailto:${dealer.email}`} className="hover:text-[var(--brand-blue)]">{dealer.email}</a>
              </InfoRow>
            )}
            {dealer.business_hours && (
              <InfoRow icon={Clock} label="Horários">
                <span className="whitespace-pre-line">{dealer.business_hours}</span>
              </InfoRow>
            )}
          </div>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-10 inline-flex"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5 flex items-start gap-4">
      <Icon size={18} className="mt-0.5 text-[var(--brand-blue)] shrink-0" />
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-foreground/50">{label}</div>
        <div className="mt-1 text-foreground break-words">{children}</div>
      </div>
    </div>
  );
}
