
-- Tabela de revendedores publicados
CREATE TABLE public.dealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.representative_applications(id) ON DELETE SET NULL,
  slug text NOT NULL,
  city_slug text NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  address text,
  postal_code text,
  latitude double precision,
  longitude double precision,
  phone text,
  whatsapp text,
  email text,
  business_hours text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (city_slug, slug)
);

CREATE INDEX dealers_city_slug_idx ON public.dealers(city_slug);
CREATE INDEX dealers_state_idx ON public.dealers(state);
CREATE INDEX dealers_published_idx ON public.dealers(published);

ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

-- Leitura pública dos revendedores publicados
CREATE POLICY "Public can read published dealers"
  ON public.dealers FOR SELECT
  TO anon, authenticated
  USING (published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert dealers"
  ON public.dealers FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dealers"
  ON public.dealers FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dealers"
  ON public.dealers FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Função de slug (remove acentos, mantém alfanumérico e hífen)
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT regexp_replace(
    regexp_replace(
      lower(translate(
        coalesce(input, ''),
        'áàâãäåéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÅÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
        'aaaaaaeeeeiiiiooooouuuucnaaaaaaeeeeiiiiooooouuuucn'
      )),
      '[^a-z0-9]+', '-', 'g'
    ),
    '(^-+|-+$)', '', 'g'
  )
$$;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER dealers_set_updated_at
  BEFORE UPDATE ON public.dealers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-publica revendedor quando a candidatura é aprovada
CREATE OR REPLACE FUNCTION public.auto_publish_approved_dealer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_city_slug text;
  v_base_slug text;
  v_slug text;
  v_suffix int := 0;
  v_name text;
BEGIN
  IF NEW.status = 'aprovado' AND (OLD.status IS DISTINCT FROM 'aprovado') THEN
    -- Evita duplicar
    IF EXISTS (SELECT 1 FROM public.dealers WHERE application_id = NEW.id) THEN
      RETURN NEW;
    END IF;

    v_name := COALESCE(NULLIF(NEW.company_name, ''), NEW.full_name);
    v_city_slug := public.slugify(NEW.city);
    v_base_slug := public.slugify(v_name);
    v_slug := v_base_slug;

    WHILE EXISTS (SELECT 1 FROM public.dealers WHERE city_slug = v_city_slug AND slug = v_slug) LOOP
      v_suffix := v_suffix + 1;
      v_slug := v_base_slug || '-' || v_suffix;
    END LOOP;

    INSERT INTO public.dealers (
      application_id, slug, city_slug, name, city, state,
      whatsapp, email, published
    ) VALUES (
      NEW.id, v_slug, v_city_slug, v_name, NEW.city, NEW.state,
      NEW.whatsapp, NEW.email, true
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_publish_dealer_on_approval
  AFTER UPDATE OF status ON public.representative_applications
  FOR EACH ROW EXECUTE FUNCTION public.auto_publish_approved_dealer();

-- Função de busca por proximidade (Haversine, retorna km)
CREATE OR REPLACE FUNCTION public.dealers_near(lat double precision, lng double precision, max_results int DEFAULT 10)
RETURNS TABLE (
  id uuid, slug text, city_slug text, name text, city text, state text,
  address text, phone text, whatsapp text, distance_km double precision
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT d.id, d.slug, d.city_slug, d.name, d.city, d.state, d.address, d.phone, d.whatsapp,
    (6371 * acos(
      cos(radians(lat)) * cos(radians(d.latitude)) *
      cos(radians(d.longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(d.latitude))
    ))::double precision AS distance_km
  FROM public.dealers d
  WHERE d.published = true
    AND d.latitude IS NOT NULL
    AND d.longitude IS NOT NULL
  ORDER BY distance_km ASC
  LIMIT max_results;
$$;
