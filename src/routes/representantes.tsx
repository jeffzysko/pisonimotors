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
  { n: "01", icon: FileSignature, title: "Você se cadastra", text: "Conte sobre você, sua cidade e seu plano de negócio." },
  { n: "02", icon: Compass, title: "Avaliamos juntos", text: "Nosso time entra em contato em até 5 dias úteis para uma conversa." },
  { n: "03", icon: MapPin, title: "Exclusividade territorial", text: "Aprovado, você se torna o único representante PISONI da sua cidade." },
  { n: "04", icon: Headset, title: "Leads e suporte", text: "Marketing nacional, treinamento, peças e leads da sua região direto no seu WhatsApp." },
];

const benefits = [
  { icon: MapPin, title: "Exclusividade territorial garantida em contrato" },
  { icon: BarChart3, title: "Leads qualificados gerados pelo site nacional" },
  { icon: GraduationCap, title: "Treinamento técnico e comercial" },
  { icon: Wrench, title: "Margem competitiva" },
  { icon: Megaphone, title: "Suporte de marketing e comunicação local" },
  { icon: Package, title: "Pronto suporte em peças e assistência" },
];

const expectations = [
  "Capital para estoque inicial e ponto comercial",
  "Capacidade de prestar assistência técnica (própria ou terceirizada)",
  "Comprometimento com a experiência da marca PISONI",
  "Conhecimento do mercado local",
];

const faq = [
  { q: "Qual o investimento inicial estimado?", a: "Varia conforme a praça e o modelo de operação. Trabalhamos com faixas a partir de R$ 100 mil. No primeiro contato, alinhamos cenários adequados à sua cidade." },
  { q: "Preciso ter ponto comercial físico?", a: "Não obrigatoriamente. Aceitamos modelos como showroom com agendamento, desde que haja capacidade de exposição e atendimento à altura da marca." },
  { q: "Como funciona a exclusividade territorial?", a: "Cada cidade tem um único representante PISONI, formalizado em contrato. Todos os leads e ações de marketing da sua região são direcionados a você." },
  { q: "Quanto tempo até começar a operar?", a: "Após aprovação e assinatura do contrato, o setup completo costuma levar de 60 a 90 dias — incluindo treinamento, primeiro pedido de estoque e ativação de marketing." },
  { q: "PISONI vende direto ao consumidor?", a: "Não. A PISONI não compete com seus representantes. Toda venda final acontece pela rede autorizada na cidade do cliente." },
  { q: "Já existe representante na minha cidade?", a: "Cadastre-se mesmo assim. Se a praça já estiver ocupada, retornamos com cidades vizinhas disponíveis ou mantemos seu cadastro como prioridade caso ela abra." },
];

function RepresentantesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-x py-24 md:py-36">
          <div className="eyebrow text-[var(--brand-blue)] mb-4">Rede de Representantes</div>
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
                <div className="font-display text-sm text-[var(--brand-blue)] tracking-widest">{s.n}</div>
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
                  <b.icon className="text-[var(--brand-blue)] shrink-0 mt-1" size={22} strokeWidth={1.5} />
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
