import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import heroImg from "@/assets/hero-scooter.jpg";
import urbaImg from "@/assets/urba.jpg";
import moveImg from "@/assets/move.jpg";
import { ArrowUpRight, Sparkles, VolumeX, LifeBuoy, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PISONI — Mobilidade elétrica premium" },
      { name: "description", content: "Scooters e motos elétricas PISONI. Design autoral, tecnologia silenciosa, presença urbana." },
      { property: "og:title", content: "PISONI — Mobilidade elétrica premium" },
      { property: "og:description", content: "Scooters elétricas PISONI: design autoral, tecnologia silenciosa, presença urbana." },
    ],
  }),
  component: HomePage,
});

const models = [
  { slug: "urba", img: urbaImg, name: "URBA", tagline: "Para o dia a dia da cidade.", specs: [["Autonomia", "80 km"], ["Vel. máx", "65 km/h"], ["Carga", "4–6h"]] },
  { slug: "move", img: moveImg, name: "MOVE", tagline: "Performance e autonomia estendida.", specs: [["Autonomia", "140 km"], ["Vel. máx", "95 km/h"], ["Carga", "5–7h"]] },
] as const;

const pillars = [
  { icon: Sparkles, title: "Design autoral", text: "Linhas próprias, sem cópia. Presença em qualquer rua." },
  { icon: VolumeX, title: "Tecnologia silenciosa", text: "Motorização elétrica de alta eficiência, sem ruído." },
  { icon: LifeBuoy, title: "Suporte nacional", text: "Rede de representantes e assistência por todo o Brasil." },
  { icon: ShieldCheck, title: "Garantia estendida", text: "Confiança que acompanha cada quilômetro rodado." },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Scooter PISONI em rua urbana ao entardecer"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        <div className="container-x relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 text-[var(--paper)]">
          <div className="eyebrow text-[var(--copper)]">PISONI · Elétricas</div>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl lg:text-7xl leading-[1.02]">
            Mobilidade elétrica para quem se move com propósito.
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-white/75">
            Scooters PISONI: design autoral, tecnologia silenciosa, presença urbana.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/representantes" className="btn-primary">
              Seja Representante PISONI <ArrowUpRight size={16} />
            </Link>
            <Link to="/encontre-um-revendedor" className="btn-outline text-white">
              Encontre um Revendedor
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-28 md:py-40">
        <div className="container-x max-w-5xl">
          <div className="eyebrow mb-8">Manifesto</div>
          <p className="font-display text-3xl md:text-5xl leading-[1.15] tracking-tight">
            Acreditamos que a forma como você se move pela cidade diz algo sobre quem você é.
            <span className="text-foreground/40"> A PISONI nasceu para quem escolhe silêncio, design e responsabilidade — sem abrir mão da presença.</span>
          </p>
        </div>
      </section>

      {/* MODELS */}
      <section className="pb-24">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="eyebrow mb-3">Modelos</div>
              <h2 className="text-3xl md:text-5xl">Duas formas de se mover.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {models.map((m) => (
              <Link
                key={m.slug}
                to="/modelos/$slug" params={{ slug: m.slug }}
                className="group block bg-card border border-border overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={m.img} alt={`PISONI ${m.name}`} loading="lazy" width={1280} height={1024}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-3xl md:text-4xl">{m.name}</h3>
                    <ArrowUpRight className="text-foreground/40 group-hover:text-[var(--copper)] transition-colors" />
                  </div>
                  <p className="mt-2 text-foreground/60">{m.tagline}</p>
                  <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
                    {m.specs.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs uppercase tracking-wider text-foreground/50">{k}</dt>
                        <dd className="mt-1 font-display font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 text-sm font-display font-medium text-[var(--copper)]">Conhecer modelo →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-24 border-t border-border">
        <div className="container-x">
          <div className="eyebrow mb-3">Por que PISONI</div>
          <h2 className="text-3xl md:text-5xl max-w-2xl">Pensada por inteiro. Refinada no detalhe.</h2>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="text-[var(--copper)]" size={28} strokeWidth={1.5} />
                <h3 className="mt-5 text-lg font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-x py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="eyebrow text-[var(--copper)] mb-4">Rede de Representantes</div>
            <h2 className="text-3xl md:text-5xl">Sua cidade ainda não tem um representante PISONI?</h2>
            <p className="mt-6 text-lg text-white/70">
              Estamos expandindo nossa rede de parceiros exclusivos. Cada cidade, um representante.
              Cada lead da sua região, direto para você.
            </p>
            <Link to="/representantes" className="btn-primary mt-10">
              Quero ser representante na minha cidade <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
