-- Ensure tables exist with correct schema
CREATE TABLE IF NOT EXISTS public.page_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  anon_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  language text,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  minute_bucket timestamptz
);

CREATE TABLE IF NOT EXISTS public.product_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  anon_id text NOT NULL,
  product_id int NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language text,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  minute_bucket timestamptz
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS page_views_path_created_at_idx ON public.page_views (path, created_at);
CREATE INDEX IF NOT EXISTS page_views_anon_created_at_idx ON public.page_views (anon_id, created_at);
CREATE INDEX IF NOT EXISTS product_views_product_created_at_idx ON public.product_views (product_id, created_at);
CREATE INDEX IF NOT EXISTS product_views_anon_created_at_idx ON public.product_views (anon_id, created_at);

-- Deduplication indices
CREATE UNIQUE INDEX IF NOT EXISTS page_views_dedupe_minute_idx ON public.page_views (anon_id, path, minute_bucket);
CREATE UNIQUE INDEX IF NOT EXISTS product_views_dedupe_minute_idx ON public.product_views (anon_id, product_id, minute_bucket);

-- RLS Configuration
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert (record visits)
DROP POLICY IF EXISTS page_views_insert_public ON public.page_views;
CREATE POLICY page_views_insert_public ON public.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS product_views_insert_public ON public.product_views;
CREATE POLICY product_views_insert_public ON public.product_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow admins to see data
DROP POLICY IF EXISTS page_views_select_admin ON public.page_views;
CREATE POLICY page_views_select_admin ON public.page_views
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS product_views_select_admin ON public.product_views;
CREATE POLICY product_views_select_admin ON public.product_views
  FOR SELECT TO authenticated
  USING (true);

-- Explicitly grant permissions to API roles
-- Using both INSERT and UPDATE for upsert support
GRANT ALL ON public.page_views TO anon, authenticated, service_role;
GRANT ALL ON public.product_views TO anon, authenticated, service_role;
GRANT ALL ON public.product_view_stats TO anon, authenticated, service_role;
GRANT ALL ON public.path_view_stats TO anon, authenticated, service_role;

