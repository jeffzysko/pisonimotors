import { z } from "zod";

export const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
] as const;

export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

export const maskCNPJ = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const req = (msg = "Campo obrigatório") => z.string().trim().min(1, msg);

export const step1Schema = z.object({
  full_name: req("Informe seu nome completo").max(120),
  email: z.string().trim().email("E-mail inválido").max(160),
  whatsapp: req("Informe seu WhatsApp").min(14, "WhatsApp incompleto").max(20),
  city: req("Informe a cidade").max(80),
  state: req("Selecione o estado"),
  entity_type: z.enum(["PF", "PJ"]),
  company_name: z.string().trim().max(160).optional().or(z.literal("")),
  cnpj: z.string().trim().max(20).optional().or(z.literal("")),
}).refine(
  (d) => d.entity_type === "PF" || (d.company_name && d.company_name.length >= 2),
  { path: ["company_name"], message: "Informe a razão social" }
).refine(
  (d) => d.entity_type === "PF" || (d.cnpj && d.cnpj.replace(/\D/g, "").length === 14),
  { path: ["cnpj"], message: "CNPJ incompleto" }
);

export const step2Schema = z.object({
  investment_range: req("Selecione uma faixa"),
  has_commercial_point: req("Selecione uma opção"),
  working_capital: req("Selecione uma opção"),
});

export const step3Schema = z.object({
  has_sector_experience: req("Selecione uma opção"),
  experience_years: z.string().optional(),
  technical_team: req("Selecione uma opção"),
  motivation: z.string().trim().min(20, "Conte um pouco mais (mín. 20 caracteres)").max(500),
  lgpd_accepted: z.boolean().refine((v) => v === true, { message: "É necessário aceitar para continuar" }),
}).refine(
  (d) => d.has_sector_experience === "nao" || (d.experience_years && d.experience_years.length > 0),
  { path: ["experience_years"], message: "Informe há quanto tempo" }
);
