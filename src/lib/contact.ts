// Single source of truth for PISONI contact channels.
// Update here and all pages reflect automatically.

export const CONTACT = {
  commercial: {
    email: "comercial@pisoni.com.br",
    label: "Comercial / B2B",
    note: "Para representantes e revendedores.",
  },
  general: {
    email: "contato@pisoni.com.br",
    label: "Atendimento",
    note: "Dúvidas gerais sobre produtos.",
  },
  press: {
    email: "imprensa@pisoni.com.br",
    label: "Imprensa",
    note: "Solicitações de mídia e materiais.",
  },
  privacy: {
    email: "privacidade@pisoni.com.br",
    label: "Privacidade / DPO",
    note: "Solicitações relacionadas a dados pessoais (LGPD).",
  },
  whatsapp: {
    // Numero internacional no formato wa.me (apenas dígitos, com código do país).
    number: "+55 11 90000-0000",
    waNumber: "5511900000000",
    label: "WhatsApp",
    note: "Atendimento 9h às 18h, dias úteis.",
  },
} as const;

export const whatsappUrl = (number: string = CONTACT.whatsapp.waNumber) =>
  `https://wa.me/${number.replace(/\D/g, "")}`;
