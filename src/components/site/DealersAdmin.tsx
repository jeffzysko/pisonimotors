import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, MapPin, Save, Eye, EyeOff } from "lucide-react";
import { type Dealer, geocode, lookupCep, slugify } from "@/lib/dealers";

export function DealersAdmin() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Dealer | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dealers")
      .select("*")
      .order("state").order("city").order("name");
    if (error) setError(error.message);
    else setDealers((data as Dealer[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = dealers.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.state.toLowerCase().includes(q);
  });

  const togglePublished = async (d: Dealer) => {
    setDealers((prev) => prev.map((x) => x.id === d.id ? { ...x, published: !x.published } : x));
    const { error } = await supabase.from("dealers").update({ published: !d.published }).eq("id", d.id);
    if (error) { setError(error.message); void load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-display">Revendedores publicados</h2>
          <p className="text-sm text-foreground/60 mt-1">{filtered.length} de {dealers.length} revendedores</p>
        </div>
        <button onClick={() => setEditing({
          id: "", slug: "", city_slug: "", name: "", city: "", state: "",
          address: "", postal_code: "", latitude: null, longitude: null,
          phone: "", whatsapp: "", email: "", business_hours: "", published: true,
        } as Dealer)} className="btn-outline">+ Novo revendedor</button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          placeholder="Buscar por nome ou cidade…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border border-border pl-9 pr-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3">Nome</th>
                <th className="px-3 py-3">Cidade/UF</th>
                <th className="px-3 py-3">Contato</th>
                <th className="px-3 py-3">Geolocaliz.</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-border align-top hover:bg-secondary/30">
                  <td className="px-3 py-3">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-foreground/50">/{d.city_slug}/{d.slug}</div>
                  </td>
                  <td className="px-3 py-3">{d.city} / {d.state}</td>
                  <td className="px-3 py-3 text-xs">
                    {d.whatsapp && <div>{d.whatsapp}</div>}
                    {d.email && <div className="text-foreground/60">{d.email}</div>}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {d.latitude && d.longitude ? (
                      <span className="text-green-600">✓ {d.latitude.toFixed(3)}, {d.longitude.toFixed(3)}</span>
                    ) : (
                      <span className="text-amber-600">Sem coords</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => togglePublished(d)} className="text-xs flex items-center gap-1">
                      {d.published ? <><Eye size={12} className="text-green-600"/> Publicado</> : <><EyeOff size={12} className="text-foreground/40"/> Oculto</>}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => setEditing(d)} className="text-xs text-[var(--brand-blue)] hover:underline">Editar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-foreground/50">Nenhum revendedor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <DealerEditModal
          dealer={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); void load(); }}
        />
      )}
    </div>
  );
}

function DealerEditModal({ dealer, onClose, onSaved }: {
  dealer: Dealer; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !dealer.id;
  const [form, setForm] = useState<Dealer>(dealer);
  const [saving, setSaving] = useState(false);
  const [geo, setGeo] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const set = <K extends keyof Dealer>(k: K, v: Dealer[K]) => setForm((f) => ({ ...f, [k]: v }));

  const geocodeNow = async () => {
    setGeo(true); setErr(null); setInfo(null);
    try {
      let address = form.address ?? "";
      let city = form.city;
      let state = form.state;
      if (form.postal_code) {
        const cep = await lookupCep(form.postal_code);
        if (cep) {
          if (!address) address = cep.address;
          if (!city) city = cep.city;
          if (!state) state = cep.state;
        }
      }
      const q = [address, city, state, "Brasil"].filter(Boolean).join(", ");
      const coords = await geocode(q);
      if (!coords) {
        setErr("Não foi possível geocodificar. Verifique endereço e CEP.");
        return;
      }
      setForm((f) => ({ ...f, latitude: coords.lat, longitude: coords.lng, address, city, state }));
      setInfo(`Coordenadas: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    } finally {
      setGeo(false);
    }
  };

  const save = async () => {
    setSaving(true); setErr(null);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        city_slug: form.city_slug || slugify(form.city),
      };
      if (!payload.name || !payload.city || !payload.state) {
        setErr("Nome, cidade e estado são obrigatórios.");
        return;
      }
      if (isNew) {
        const { id: _id, ...insert } = payload;
        const { error } = await supabase.from("dealers").insert(insert);
        if (error) throw error;
      } else {
        const { id, ...update } = payload;
        const { error } = await supabase.from("dealers").update(update).eq("id", id);
        if (error) throw error;
      }
      onSaved();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-background border border-border max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-xl">{isNew ? "Novo revendedor" : "Editar revendedor"}</h3>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Nome*"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cidade*"><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inp} /></Field>
            <Field label="Estado* (UF)"><input value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase())} maxLength={2} className={inp} /></Field>
          </div>
          <Field label="Endereço"><input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CEP"><input value={form.postal_code ?? ""} onChange={(e) => set("postal_code", e.target.value)} className={inp} /></Field>
            <div className="flex items-end">
              <button type="button" onClick={geocodeNow} disabled={geo} className="btn-outline w-full">
                {geo ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />} Geocodificar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefone"><input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className={inp} /></Field>
            <Field label="WhatsApp"><input value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} className={inp} /></Field>
          </div>
          <Field label="E-mail"><input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} className={inp} /></Field>
          <Field label="Horários de atendimento">
            <textarea value={form.business_hours ?? ""} onChange={(e) => set("business_hours", e.target.value)} rows={3} className={inp + " resize-y"} />
          </Field>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Field label="Latitude"><input value={form.latitude ?? ""} onChange={(e) => set("latitude", e.target.value ? parseFloat(e.target.value) : null)} className={inp} /></Field>
            <Field label="Longitude"><input value={form.longitude ?? ""} onChange={(e) => set("longitude", e.target.value ? parseFloat(e.target.value) : null)} className={inp} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            Publicado (visível no site)
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {info && <p className="text-sm text-green-600">{info}</p>}
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full bg-background border border-border px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
