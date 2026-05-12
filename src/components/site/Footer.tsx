import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import logoLight from "@/assets/pisoni-logo-white.png";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="container-x py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logoLight} alt="PISONI Motorcycle Electric" className="h-10 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Mobilidade elétrica premium. Design autoral, tecnologia silenciosa, presença urbana.
          </p>
          <p className="mt-2 max-w-sm text-xs text-white/40">
            Projetada e fabricada em Santa Rosa, Rio Grande do Sul.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-white/60 hover:text-[var(--brand-blue)] transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="text-white/60 hover:text-[var(--brand-blue)] transition-colors"><Linkedin size={20} /></a>
            <a href="#" aria-label="YouTube" className="text-white/60 hover:text-[var(--brand-blue)] transition-colors"><Youtube size={20} /></a>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-4">Marca</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="text-white/70 hover:text-white">Sobre</Link></li>
            <li><Link to="/modelos/c23" className="text-white/70 hover:text-white">C23</Link></li>
            <li><Link to="/modelos/p112" className="text-white/70 hover:text-white">P112</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Contato</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/representantes" className="hover:text-white">Comercial / B2B</Link></li>
            <li><Link to="/encontre-um-revendedor" className="hover:text-white">Encontrar revendedor</Link></li>
            <li><a href="mailto:imprensa@pisoni.com.br" className="hover:text-white">Imprensa</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} PISONI Mobilidade Elétrica. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
