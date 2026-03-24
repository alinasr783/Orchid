import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Users, FileBarChart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/useLanguage'

function rangeFor(key) {
  const now = new Date()
  const end = new Date(now)
  let start = new Date(now)
  if (key === 'today') {
    start.setHours(0, 0, 0, 0)
  } else if (key === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    y.setHours(0, 0, 0, 0)
    start = y
    end.setHours(0, 0, 0, 0)
  } else if (key === 'last3') {
    start = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  } else if (key === 'week') {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (key === 'month') {
    start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  } else if (key === 'months3') {
    start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  } else if (key === 'months6') {
    start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
  } else if (key === 'year') {
    start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  }
  return { start: start.toISOString(), end: end.toISOString() }
}

export default function Visits() {
  const { dir } = useLanguage()
  const [filter, setFilter] = useState('today')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)

  const labels = useMemo(() => ({
    title: 'الزيارات',
    subtitle: 'عدد الزوار مع فلاتر زمنية',
    visitors: 'عدد الزوار',
    visits: 'مرات الزيارة',
    filters: [
      { key: 'today', label: 'اليوم' },
      { key: 'yesterday', label: 'أمس' },
      { key: 'last3', label: 'آخر 3 أيام' },
      { key: 'week', label: 'آخر أسبوع' },
      { key: 'month', label: 'آخر شهر' },
      { key: 'months3', label: 'آخر 3 شهور' },
      { key: 'months6', label: 'آخر 6 شهور' },
      { key: 'year', label: 'آخر سنة' },
    ]
  }), [])

  async function loadCounts(k) {
    setLoading(true)
    setError('')
    try {
      if (!supabase) throw new Error('إعدادات الإحصائيات غير متوفرة')
      const { start, end } = rangeFor(k)
      const res = await supabase.rpc('rpc_visits_range_kpis', { start_ts: start, end_ts: end })
      if (res.error) throw res.error
      const row = Array.isArray(res.data) ? res.data[0] : null
      setTotalVisits(Number(row?.total_visits || 0))
      setUniqueVisitors(Number(row?.unique_visitors || 0))
    } catch (e) {
      const msg = e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' && e.message
        ? `تعذر تحميل البيانات: ${e.message}`
        : 'تعذر تحميل البيانات'
      setError(msg)
      if (import.meta.env.DEV) console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = setTimeout(() => loadCounts(filter), 0)
    return () => clearTimeout(id)
  }, [filter])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{labels.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{labels.subtitle}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-emerald-600" />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-wrap gap-2">
          {labels.filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{labels.visitors}</span>
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : uniqueVisitors}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{labels.visits}</span>
              <FileBarChart className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold mt-2">{loading ? '...' : totalVisits}</div>
          </div>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
