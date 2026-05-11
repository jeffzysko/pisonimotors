
CREATE TABLE public.representative_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  entity_type text NOT NULL,
  company_name text,
  cnpj text,
  investment_range text NOT NULL,
  has_commercial_point text NOT NULL,
  working_capital text NOT NULL,
  has_sector_experience text NOT NULL,
  experience_years text,
  technical_team text NOT NULL,
  motivation text NOT NULL,
  lgpd_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.representative_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.representative_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
