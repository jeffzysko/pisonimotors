import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ESTADOS, maskPhone, maskCNPJ, step1Schema, step2Schema, step3Schema } from "@/lib/representante-schema";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

type Errors = Record<string, string>;

const initial = {
  full_name: "", email: "", whatsapp: "", city: "", state: "",
  entity_type: "PF" as "PF" | "PJ", company_name: "", cnpj: "",
  investment_range: "", has_commercial_point: "", working_capital: "",
  has_sector_experience: "", experience_years: "", technical_team: "",
  motivation: "", lgpd_accepted: false,
};

const labelCls = "block text-xs font-display uppercase tracking-wider text-foreground/60 mb-2";
const inputCls = "w-full bg-transparent border-b border-border focus:border-[var(--copper)] outline-none py-2.5 text-base transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options, error, columns = 1 }: {
  name: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; error?: string; columns?: number;
}) {
  return (
    <div>
      <div className={`grid gap-3 ${columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-2 lg:grid-cols-4" : ""}`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-all ${active ? "border-[var(--copper)] bg-[var(--copper)]/5" : "border-border hover:border-foreground/40"}`}
            >
              <input type="radio" name={name} value={o.value} checked={active} onChange={() => onChange(o.value)} className="sr-only" />
              <span className={`size-4 rounded-full border-2 ${active ? "border-[var(--copper)] bg-[var(--copper)]" : "border-foreground/40"}`} />
              <span className="text-sm">{o.label}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function RepresentanteForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const validate = (schema: typeof step1Schema | typeof step2Schema | typeof step3Schema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Errors = {};
      for (const issue of result.error.issues) errs[issue.path.join(".")] = issue.message;
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    const schema = step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema;
    if (!validate(schema)) return;
    if (step < 3) {
      setDirection("forward");
      setStep(step + 1);
    } else void submit();
  };

  const back = () => {
    setDirection("back");
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("representative_applications").insert({
        full_name: data.full_name,
        email: data.email,
        whatsapp: data.whatsapp,
        city: data.city,
        state: data.state,
        entity_type: data.entity_type,
        company_name: data.entity_type === "PJ" ? data.company_name : null,
        cnpj: data.entity_type === "PJ" ? data.cnpj : null,
        investment_range: data.investment_range,
        has_commercial_point: data.has_commercial_point,
        working_capital: data.working_capital,
        has_sector_experience: data.has_sector_experience,
        experience_years: data.has_sector_experience === "sim" ? data.experience_years : null,
        technical_team: data.technical_team,
        motivation: data.motivation,
        lgpd_accepted: data.lgpd_accepted,
      });
      if (error) throw error;
      setDone(true);
    } catch (e) {
      console.error(e);
      setErrors({ form: "Não foi possível enviar agora. Tente novamente em instantes." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-card border border-border p-10 md:p-14 text-center">
        <div className="mx-auto size-14 grid place-items-center rounded-full bg-[var(--copper)] text-[var(--copper-foreground)]">
          <Check size={28} />
        </div>
        <h3 className="mt-6 text-2xl md:text-3xl">Recebemos seu cadastro.</h3>
        <p className="mt-4 text-foreground/70 max-w-lg mx-auto">
          Em até 5 dias úteis, nosso time comercial entrará em contato pelo WhatsApp informado.
          Bem-vindo à rede PISONI.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border">
      {/* Progress */}
      <div className="px-6 md:px-10 pt-8">
        <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider">
          <span className="text-foreground/60">Etapa {step} / 3</span>
          <span className="text-foreground/60">{step === 1 ? "Dados básicos" : step === 2 ? "Investimento" : "Experiência"}</span>
        </div>
        <div className="mt-3 h-[2px] bg-border overflow-hidden">
          <div className="h-full bg-[var(--copper)] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <div className="p-6 md:p-10 overflow-hidden">
        <div
          key={step}
          className="space-y-8"
          style={{
            animation: `${direction === "forward" ? "step-slide-in-right" : "step-slide-in-left"} 320ms cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}
        >
        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Nome completo *" error={errors.full_name}>
                <input className={inputCls} value={data.full_name} onChange={(e) => set("full_name", e.target.value)} />
              </Field>
              <Field label="E-mail *" error={errors.email}>
                <input type="email" className={inputCls} value={data.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="WhatsApp *" error={errors.whatsapp}>
                <input className={inputCls} placeholder="(00) 00000-0000" value={data.whatsapp} onChange={(e) => set("whatsapp", maskPhone(e.target.value))} />
              </Field>
              <Field label="Cidade *" error={errors.city}>
                <input className={inputCls} value={data.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label="Estado *" error={errors.state}>
                <select className={inputCls} value={data.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Selecione…</option>
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Pessoa *">
                <RadioGroup name="entity_type" value={data.entity_type} onChange={(v) => set("entity_type", v as "PF" | "PJ")}
                  options={[{ value: "PF", label: "Pessoa física" }, { value: "PJ", label: "Pessoa jurídica" }]} columns={2} />
              </Field>
            </div>
            {data.entity_type === "PJ" && (
              <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-border">
                <Field label="Razão social *" error={errors.company_name}>
                  <input className={inputCls} value={data.company_name} onChange={(e) => set("company_name", e.target.value)} />
                </Field>
                <Field label="CNPJ *" error={errors.cnpj}>
                  <input className={inputCls} placeholder="00.000.000/0000-00" value={data.cnpj} onChange={(e) => set("cnpj", maskCNPJ(e.target.value))} />
                </Field>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Faixa de investimento disponível *" error={errors.investment_range}>
              <RadioGroup name="investment_range" value={data.investment_range} onChange={(v) => set("investment_range", v)}
                columns={2}
                options={[
                  { value: "ate_100", label: "Até R$ 100 mil" },
                  { value: "100_250", label: "R$ 100–250 mil" },
                  { value: "250_500", label: "R$ 250–500 mil" },
                  { value: "acima_500", label: "Acima de R$ 500 mil" },
                ]} />
            </Field>
            <Field label="Possui ponto comercial? *" error={errors.has_commercial_point}>
              <RadioGroup name="has_commercial_point" value={data.has_commercial_point} onChange={(v) => set("has_commercial_point", v)}
                columns={2}
                options={[
                  { value: "proprio", label: "Sim, próprio" },
                  { value: "alugado", label: "Sim, alugado" },
                  { value: "planejo", label: "Não, mas planejo abrir" },
                  { value: "showroom", label: "Showroom ou agendamento" },
                ]} />
            </Field>
            <Field label="Capital de giro além do investimento inicial? *" error={errors.working_capital}>
              <RadioGroup name="working_capital" value={data.working_capital} onChange={(v) => set("working_capital", v)}
                columns={2}
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                  { value: "avaliacao", label: "Em avaliação" },
                ]} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Já atua com motos, scooters ou veículos elétricos? *" error={errors.has_sector_experience}>
              <RadioGroup name="has_sector_experience" value={data.has_sector_experience} onChange={(v) => set("has_sector_experience", v)}
                columns={2}
                options={[{ value: "sim", label: "Sim" }, { value: "nao", label: "Não" }]} />
            </Field>
            {data.has_sector_experience === "sim" && (
              <Field label="Há quanto tempo? *" error={errors.experience_years}>
                <select className={inputCls} value={data.experience_years} onChange={(e) => set("experience_years", e.target.value)}>
                  <option value="">Selecione…</option>
                  <option value="menos_1">Menos de 1 ano</option>
                  <option value="1_3">1 a 3 anos</option>
                  <option value="3_5">3 a 5 anos</option>
                  <option value="5_10">5 a 10 anos</option>
                  <option value="mais_10">Mais de 10 anos</option>
                </select>
              </Field>
            )}
            <Field label="Equipe técnica para manutenção *" error={errors.technical_team}>
              <RadioGroup name="technical_team" value={data.technical_team} onChange={(v) => set("technical_team", v)}
                columns={2}
                options={[
                  { value: "propria", label: "Sim, equipe própria" },
                  { value: "parceria", label: "Sim, parceria com oficina" },
                  { value: "contratar", label: "Não, pretendo contratar" },
                  { value: "indefinido", label: "Ainda não defini" },
                ]} />
            </Field>
            <Field label={`Por que quer representar a PISONI? * (${data.motivation.length}/500)`} error={errors.motivation}>
              <textarea
                className={`${inputCls} resize-none border border-border rounded-none focus:border-[var(--copper)] p-3`}
                rows={5} maxLength={500}
                value={data.motivation}
                onChange={(e) => set("motivation", e.target.value)} />
            </Field>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 size-4 accent-[var(--copper)]"
                checked={data.lgpd_accepted}
                onChange={(e) => set("lgpd_accepted", e.target.checked)} />
              <span className="text-sm text-foreground/70">
                Autorizo o tratamento dos meus dados pela PISONI conforme a LGPD para fins de avaliação desta candidatura. *
              </span>
            </label>
            {errors.lgpd_accepted && <p className="text-xs text-destructive -mt-4">{errors.lgpd_accepted}</p>}
          </>
        )}

        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
        </div>

        <div className="flex items-center justify-between pt-6 mt-2 border-t border-border">
          <button
            type="button"
            onClick={back}
            disabled={step === 1 || submitting}
            className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <button type="button" onClick={next} disabled={submitting} className="btn-primary disabled:opacity-70 disabled:cursor-wait">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Enviando…
              </>
            ) : step < 3 ? (
              <>Próximo <ArrowRight size={16} /></>
            ) : (
              <>Enviar cadastro <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
