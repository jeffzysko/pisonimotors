import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — PISONI" },
      { name: "description", content: "Termos e condições de uso do site PISONI." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-24 md:py-32">
        <div className="eyebrow mb-4">Termos</div>
        <h1 className="text-4xl md:text-5xl mb-4 leading-[1.1]">Termos de Uso</h1>
        <p className="text-sm text-foreground/50 mb-12">
          Última atualização: maio de 2026. Versão preliminar — em revisão jurídica.
        </p>

        <Section title="1. Aceitação dos termos">
          <p>
            Ao acessar e utilizar o site da PISONI Mobilidade Elétrica, você concorda com estes
            Termos de Uso e com nossa{" "}
            <Link to="/privacidade" className="text-[var(--brand-orange)] underline underline-offset-4">
              Política de Privacidade
            </Link>
            . Se você não concorda com qualquer parte destes termos, por favor não utilize o site.
          </p>
        </Section>

        <Section title="2. Sobre o site">
          <p>
            Este site é mantido pela PISONI Mobilidade Elétrica, com sede em Santa Rosa, Rio
            Grande do Sul, Brasil. Tem por finalidade apresentar a marca, seus modelos de
            scooters e motos elétricas, e captar candidaturas para a rede de representantes
            autorizados.
          </p>
          <p>
            O site não realiza vendas diretas ao consumidor final. Toda comercialização ocorre
            por meio da rede de representantes locais.
          </p>
        </Section>

        <Section title="3. Propriedade intelectual">
          <p>
            Todo o conteúdo deste site — incluindo marca, logotipo, textos, imagens, vídeos,
            código-fonte e design — é de propriedade da PISONI ou de seus licenciadores e está
            protegido pelas leis brasileiras e internacionais de propriedade intelectual.
          </p>
          <p>
            É vedada a reprodução, distribuição, modificação ou uso comercial sem autorização
            prévia e por escrito.
          </p>
        </Section>

        <Section title="4. Conduta do usuário">
          <p>Ao utilizar o site, você concorda em:</p>
          <ul>
            <li>Fornecer informações verdadeiras, exatas e atualizadas.</li>
            <li>Não utilizar o site para fins ilegais, fraudulentos ou que possam prejudicar terceiros.</li>
            <li>Não tentar acessar áreas restritas (como o painel administrativo) sem autorização.</li>
            <li>Não interferir no funcionamento do site por meio de tentativas de invasão, scraping massivo ou ataques de qualquer natureza.</li>
          </ul>
        </Section>

        <Section title="5. Cadastro de representantes">
          <p>
            O envio do formulário de cadastro de representante não gera, por si só, qualquer
            vínculo contratual ou direito de exclusividade. Trata-se de manifestação de
            interesse, sujeita a análise da PISONI.
          </p>
          <p>
            A PISONI se reserva o direito de aprovar ou recusar candidaturas a seu critério,
            sem obrigação de justificativa.
          </p>
        </Section>

        <Section title="6. Limitação de responsabilidade">
          <p>
            O site é fornecido "como está". A PISONI envida esforços para manter as informações
            atualizadas e corretas, mas não garante que o conteúdo esteja livre de erros
            tipográficos, omissões ou desatualizações.
          </p>
          <p>
            Especificações técnicas dos produtos podem ser alteradas sem aviso prévio. Para
            informações definitivas sobre produto, consulte um representante autorizado.
          </p>
        </Section>

        <Section title="7. Links externos">
          <p>
            O site pode conter links para sites de terceiros. A PISONI não controla esses sites
            e não se responsabiliza por seu conteúdo, política de privacidade ou práticas.
          </p>
        </Section>

        <Section title="8. Modificações dos termos">
          <p>
            A PISONI pode modificar estes Termos a qualquer momento. Modificações entram em
            vigor imediatamente após a publicação no site. O uso continuado do site após
            alterações implica aceitação dos novos termos.
          </p>
        </Section>

        <Section title="9. Lei aplicável e foro">
          <p>
            Estes Termos são regidos pela legislação brasileira. Qualquer disputa decorrente
            dos termos ou do uso do site será dirimida no foro da comarca de Santa Rosa, Rio
            Grande do Sul, com renúncia expressa a qualquer outro, por mais privilegiado que
            seja.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>
            Dúvidas sobre estes Termos podem ser enviadas para{" "}
            <a href="mailto:contato@pisoni.com.br" className="text-[var(--brand-orange)] underline underline-offset-4">
              contato@pisoni.com.br
            </a>
            .
          </p>
        </Section>

        <div className="mt-16 border-t border-border pt-10 flex flex-wrap items-center gap-6">
          <p className="text-sm text-foreground/60">Quer falar sobre algo específico?</p>
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
      <div className="space-y-4 text-foreground/80 leading-relaxed [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:marker:text-[var(--brand-blue)] [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </section>
  );
}
