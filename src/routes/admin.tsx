import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ESTADOS } from "@/lib/representante-schema";
import { SiteLayout } from "@/components/site/Layout";
import { DealersAdmin } from "@/components/site/DealersAdmin";
import { Loader2, LogOut, Download, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — PISONI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Application = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  city: string;
  state: string;
  entity_type: string;
  company_name: string | null;
  cnpj: string | null;
  investment_range: string;
  has_commercial_point: string;
  working_capital: string;
  has_sector_experience: string;
  experience_years: string | null;
  technical_team: string;
  motivation: string;
  lgpd_accepted: boolean;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

const STATUS_COLORS: Record<string, string> = {
  novo: "bg-blue-100 text-blue-800",
  em_contato: "bg-amber-100 text-amber-800",
  aprovado: "bg-green-100 text-green-800",
  recusado: "bg-red-100 text-red-800",
};

const INVESTMENT_LABELS: Record<string, string> = {
  ate_100: "Até R$ 100 mil",
  "100_250": "R$ 100–250 mil",
  "250_500": "R$ 250–500 mil",
  acima_500: "Acima de R$ 500 mil",
};


function AdminPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = (uid: string | null) => {
      if (!uid) { setIsAdmin(false); return; }
      supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle()
        .then(({ data }) => setIsAdmin(!!data));
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      checkRole(uid);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      checkRole(uid);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="container-x py-32 flex justify-center"><Loader2 className="animate-spin" /></div>
      </SiteLayout>
    );
  }

  if (!userId) return <SiteLayout><LoginForm /></SiteLayout>;
  if (!isAdmin) return <SiteLayout><NotAdmin /></SiteLayout>;

  return <SiteLayout><AdminDashboard /></SiteLayout>;
}

function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Cadastro criado. Verifique seu e-mail para confirmar a conta. Depois solicite acesso de admin.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Falha na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-24 max-w-md">
      <div className="eyebrow mb-3">Admin</div>
      <h1 className="text-3xl md:text-4xl mb-8">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      <form onSubmit={submit} className="space-y-5 bg-card border border-border p-8">
        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-2">E-mail</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-[var(--brand-blue)] outline-none py-2.5" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-2">Senha</label>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-[var(--brand-blue)] outline-none py-2.5" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {info && <p className="text-sm text-foreground/70">{info}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-xs text-foreground/60 hover:text-foreground w-full text-center">
          {mode === "login" ? "Criar nova conta" : "Já tenho conta"}
        </button>
      </form>
    </div>
  );
}

function NotAdmin() {
  return (
    <div className="container-x py-24 max-w-md text-center">
      <h1 className="text-3xl mb-4">Acesso restrito</h1>
      <p className="text-foreground/70 mb-8">Sua conta não tem permissão de administrador. Solicite acesso à equipe PISONI.</p>
      <button onClick={() => supabase.auth.signOut()} className="btn-outline">Sair</button>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState<"applications" | "dealers">("applications");
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [investFilter, setInvestFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("representative_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setApps((data as Application[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const { error } = await supabase.from("representative_applications").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
      void load();
    }
  };

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (stateFilter && a.state !== stateFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (investFilter && a.investment_range !== investFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.full_name.toLowerCase().includes(q) &&
          !a.email.toLowerCase().includes(q) &&
          !a.city.toLowerCase().includes(q) &&
          !(a.company_name ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [apps, stateFilter, statusFilter, investFilter, search]);

  const exportCsv = () => {
    const headers = [
      "id","created_at","status","full_name","email","whatsapp","city","state",
      "entity_type","company_name","cnpj","investment_range","has_commercial_point",
      "working_capital","has_sector_experience","experience_years","technical_team","motivation"
    ];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    };
    const rows = filtered.map((a) => headers.map((h) => escape((a as unknown as Record<string, unknown>)[h])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pisoni-cadastros-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-x py-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="eyebrow mb-2">Admin</div>
          <h1 className="text-3xl md:text-4xl">Painel</h1>
        </div>
        <div className="flex gap-3">
          {tab === "applications" && (
            <button onClick={exportCsv} className="btn-outline"><Download size={16} /> Exportar CSV</button>
          )}
          <button onClick={() => supabase.auth.signOut()} className="btn-outline"><LogOut size={16} /> Sair</button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setTab("applications")}
          className={`px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${tab === "applications" ? "border-[var(--brand-blue)] text-foreground" : "border-transparent text-foreground/60 hover:text-foreground"}`}
        >
          Candidaturas ({apps.length})
        </button>
        <button
          onClick={() => setTab("dealers")}
          className={`px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${tab === "dealers" ? "border-[var(--brand-blue)] text-foreground" : "border-transparent text-foreground/60 hover:text-foreground"}`}
        >
          Revendedores
        </button>
      </div>

      {tab === "dealers" ? <DealersAdmin /> : (
      <>
      <p className="text-sm text-foreground/60 mb-4">{filtered.length} de {apps.length} cadastros</p>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-3 mb-6 p-4 bg-secondary/40 border border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input placeholder="Buscar nome, e-mail, cidade…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border pl-9 pr-3 py-2 text-sm" />
        </div>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="bg-background border border-border px-3 py-2 text-sm">
          <option value="">Todos os estados</option>
          {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-background border border-border px-3 py-2 text-sm">
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={investFilter} onChange={(e) => setInvestFilter(e.target.value)} className="bg-background border border-border px-3 py-2 text-sm">
          <option value="">Todas as faixas</option>
          {Object.entries(INVESTMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3">Data</th>
                <th className="px-3 py-3">Nome</th>
                <th className="px-3 py-3">Cidade/UF</th>
                <th className="px-3 py-3">Contato</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Investimento</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-border align-top hover:bg-secondary/30">
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-foreground/60">
                    {new Date(a.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{a.full_name}</div>
                    {a.company_name && <div className="text-xs text-foreground/60">{a.company_name}</div>}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{a.city} / {a.state}</td>
                  <td className="px-3 py-3">
                    <div className="text-xs">{a.email}</div>
                    <div className="text-xs text-foreground/60">{a.whatsapp}</div>
                  </td>
                  <td className="px-3 py-3">{a.entity_type}</td>
                  <td className="px-3 py-3 text-xs">{INVESTMENT_LABELS[a.investment_range] ?? a.investment_range}</td>
                  <td className="px-3 py-3">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      className={`text-xs px-2 py-1 border-0 font-medium ${STATUS_COLORS[a.status] ?? ""}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-12 text-center text-foreground/50">Nenhum cadastro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </>
      )}
    </div>
  );
}