-- Ensure triggers for stats aggregation
CREATE TABLE IF NOT EXISTS public.product_view_stats (
  product_id int PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  total_views bigint NOT NULL DEFAULT 0,
  last_view_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.path_view_stats (
  path text PRIMARY KEY,
  total_views bigint NOT NULL DEFAULT 0,
  last_view_at timestamptz
);

CREATE OR REPLACE FUNCTION public.fn_product_views_after_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.product_view_stats (product_id, total_views, last_view_at)
  VALUES (NEW.product_id, 1, NEW.created_at)
  ON CONFLICT (product_id)
  DO UPDATE SET
    total_views = public.product_view_stats.total_views + 1,
    last_view_at = GREATEST(public.product_view_stats.last_view_at, EXCLUDED.last_view_at);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_views_after_insert ON public.product_views;
CREATE TRIGGER trg_product_views_after_insert
AFTER INSERT ON public.product_views
FOR EACH ROW EXECUTE FUNCTION public.fn_product_views_after_insert();

CREATE OR REPLACE FUNCTION public.fn_page_views_after_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.path_view_stats (path, total_views, last_view_at)
  VALUES (NEW.path, 1, NEW.created_at)
  ON CONFLICT (path)
  DO UPDATE SET
    total_views = public.path_view_stats.total_views + 1,
    last_view_at = GREATEST(public.path_view_stats.last_view_at, EXCLUDED.last_view_at);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_page_views_after_insert ON public.page_views;
CREATE TRIGGER trg_page_views_after_insert
AFTER INSERT ON public.page_views
FOR EACH ROW EXECUTE FUNCTION public.fn_page_views_after_insert();

CREATE OR REPLACE FUNCTION public.rpc_overview_kpis(since interval DEFAULT interval '30 days')
RETURNS TABLE(unique_visitors bigint, total_visits bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT
  (SELECT count(DISTINCT anon_id) FROM public.page_views WHERE created_at >= now() - since),
  (SELECT count(*) FROM public.page_views WHERE created_at >= now() - since);
$$;

CREATE OR REPLACE FUNCTION public.rpc_page_view_counts(since interval DEFAULT interval '30 days')
RETURNS TABLE(path text, views bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT path, count(*) AS views
FROM public.page_views
WHERE created_at >= now() - since
GROUP BY path
ORDER BY views DESC;
$$;

CREATE OR REPLACE FUNCTION public.rpc_top_products(limit_count int DEFAULT 5, since interval DEFAULT interval '30 days')
RETURNS TABLE(product_id int, name text, views bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT pv.product_id, p.name, count(*) AS views
FROM public.product_views pv
JOIN public.products p ON p.id = pv.product_id
WHERE pv.created_at >= now() - since
GROUP BY pv.product_id, p.name
ORDER BY views DESC
LIMIT limit_count;
$$;

CREATE OR REPLACE FUNCTION public.rpc_top_products_total(limit_count int DEFAULT 5)
RETURNS TABLE(product_id int, name text, views bigint, last_view_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT s.product_id, p.name, s.total_views AS views, s.last_view_at
FROM public.product_view_stats s
JOIN public.products p ON p.id = s.product_id
ORDER BY s.total_views DESC, s.last_view_at DESC
LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_overview_kpis(interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_page_view_counts(interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_top_products(integer, interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_top_products_total(integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.rpc_top_referrers(limit_count int DEFAULT 10, since interval DEFAULT interval '30 days')
RETURNS TABLE(referrer text, views bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT COALESCE(referrer, 'Direct / Unknown') AS referrer, count(*) AS views
FROM public.page_views
WHERE created_at >= now() - since
GROUP BY referrer
ORDER BY views DESC
LIMIT limit_count;
$$;

CREATE OR REPLACE FUNCTION public.rpc_geo_counts(since interval DEFAULT interval '30 days')
RETURNS TABLE(key text, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT (language || ' | ' || timezone) AS key, count(*) AS count
FROM public.page_views
WHERE created_at >= now() - since
GROUP BY language, timezone
ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION public.rpc_visits_range_kpis(start_ts timestamptz, end_ts timestamptz)
RETURNS TABLE(unique_visitors bigint, total_visits bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT
  (SELECT count(DISTINCT anon_id) FROM public.page_views WHERE created_at >= start_ts AND created_at < end_ts),
  (SELECT count(*) FROM public.page_views WHERE created_at >= start_ts AND created_at < end_ts);
$$;

GRANT EXECUTE ON FUNCTION public.rpc_top_referrers(integer, interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_geo_counts(interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_visits_range_kpis(timestamptz, timestamptz) TO anon, authenticated;

-- RPC to track page views securely
CREATE OR REPLACE FUNCTION public.rpc_track_page_view(
  p_anon_id text,
  p_path text,
  p_referrer text,
  p_language text,
  p_timezone text,
  p_minute_bucket timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views (anon_id, path, referrer, language, timezone, minute_bucket)
  VALUES (p_anon_id, p_path, p_referrer, p_language, p_timezone, p_minute_bucket)
  ON CONFLICT (anon_id, path, minute_bucket) DO NOTHING;
END;
$$;

-- RPC to track product views securely
CREATE OR REPLACE FUNCTION public.rpc_track_product_view(
  p_anon_id text,
  p_product_id int,
  p_language text,
  p_timezone text,
  p_minute_bucket timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.product_views (anon_id, product_id, language, timezone, minute_bucket)
  VALUES (p_anon_id, p_product_id, p_language, p_timezone, p_minute_bucket)
  ON CONFLICT (anon_id, product_id, minute_bucket) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_track_page_view(text, text, text, text, text, timestamptz) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_track_product_view(text, int, text, text, timestamptz) TO anon, authenticated;
