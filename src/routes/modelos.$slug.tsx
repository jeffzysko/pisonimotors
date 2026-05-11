import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { MODELS, type ModelSlug } from "@/lib/models-data";
import { ArrowUpRight } from "lucide-react";

const isModelSlug = (s: string): s is ModelSlug => s === "c23" || s === "p112";

export const Route = createFileRoute("/modelos/$slug")({
  beforeLoad: ({ params }) => {
    if (!isModelSlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    if (!isModelSlug(params.slug)) return { meta: [{ title: "Modelo não encontrado — PISONI" }] };
    const m = MODELS[params.slug];
    return {
      meta: [
        { title: `${m.name} — ${m.tagline}` },
        { name: "description", content: m.intro },
        { property: "og:title", content: m.name },
        { property: "og:description", content: m.tagline },
        { property: "og:image", content: m.image },
      ],
    };
  },
  component: ModelPage,
});

function ModelPage() {
  const { slug } = Route.useParams();
  if (!isModelSlug(slug)) return null;
  const m = MODELS[slug];
  const [activeColor, setActiveColor] = useState(0);
  const heroImg = m.colors?.[activeColor]?.image ?? m.image;
  const gallery = m.gallery ?? [m.image, m.image, m.image, m.image, m.image];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-secondary">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-end pt-20 pb-12 lg:pt-28 lg:pb-20">
          <div>
            <div className="eyebrow mb-4">Modelo</div>
            <h1 className="text-6xl md:text-8xl leading-none">{m.name}</h1>
            <p className="mt-8 max-w-md text-lg text-foreground/70">{m.tagline}</p>
            {m.colors && (
              <div className="mt-10">
                <div className="eyebrow mb-3">Cores</div>
                <div className="flex items-center gap-3">
                  {m.colors.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveColor(i)}
                      aria-label={c.name}
                      aria-pressed={activeColor === i}
                      className={`h-9 w-9 rounded-full border transition-all ${activeColor === i ? "ring-2 ring-[var(--copper)] ring-offset-2 ring-offset-secondary" : "border-foreground/20 hover:border-foreground/40"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <span className="ml-2 font-display text-sm text-foreground/70">{m.colors[activeColor].name}</span>
                </div>
              </div>
            )}
          </div>
          <div className="aspect-[4/3] bg-card overflow-hidden">
            <img src={heroImg} alt={`${m.name} — ${m.colors?.[activeColor]?.name ?? ""}`} width={1280} height={1024} className="h-full w-full object-contain transition-opacity duration-300" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24">
        <div className="container-x max-w-4xl">
          <p className="font-display text-2xl md:text-3xl leading-snug">{m.intro}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-24">
        <div className="container-x grid grid-cols-2 md:grid-cols-3 gap-3">
          {gallery.slice(0, 5).map((src, i) => (
            <div key={i} className={`bg-secondary overflow-hidden ${i === 0 ? "col-span-2 md:col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <img src={src} alt={`${m.name} – foto ${i + 1}`} loading="lazy" className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="py-24 bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-x">
          <div className="eyebrow text-[var(--copper)] mb-3">Ficha técnica</div>
          <h2 className="text-3xl md:text-5xl">Cada número, uma escolha.</h2>
          <div className="mt-12 max-w-3xl">
            {m.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-6 py-5 border-b border-white/15">
                <div className="text-white/60 font-display uppercase tracking-wider text-xs md:text-sm">{s.label}</div>
                <div className="text-base md:text-lg font-display font-medium">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design */}
      <section className="py-24">
        <div className="container-x">
          <div className="eyebrow mb-3">Design</div>
          <h2 className="text-3xl md:text-5xl max-w-2xl">Forma é função.</h2>
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {m.design.map((d) => (
              <div key={d.title} className="border-t border-border pt-6">
                <h3 className="font-display text-xl font-semibold">{d.title}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-x">
          <div className="eyebrow mb-3">Tecnologia</div>
          <h2 className="text-3xl md:text-5xl max-w-2xl">Inteligência discreta.</h2>
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {m.tech.map((d) => (
              <div key={d.title} className="border-t border-border pt-6">
                <h3 className="font-display text-xl font-semibold">{d.title}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-24">
        <div className="container-x grid md:grid-cols-2 gap-6">
          <Link to="/encontre-um-revendedor" className="group block bg-[var(--ink)] text-[var(--paper)] p-10 md:p-14">
            <div className="eyebrow text-[var(--copper)]">Compra</div>
            <h3 className="mt-4 text-2xl md:text-3xl">Encontre o revendedor PISONI mais próximo</h3>
            <div className="mt-8 inline-flex items-center gap-2 text-[var(--copper)] font-display">
              Buscar revendedor <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </Link>
          <Link to="/representantes" className="group block bg-card border border-border p-10 md:p-14">
            <div className="eyebrow">Negócio</div>
            <h3 className="mt-4 text-2xl md:text-3xl">Não há revendedor na sua cidade? Seja o primeiro.</h3>
            <div className="mt-8 inline-flex items-center gap-2 text-[var(--copper)] font-display">
              Quero representar <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
