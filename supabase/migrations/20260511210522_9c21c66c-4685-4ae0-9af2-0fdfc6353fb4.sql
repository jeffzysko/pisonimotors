
-- 1. Status column on applications
ALTER TABLE public.representative_applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'novo';

-- Validate status via trigger (avoid CHECK so we can extend later)
CREATE OR REPLACE FUNCTION public.validate_application_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('novo','em_contato','aprovado','recusado') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_application_status ON public.representative_applications;
CREATE TRIGGER trg_validate_application_status
BEFORE INSERT OR UPDATE ON public.representative_applications
FOR EACH ROW EXECUTE FUNCTION public.validate_application_status();

-- 2. Roles enum + table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role security-definer to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies on user_roles: users can see their own roles; admins can see all
DROP POLICY IF EXISTS "Users see own roles" ON public.user_roles;
CREATE POLICY "Users see own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Admin policies on representative_applications
DROP POLICY IF EXISTS "Admins can read applications" ON public.representative_applications;
CREATE POLICY "Admins can read applications"
ON public.representative_applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update applications" ON public.representative_applications;
CREATE POLICY "Admins can update applications"
ON public.representative_applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
