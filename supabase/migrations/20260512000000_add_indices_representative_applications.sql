-- Add indices to representative_applications for filtering and sorting performance
-- in the admin panel. These accelerate the most common queries:
--   - ORDER BY created_at DESC (default sort in admin list)
--   - WHERE state = ? (filter by Brazilian state)
--   - WHERE status = ? (filter by application status)

CREATE INDEX IF NOT EXISTS idx_representative_apps_created_at
  ON public.representative_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_representative_apps_state
  ON public.representative_applications (state);

CREATE INDEX IF NOT EXISTS idx_representative_apps_status
  ON public.representative_applications (status);
