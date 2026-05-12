import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoDark from "@/assets/pisoni-logo.png";

const links = [
  { to: "/modelos/c23", label: "C23" },
  { to: "/modelos/p112", label: "P112" },
  { to: "/representantes", label: "Representantes" },
  { to: "/revendedores", label: "Revendedores" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="PISONI — Página inicial" className="flex items-center" onClick={() => setOpen(false)}>
          <img src={logoDark} alt="PISONI Motorcycle Electric" className="h-8 md:h-10 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/representantes" className="btn-primary !py-2 !px-4 text-xs">
            Seja Representante
          </Link>
        </nav>
        <button
          aria-label="Menu"
          className="lg:hidden p-2"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x flex flex-col py-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="py-3 text-base"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/representantes" className="btn-primary mt-3 text-sm" onClick={() => setOpen(false)}>
              Seja Representante
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
