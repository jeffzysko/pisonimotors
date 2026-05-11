import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Mail, Phone, Newspaper, Briefcase } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — PISONI" },
      { name: "description", content: "Fale com a PISONI. Comercial, imprensa e atendimento ao cliente." },
    ],
  }),
  component: ContatoPage,
});

const channels = [
  { icon: Briefcase, label: "Comercial / B2B", value: "comercial@pisoni.com.br", href: "mailto:comercial@pisoni.com.br", note: "Para representantes e revendedores." },
  { icon: Mail, label: "Atendimento", value: "contato@pisoni.com.br", href: "mailto:contato@pisoni.com.br", note: "Dúvidas gerais sobre produtos." },
  { icon: Newspaper, label: "Imprensa", value: "imprensa@pisoni.com.br", href: "mailto:imprensa@pisoni.com.br", note: "Solicitações de mídia e materiais." },
  { icon: Phone, label: "WhatsApp", value: "+55 11 90000-0000", href: "https://wa.me/5511900000000", note: "Atendimento 9h às 18h, dias úteis." },
];

function ContatoPage() {
  return (
    <SiteLayout>
      <section className="py-24 md:py-32">
        <div className="container-x max-w-5xl">
          <div className="eyebrow mb-4">Contato</div>
          <h1 className="text-4xl md:text-7xl leading-[1.05]">Fale com a PISONI.</h1>
          <p className="mt-8 max-w-xl text-lg text-foreground/70">
            Escolha o canal mais adequado. Respondemos em até 2 dias úteis.
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-4">
            {channels.map((c) => (
              <a key={c.label} href={c.href} className="group block bg-card border border-border p-8 hover:border-[var(--copper)] transition-colors">
                <c.icon className="text-[var(--copper)]" size={26} strokeWidth={1.5} />
                <div className="mt-4 eyebrow">{c.label}</div>
                <div className="mt-2 font-display text-xl">{c.value}</div>
                <div className="mt-2 text-sm text-foreground/60">{c.note}</div>
              </a>
            ))}
          </div>

          <div className="mt-20 border-t border-border pt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="font-display text-xl">É representante ou quer ser?</p>
            <Link to="/representantes" className="btn-primary">Acesse a área B2B</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
