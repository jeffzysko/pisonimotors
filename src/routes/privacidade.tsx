import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — PISONI" },
      { name: "description", content: "Como a PISONI coleta, utiliza e protege seus dados pessoais em conformidade com a LGPD." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-24 md:py-32 prose-pisoni">
        <div className="eyebrow mb-4">Privacidade</div>
        <h1 className="text-4xl md:text-5xl mb-4 leading-[1.1]">Política de Privacidade</h1>
        <p className="text-sm text-foreground/50 mb-12">
          Última atualização: maio de 2026. Versão preliminar — em revisão jurídica.
        </p>

        <Section title="1. Quem somos">
          <p>
            PISONI Mobilidade Elétrica ("PISONI", "nós") é a controladora dos dados pessoais
            coletados por meio deste site. Sediada em Santa Rosa, Rio Grande do Sul, Brasil.
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>Coletamos os seguintes dados quando você interage com o site, especialmente ao se cadastrar como representante:</p>
          <ul>
            <li>Identificação: nome completo, e-mail, WhatsApp, cidade e estado.</li>
            <li>Quando aplicável (pessoa jurídica): razão social e CNPJ.</li>
            <li>Informações sobre seu negócio: faixa de investimento, ponto comercial, capital de giro, experiência no setor, equipe técnica e motivação.</li>
            <li>Dados técnicos automáticos via analytics agregado (sem identificação pessoal): páginas visitadas, dispositivo, navegador, país. Usamos Plausible Analytics, que não utiliza cookies e não rastreia indivíduos.</li>
          </ul>
        </Section>

        <Section title="3. Para que utilizamos">
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>Avaliar sua candidatura como representante PISONI.</li>
            <li>Entrar em contato sobre sua candidatura, esclarecer dúvidas e conduzir o processo comercial.</li>
            <li>Atender solicitações de imprensa e comerciais.</li>
            <li>Melhorar nosso site e serviços, com base em métricas agregadas.</li>
          </ul>
        </Section>

        <Section title="4. Bases legais (LGPD)">
          <p>O tratamento dos seus dados se baseia em:</p>
          <ul>
            <li><strong>Consentimento</strong> (Art. 7º, I) — manifestado pelo aceite explícito no formulário de cadastro.</li>
            <li><strong>Execução de procedimentos preliminares relativos a contrato</strong> (Art. 7º, V) — quando avaliamos sua candidatura para uma eventual parceria comercial.</li>
            <li><strong>Legítimo interesse</strong> (Art. 7º, IX) — para análise técnica e de adequação do candidato.</li>
          </ul>
        </Section>

        <Section title="5. Com quem compartilhamos">
          <p>
            Seus dados são tratados internamente pela equipe PISONI. Para infraestrutura,
            utilizamos serviços de terceiros que atuam como operadores:
          </p>
          <ul>
            <li><strong>Supabase</strong> — armazenamento seguro do banco de dados.</li>
            <li><strong>Cloudflare</strong> — hospedagem e entrega de conteúdo.</li>
            <li><strong>Plausible Analytics</strong> — métricas agregadas de uso, sem identificação pessoal.</li>
          </ul>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de
            marketing externo.
          </p>
        </Section>

        <Section title="6. Por quanto tempo armazenamos">
          <p>
            Mantemos seus dados pelo período necessário para avaliação da candidatura
            (até 12 meses) e, em caso de aprovação, por todo o período da relação contratual,
            mais o prazo legal de retenção fiscal/contratual aplicável.
          </p>
          <p>
            Você pode solicitar a exclusão a qualquer momento, ressalvadas obrigações legais
            de retenção.
          </p>
        </Section>

        <Section title="7. Seus direitos">
          <p>De acordo com o Art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
          <ul>
            <li>Confirmação da existência de tratamento dos seus dados.</li>
            <li>Acesso aos dados que armazenamos sobre você.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.</li>
            <li>Portabilidade para outro fornecedor.</li>
            <li>Eliminação dos dados pessoais tratados com base no seu consentimento.</li>
            <li>Informação sobre as entidades com quem compartilhamos seus dados.</li>
            <li>Revogação do consentimento.</li>
          </ul>
        </Section>

        <Section title="8. Como exercer seus direitos">
          <p>
            Para exercer qualquer dos direitos acima, ou para tirar dúvidas sobre esta política,
            entre em contato pelo e-mail{" "}
            <a href="mailto:privacidade@pisoni.com.br" className="text-[var(--brand-orange)] underline underline-offset-4">
              privacidade@pisoni.com.br
            </a>
            . Responderemos em até 15 dias.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            Atualmente o site utiliza apenas cookies estritamente necessários ao funcionamento
            (sessão de autenticação no painel administrativo). Não utilizamos cookies de
            rastreamento publicitário ou de terceiros.
          </p>
        </Section>

        <Section title="10. Atualizações desta política">
          <p>
            Podemos atualizar esta política periodicamente. Mudanças significativas serão
            comunicadas com destaque no site. Recomendamos revisitar esta página de tempos em
            tempos.
          </p>
        </Section>

        <Section title="11. Lei aplicável">
          <p>
            Esta política é regida pela legislação brasileira, em especial pela Lei Geral de
            Proteção de Dados Pessoais (Lei nº 13.709/2018).
          </p>
        </Section>

        <div className="mt-16 border-t border-border pt-10 flex flex-wrap items-center gap-6">
          <p className="text-sm text-foreground/60">Tem alguma dúvida sobre como tratamos seus dados?</p>
          <Link to="/contato" className="btn-outline">Fale com a gente</Link>
        </div>
      </article>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-display font-semibold mb-4 mt-2">{title}</h2>
      <div className="space-y-4 text-foreground/80 leading-relaxed [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:marker:text-[var(--brand-blue)] [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
