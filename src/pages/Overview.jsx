import { useState, useMemo } from 'react'
import { useLanguage } from '../contexts/useLanguage'
import { BarChart3, Users, Globe2, PackageSearch, FileBarChart } from 'lucide-react'
import { getOverview } from '../lib/analytics'

export default function Overview() {
  const { language, dir } = useLanguage()
  const [data] = useState(() => getOverview())
  const t = useMemo(() => ({
    title: language === 'ar' ? 'نظرة عامة' : 'Overview',
    subtitle: language === 'ar' ? 'إحصائيات تفاعلية لحركة الموقع (محلية)' : 'Interactive site stats (local)',
    visitors: language === 'ar' ? 'عدد الزوار' : 'Visitors',
    visits: language === 'ar' ? 'مرات الزيارة' : 'Visits',
    pages: language === 'ar' ? 'الصفحات' : 'Pages',
    topProducts: language === 'ar' ? 'أكثر المنتجات زيارة' : 'Top Products',
    pageViews: language === 'ar' ? 'مرات فتح الصفحات' : 'Page Views',
    geography: language === 'ar' ? 'المناطق الجغرافية' : 'Geography',
    noData: language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'
  }), [language])
  const barMax = Math.max(1, ...data.pages.map(p => p.count))
  const productMax = Math.max(1, ...data.topProducts.map(p => p.count))
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.visitors}</span>
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{data.uniqueVisitors}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.visits}</span>
              <FileBarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{data.totalVisits}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.pages}</span>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{data.pages.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.topProducts}</span>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{data.topProducts.reduce((s, p) => s + p.count, 0)}</div>
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
              <h2 className="text-lg font-semibold">{t.topProducts}</h2>
              <PackageSearch className="h-5 w-5 text-emerald-600" />
            </div>
            {data.topProducts.length === 0 ? (
              <div className="text-sm text-slate-500">{t.noData}</div>
            ) : (
              <ul className="space-y-3">
                {data.topProducts.map((p) => (
                  <li key={p.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate">{p.key}</span>
                      <span className="font-medium">{p.count}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: `${(p.count / productMax) * 100}%` }} />
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
