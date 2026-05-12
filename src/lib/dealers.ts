import { supabase } from "@/integrations/supabase/client";

export type Dealer = {
  id: string;
  slug: string;
  city_slug: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  business_hours: string | null;
  published: boolean;
};

export type DealerNear = Pick<
  Dealer,
  "id" | "slug" | "city_slug" | "name" | "city" | "state" | "address" | "phone" | "whatsapp"
> & { distance_km: number };

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

export function isCep(s: string): boolean {
  return onlyDigits(s).length === 8;
}

export function formatCep(s: string): string {
  const d = onlyDigits(s);
  if (d.length !== 8) return s;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** ViaCEP → { city, state, address }; returns null if invalid */
export async function lookupCep(cep: string): Promise<{
  city: string;
  state: string;
  address: string;
} | null> {
  const d = onlyDigits(cep);
  if (d.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data.erro) return null;
    return {
      city: data.localidade ?? "",
      state: data.uf ?? "",
      address: [data.logradouro, data.bairro].filter(Boolean).join(", "),
    };
  } catch {
    return null;
  }
}

/** Nominatim (OpenStreetMap) geocoding from city/state — for CEP search proximity */
export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!r.ok) return null;
    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function listDealers(): Promise<Dealer[]> {
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("published", true)
    .order("state")
    .order("city")
    .order("name");
  if (error) throw error;
  return (data as Dealer[]) ?? [];
}

export async function listDealersByCity(citySlug: string): Promise<Dealer[]> {
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("published", true)
    .eq("city_slug", citySlug)
    .order("name");
  if (error) throw error;
  return (data as Dealer[]) ?? [];
}

export async function getDealer(citySlug: string, slug: string): Promise<Dealer | null> {
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Dealer) ?? null;
}

export async function searchDealersText(q: string): Promise<Dealer[]> {
  const term = q.trim();
  if (!term) return [];
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("published", true)
    .or(`city.ilike.%${term}%,state.ilike.%${term}%,name.ilike.%${term}%`)
    .order("city")
    .limit(20);
  if (error) throw error;
  return (data as Dealer[]) ?? [];
}

export async function dealersNear(lat: number, lng: number, max = 10): Promise<DealerNear[]> {
  const { data, error } = await supabase.rpc("dealers_near", {
    lat,
    lng,
    max_results: max,
  });
  if (error) throw error;
  return (data as DealerNear[]) ?? [];
}

export function whatsappLink(whatsapp: string | null, msg = "Olá! Vim pelo site PISONI."): string | null {
  if (!whatsapp) return null;
  const d = onlyDigits(whatsapp);
  if (!d) return null;
  const num = d.startsWith("55") ? d : `55${d}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
