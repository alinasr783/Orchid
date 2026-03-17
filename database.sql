-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id integer NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying,
  subject character varying NOT NULL,
  message text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.partners (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  name_ar text,
  logo_url text,
  website_url text,
  description text,
  description_ar text,
  priority integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT partners_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id integer NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  name character varying NOT NULL,
  category character varying NOT NULL,
  description text,
  origin character varying,
  purity character varying,
  cas character varying,
  created_at timestamp without time zone DEFAULT now(),
  card_image_url text,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.page_views (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  anon_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  language text,
  timezone text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT page_views_pkey PRIMARY KEY (id)
);

CREATE INDEX page_views_path_created_at_idx ON public.page_views (path, created_at);
CREATE INDEX page_views_anon_created_at_idx ON public.page_views (anon_id, created_at);

CREATE TABLE public.product_views (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  anon_id text NOT NULL,
  product_id integer NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language text,
  timezone text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_views_pkey PRIMARY KEY (id)
);

CREATE INDEX product_views_product_created_at_idx ON public.product_views (product_id, created_at);
CREATE INDEX product_views_anon_created_at_idx ON public.product_views (anon_id, created_at);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_views_insert_public ON public.page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY product_views_insert_public ON public.product_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

REVOKE ALL ON public.page_views FROM anon, authenticated;
REVOKE ALL ON public.product_views FROM anon, authenticated;
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT INSERT ON public.product_views TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.rpc_overview_kpis(since interval DEFAULT interval '30 days')
RETURNS TABLE(unique_visitors bigint, total_visits bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT
  (SELECT count(DISTINCT anon_id) FROM public.page_views WHERE created_at >= now() - since) AS unique_visitors,
  (SELECT count(*) FROM public.page_views WHERE created_at >= now() - since) AS total_visits;
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

GRANT EXECUTE ON FUNCTION public.rpc_overview_kpis(interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_page_view_counts(interval) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_top_products(integer, interval) TO anon, authenticated;
