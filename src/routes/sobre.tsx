import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a PISONI — Mobilidade elétrica brasileira" },
      { name: "description", content: "PISONI é a marca brasileira de scooters e motos elétricas premium. Design autoral, tecnologia silenciosa." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <section className="py-24 md:py-36 bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-x max-w-4xl">
          <div className="eyebrow text-[var(--copper)] mb-4">Sobre</div>
          <h1 className="text-4xl md:text-7xl leading-[1.05]">
            Marca brasileira. Padrão global.
          </h1>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x max-w-3xl space-y-8 text-lg leading-relaxed text-foreground/80">
          <p className="font-display text-2xl md:text-3xl text-foreground leading-snug">
            A PISONI nasceu da convicção de que mobilidade urbana pode — e deve — ser silenciosa, bonita e responsável.
          </p>
          <p>
            Projetamos cada scooter e cada moto como uma peça autoral: linhas próprias, materiais selecionados,
            tecnologia que desaparece em uso. Nada é decorativo. Tudo serve à experiência de pilotagem.
          </p>
          <p>
            Operamos no Brasil com produção nacional e uma rede de representantes exclusivos por cidade.
            Cada parceiro PISONI é a marca na rua, próximo do cliente, com estoque, assistência e treinamento.
          </p>
          <p>
            Não somos para todos. Somos para quem escolhe — quem prefere silêncio a ruído, design a cópia,
            durabilidade a descarte. Para quem entende que se mover pela cidade é, também, uma forma de dizer quem é.
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-border">
        <div className="container-x grid md:grid-cols-3 gap-10 max-w-5xl">
          {[
            { n: "2022", t: "Fundação", d: "Início do projeto PISONI no Brasil." },
            { n: "2024", t: "Primeiro modelo", d: "Lançamento da scooter PISONI C23." },
            { n: "2025", t: "Linha completa", d: "Chegada da PISONI P112 e expansão da rede." },
          ].map((it) => (
            <div key={it.n}>
              <div className="font-display text-5xl text-[var(--copper)]">{it.n}</div>
              <div className="mt-4 font-display text-xl font-semibold">{it.t}</div>
              <p className="mt-2 text-foreground/60">{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-secondary/40 border-t border-border">
        <div className="container-x text-center">
          <h2 className="text-3xl md:text-5xl">Faça parte da rede PISONI.</h2>
          <Link to="/representantes" className="btn-primary mt-10">Seja Representante</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
