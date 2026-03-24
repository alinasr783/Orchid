import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../contexts/useLanguage'
import { BarChart3, Users, Globe2, PackageSearch, FileBarChart } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Overview() {
  const { language, dir } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(() => ({
    uniqueVisitors: 0,
    totalVisits: 0,
    pages: [],
    referrers: [],
    geo: []
  }))
  const t = useMemo(() => ({
    title: language === 'ar' ? 'نظرة عامة' : 'Overview',
    subtitle: language === 'ar' ? 'إحصائيات حقيقية لحركة الموقع' : 'Real site analytics',
    visitors: language === 'ar' ? 'عدد الزوار' : 'Visitors',
    visits: language === 'ar' ? 'مرات الزيارة' : 'Visits',
    pages: language === 'ar' ? 'الصفحات' : 'Pages',
    topPage: language === 'ar' ? 'أعلى صفحة (زيارات)' : 'Top Page (Views)',
    pageViews: language === 'ar' ? 'مرات فتح الصفحات' : 'Page Views',
    referrers: language === 'ar' ? 'مصادر الزيارات' : 'Referrers',
    geography: language === 'ar' ? 'المناطق الجغرافية' : 'Geography',
    noData: language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'
  }), [language])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        if (!supabase) throw new Error(language === 'ar' ? 'إعدادات الإحصائيات غير متوفرة' : 'Analytics backend is not configured')
        const since = '30 days'
        const [kpisRes, pagesRes, refRes, geoRes] = await Promise.all([
          supabase.rpc('rpc_overview_kpis', { since }),
          supabase.rpc('rpc_page_view_counts', { since }),
          supabase.rpc('rpc_top_referrers', { limit_count: 10, since }),
          supabase.rpc('rpc_geo_counts', { since }),
        ])
        const anyErr = kpisRes.error || pagesRes.error || refRes.error || geoRes.error
        if (anyErr) throw anyErr
        if (!alive) return
        const kpisRow = Array.isArray(kpisRes.data) ? kpisRes.data[0] : null
        const pages = (pagesRes.data || []).map((r) => ({ path: r.path, count: Number(r.views || 0) }))
        const referrers = (refRes.data || []).map((r) => ({ key: r.referrer, count: Number(r.views || 0) }))
        const geo = (geoRes.data || []).map((r) => ({ key: r.key, count: Number(r.count || 0) }))
        setData({
          uniqueVisitors: Number(kpisRow?.unique_visitors || 0),
          totalVisits: Number(kpisRow?.total_visits || 0),
          pages,
          referrers,
          geo
        })
      } catch (e) {
        if (!alive) return
        const msg = e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' && e.message ? e.message : ''
        setError(language === 'ar' ? `تعذر تحميل الإحصائيات${msg ? `: ${msg}` : ''}` : `Failed to load analytics${msg ? `: ${msg}` : ''}`)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [language])

  const barMax = Math.max(1, ...data.pages.map(p => p.count))
  const refMax = Math.max(1, ...data.referrers.map(r => r.count))
  const geoMax = Math.max(1, ...data.geo.map(g => g.count))
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8" dir={dir}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{t.subtitle}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-emerald-600" />
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.visitors}</span>
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : data.uniqueVisitors}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.visits}</span>
              <FileBarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : data.totalVisits}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.pages}</span>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : data.pages.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.topPage}</span>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : (data.pages[0]?.count ?? 0)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.pageViews}</h2>
              <FileBarChart className="h-5 w-5 text-emerald-600" />
            </div>
            {data.pages.length === 0 ? (
              <div className="text-sm text-slate-500">{t.noData}</div>
            ) : (
              <ul className="space-y-3">
                {data.pages.map((p) => (
                  <li key={p.path} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate">{p.path}</span>
                      <span className="font-medium">{p.count}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: `${(p.count / barMax) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.referrers}</h2>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            {data.referrers.length === 0 ? (
              <div className="text-sm text-slate-500">{t.noData}</div>
            ) : (
              <ul className="space-y-3">
                {data.referrers.map((r) => (
                  <li key={r.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate">{r.key}</span>
                      <span className="font-medium">{r.count}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: `${(r.count / refMax) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t.geography}</h2>
            <Globe2 className="h-5 w-5 text-emerald-600" />
          </div>
          {data.geo.length === 0 ? (
            <div className="text-sm text-slate-500">{t.noData}</div>
          ) : (
            <ul className="space-y-3">
              {data.geo.map((g) => (
                <li key={g.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{g.key}</span>
                    <span className="font-medium">{g.count}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded" style={{ width: `${(g.count / geoMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
