import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/encontre-um-revendedor")({
  head: () => ({
    meta: [
      { title: "Encontre um Revendedor PISONI" },
      { name: "description", content: "Localize o representante PISONI mais próximo da sua cidade." },
    ],
  }),
  component: RevendedorPage,
});

function RevendedorPage() {
  const [q, setQ] = useState("");

  return (
    <SiteLayout>
      <section className="py-24 md:py-32">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-4">Rede</div>
          <h1 className="text-4xl md:text-6xl">Encontre um revendedor.</h1>
          <p className="mt-6 text-lg text-foreground/70">
            Busque pela sua cidade ou CEP para localizar o representante PISONI mais próximo.
          </p>

          <div className="mt-10 flex items-center gap-3 border-b-2 border-foreground py-3">
            <Search size={20} className="text-foreground/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cidade ou CEP"
              className="flex-1 bg-transparent outline-none text-lg"
            />
          </div>

          <div className="mt-14 border border-dashed border-border p-10 md:p-14 text-center bg-card">
            <MapPin className="mx-auto text-[var(--copper)]" size={32} strokeWidth={1.5} />
            <h2 className="mt-6 font-display text-2xl">
              Estamos expandindo nossa rede.
            </h2>
            <p className="mt-3 text-foreground/70 max-w-md mx-auto">
              Caso não encontre um representante na sua cidade,{" "}
              <Link to="/representantes" className="text-[var(--copper)] underline underline-offset-4 font-medium">
                seja você o primeiro
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
