const VID_KEY = 'orchid_vid'
const UNIQUE_VISITORS_KEY = 'orchid_unique_visitors'
const TOTAL_VISITS_KEY = 'orchid_total_visits'
const PAGE_COUNTS_KEY = 'orchid_page_counts'
const PRODUCT_COUNTS_KEY = 'orchid_product_counts'
const GEO_COUNTS_KEY = 'orchid_geo_counts'

function id() {
  const existing = localStorage.getItem(VID_KEY)
  if (existing) return existing
  const v = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
  localStorage.setItem(VID_KEY, v)
  const unique = Number(localStorage.getItem(UNIQUE_VISITORS_KEY) || '0') + 1
  localStorage.setItem(UNIQUE_VISITORS_KEY, String(unique))
  return v
}

function inc(key, subkey) {
  const raw = localStorage.getItem(key)
  const obj = raw ? JSON.parse(raw) : {}
  obj[subkey] = (obj[subkey] || 0) + 1
  localStorage.setItem(key, JSON.stringify(obj))
  return obj
}

function schedule(fn) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => { fn() }, { timeout: 2500 })
    return
  }
  setTimeout(() => { fn() }, 1500)
}

export function trackPageView(path) {
  const anon = id()
  const total = Number(localStorage.getItem(TOTAL_VISITS_KEY) || '0') + 1
  localStorage.setItem(TOTAL_VISITS_KEY, String(total))
  inc(PAGE_COUNTS_KEY, path)
  const tzOpt = Intl.DateTimeFormat().resolvedOptions()
  const tz = (tzOpt && tzOpt.timeZone) ? tzOpt.timeZone : 'Unknown'
  const lang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'Unknown'
  inc(GEO_COUNTS_KEY, `${lang} | ${tz}`)
  schedule(async () => {
    try {
      const ref = typeof document !== 'undefined' ? document.referrer || null : null
      const mod = await import('./supabase')
      if (!mod.supabase) return
      
      const now = new Date()
      const minuteBucket = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).toISOString()
      
      await mod.supabase.rpc('rpc_track_page_view', {
        p_anon_id: anon,
        p_path: path,
        p_referrer: ref,
        p_language: lang,
        p_timezone: tz,
        p_minute_bucket: minuteBucket
      })
    } catch { void 0 }
  })
}

export function trackProductView(productKey) {
  const anon = id()
  inc(PRODUCT_COUNTS_KEY, String(productKey))
  const productId = Number(productKey)
  if (!Number.isFinite(productId) || productId <= 0) return
  const tzOpt = Intl.DateTimeFormat().resolvedOptions()
  const tz = (tzOpt && tzOpt.timeZone) ? tzOpt.timeZone : 'Unknown'
  const lang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'Unknown'
  schedule(async () => {
    try {
      const mod = await import('./supabase')
      if (!mod.supabase) return
      
      const now = new Date()
      const minuteBucket = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).toISOString()
      
      await mod.supabase.rpc('rpc_track_product_view', {
        p_anon_id: anon,
        p_product_id: productId,
        p_language: lang,
        p_timezone: tz,
        p_minute_bucket: minuteBucket
      })
    } catch { void 0 }
  })
}

export function getOverview() {
  const uniqueVisitors = Number(localStorage.getItem(UNIQUE_VISITORS_KEY) || '0')
  const totalVisits = Number(localStorage.getItem(TOTAL_VISITS_KEY) || '0')
  const pageCounts = JSON.parse(localStorage.getItem(PAGE_COUNTS_KEY) || '{}')
  const productCounts = JSON.parse(localStorage.getItem(PRODUCT_COUNTS_KEY) || '{}')
  const geoCounts = JSON.parse(localStorage.getItem(GEO_COUNTS_KEY) || '{}')
  const pageList = Object.entries(pageCounts).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count)
  const productList = Object.entries(productCounts).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count).slice(0, 5)
  const geoList = Object.entries(geoCounts).map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count)
  return {
    uniqueVisitors,
    totalVisits,
    pages: pageList,
    topProducts: productList,
    geo: geoList
  }
}
