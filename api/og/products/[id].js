function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function absoluteUrl(origin, maybeUrl) {
  const u = String(maybeUrl || '').trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) return `${origin}${u}`
  return `${origin}/${u}`
}

function getOrigin(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https')
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
  return host ? `${proto}://${host}` : ''
}

async function fetchOneJson(url, headers) {
  const res = await fetch(url, { headers })
  if (!res.ok) return null
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  return data[0]
}

export default async function handler(req, res) {
  const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id
  const productId = Number(id)
  const origin = getOrigin(req)
  const targetPath = Number.isFinite(productId) && productId > 0 ? `/products/${productId}` : '/products'
  const targetUrl = origin ? `${origin}${targetPath}` : targetPath

  const env = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env)
    ? globalThis.process.env
    : {}
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY

  const fallback = {
    title: 'Rchid Chemicals',
    description: 'Trusted partner in pharmaceutical APIs, HPLC solvents, reference standards, and laboratory solutions.',
    image: origin ? `${origin}/favicon.svg` : '/favicon.svg'
  }

  let meta = { ...fallback }

  if (supabaseUrl && supabaseAnonKey && Number.isFinite(productId) && productId > 0) {
    try {
      const baseRest = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`
      const headers = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      }

      const product = await fetchOneJson(
        `${baseRest}/products?select=id,name,name_ar,description,description_ar,card_image_url,seo_keywords&id=eq.${productId}&limit=1`,
        headers
      )

      if (product) {
        const name = String(product.name || '').trim()
        const nameAr = String(product.name_ar || '').trim()
        const title = name ? `${name} | Rchid Chemicals` : fallback.title
        const description = String(product.description || product.description_ar || fallback.description).trim()

        const imageRow = await fetchOneJson(
          `${baseRest}/product_images?select=url,is_primary,sort_order&product_id=eq.${productId}&order=is_primary.desc,sort_order.asc,created_at.asc&limit=1`,
          headers
        )
        const image = absoluteUrl(origin, imageRow?.url || product.card_image_url || fallback.image)

        const keywordsArr = Array.isArray(product.seo_keywords) ? product.seo_keywords : []
        const keywords = keywordsArr
          .map((k) => String(k || '').trim())
          .filter(Boolean)
          .slice(0, 50)
          .join(', ')

        meta = {
          title,
          description: description.slice(0, 300),
          image,
          keywords,
          nameAr,
          url: targetUrl,
        }
      }
    } catch {
      meta = { ...fallback, url: targetUrl }
    }
  } else {
    meta = { ...fallback, url: targetUrl }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400')

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />` : ''}

    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(meta.url)}" />
    <meta property="og:image" content="${escapeHtml(meta.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image)}" />

    <meta http-equiv="refresh" content="0;url=${escapeHtml(targetPath)}" />
  </head>
  <body>
    <script>location.replace(${JSON.stringify(targetPath)})</script>
    <a href="${escapeHtml(targetPath)}">Continue</a>
  </body>
</html>`

  res.status(200).send(html)
}
