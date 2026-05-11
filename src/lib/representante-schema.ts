import { z } from "zod";

export const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
] as const;

export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
    [a && `(${a}`, a.length === 2 ? ") " : "", b, c && `-${c}`].filter(Boolean).join(""));
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
};

export const maskCNPJ = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const step1Schema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome completo").max(120),
  email: z.string().trim().email("E-mail inválido").max(160),
  whatsapp: z.string().trim().min(14, "WhatsApp incompleto").max(20),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  state: z.enum(ESTADOS, { message: "Selecione o estado" }),
  entity_type: z.enum(["PF", "PJ"]),
  company_name: z.string().trim().max(160).optional(),
  cnpj: z.string().trim().max(20).optional(),
}).refine(
  (d) => d.entity_type === "PF" || (d.company_name && d.company_name.length >= 2),
  { path: ["company_name"], message: "Informe a razão social" }
).refine(
  (d) => d.entity_type === "PF" || (d.cnpj && d.cnpj.replace(/\D/g, "").length === 14),
  { path: ["cnpj"], message: "CNPJ incompleto" }
);

export const step2Schema = z.object({
  investment_range: z.enum(["ate_100", "100_250", "250_500", "acima_500"], { message: "Selecione uma faixa" }),
  has_commercial_point: z.enum(["proprio", "alugado", "planejo", "showroom"], { message: "Selecione uma opção" }),
  working_capital: z.enum(["sim", "nao", "avaliacao"], { message: "Selecione uma opção" }),
});

export const step3Schema = z.object({
  has_sector_experience: z.enum(["sim", "nao"], { message: "Selecione uma opção" }),
  experience_years: z.string().optional(),
  technical_team: z.enum(["propria", "parceria", "contratar", "indefinido"], { message: "Selecione uma opção" }),
  motivation: z.string().trim().min(20, "Conte um pouco mais (mín. 20 caracteres)").max(500),
  lgpd_accepted: z.literal(true, { message: "É necessário aceitar para continuar" }),
}).refine(
  (d) => d.has_sector_experience === "nao" || (d.experience_years && d.experience_years.length > 0),
  { path: ["experience_years"], message: "Informe há quanto tempo" }
);

export const fullSchema = step1Schema.and(step2Schema).and(step3Schema);
export type FullForm = z.infer<typeof fullSchema>;
