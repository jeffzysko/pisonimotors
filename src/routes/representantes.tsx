import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { RepresentanteForm } from "@/components/site/RepresentanteForm";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, FileSignature, Compass, Headset, Wrench, BarChart3, GraduationCap, Megaphone, Package } from "lucide-react";

export const Route = createFileRoute("/representantes")({
  head: () => ({
    meta: [
      { title: "Seja Representante PISONI — Mobilidade elétrica" },
      { name: "description", content: "Represente a PISONI na sua cidade. Exclusividade territorial, leads qualificados e suporte completo." },
      { property: "og:title", content: "Seja Representante PISONI" },
      { property: "og:description", content: "Cada cidade, um representante. Cada lead da sua região, direto para você." },
    ],
  }),
  component: RepresentantesPage,
});

const steps = [
  { n: "01", icon: FileSignature, title: "Você se cadastra", text: "Preenche o formulário com seus dados, capacidade e experiência." },
  { n: "02", icon: Compass, title: "Avaliamos juntos", text: "Nosso time comercial avalia o fit estratégico para a sua região." },
  { n: "03", icon: MapPin, title: "Exclusividade territorial", text: "Contrato com exclusividade na sua cidade, formalizado por escrito." },
  { n: "04", icon: Headset, title: "Leads e suporte", text: "Você passa a receber leads qualificados e suporte completo." },
];

const benefits = [
  { icon: MapPin, title: "Exclusividade territorial em contrato" },
  { icon: BarChart3, title: "Leads qualificados do site nacional" },
  { icon: GraduationCap, title: "Treinamento técnico e comercial" },
  { icon: Wrench, title: "Margem competitiva" },
  { icon: Megaphone, title: "Suporte de marketing" },
  { icon: Package, title: "Peças e assistência" },
];

const expectations = [
  "Capital para estoque inicial",
  "Capacidade de assistência técnica",
  "Comprometimento com a marca",
  "Conhecimento do mercado local",
];

const faq = [
  { q: "Quanto preciso investir?", a: "O investimento varia conforme a praça e o modelo de operação. Trabalhamos com faixas a partir de R$ 100 mil. No nosso primeiro contato, alinhamos cenários adequados à sua cidade." },
  { q: "Como funciona a exclusividade territorial?", a: "Cada cidade tem um único representante PISONI. Isso é formalizado em contrato, garantindo que todos os leads e ações de marketing da sua região sejam direcionados para você." },
  { q: "Preciso ter experiência no setor?", a: "Não é obrigatório, mas é desejável. Buscamos parceiros com perfil empreendedor, conhecimento do mercado local e capacidade de operar assistência técnica." },
  { q: "Vocês fornecem treinamento?", a: "Sim. Oferecemos treinamento técnico e comercial completo, presencial e remoto, antes da abertura da operação e de forma contínua." },
  { q: "Como recebo os leads?", a: "Todos os leads gerados pelo site nacional para a sua cidade chegam diretamente ao seu CRM e WhatsApp comercial, em tempo real." },
  { q: "Em quanto tempo a operação começa?", a: "Após aprovação e assinatura do contrato, o setup completo costuma levar de 60 a 90 dias, incluindo treinamento, primeiro pedido de estoque e ativação de marketing." },
];

function RepresentantesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-x py-24 md:py-36">
          <div className="eyebrow text-[var(--copper)] mb-4">Rede de Representantes</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.05]">
            Represente a PISONI na sua cidade.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-white/70">
            Você não vende sozinho. Cada interessado da sua região vem direto para você.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24">
        <div className="container-x">
          <div className="eyebrow mb-3">Como funciona</div>
          <h2 className="text-3xl md:text-5xl max-w-2xl">Quatro passos. Um parceiro por cidade.</h2>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="border-t border-border pt-6">
                <div className="font-display text-sm text-[var(--copper)] tracking-widest">{s.n}</div>
                <s.icon className="mt-4" size={26} strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Expectations */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-x grid lg:grid-cols-2 gap-16">
          <div>
            <div className="eyebrow mb-3">O que oferecemos</div>
            <h2 className="text-3xl md:text-4xl">Estrutura para você crescer.</h2>
            <ul className="mt-10 grid sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <b.icon className="text-[var(--copper)] shrink-0 mt-1" size={22} strokeWidth={1.5} />
                  <span className="font-display font-medium">{b.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-3">O que esperamos</div>
            <h2 className="text-3xl md:text-4xl">Parceria de verdade.</h2>
            <ul className="mt-10 space-y-4">
              {expectations.map((e) => (
                <li key={e} className="border-b border-border pb-4 font-display text-lg">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-3">Cadastro</div>
          <h2 className="text-3xl md:text-5xl mb-10">Comece sua candidatura.</h2>
          <RepresentanteForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-3">FAQ</div>
          <h2 className="text-3xl md:text-5xl mb-10">Dúvidas frequentes.</h2>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}
