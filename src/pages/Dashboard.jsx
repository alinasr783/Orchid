import { useEffect, useMemo, useState, useRef } from 'react'
import { LayoutDashboard, Package, Users, BarChart3 } from 'lucide-react'
import Overview from './Overview'
import DashboardLogin from './DashboardLogin'
import Visits from './Visits'
import { supabase } from '../lib/supabase'

function SectionHeader({ title }) {
  return <h2 className="text-lg font-semibold mb-3">{title}</h2>
}

async function uploadToStorage(bucket, file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `uploads/${unique}`
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false, contentType: file.type })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

function ProductsPanel() {
  const empty = useMemo(() => ({
    name: '',
    category: '',
    description: '',
    origin: '',
    purity: '',
    cas: '',
    card_image_url: '',
    seo_keywords: [],
  }), [])
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [savedPulse, setSavedPulse] = useState(false)
  const [seoKeywordInput, setSeoKeywordInput] = useState('')
  const [seoKeywordsSaving, setSeoKeywordsSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError('فشل جلب المنتجات')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const cp = { ...prev }
        delete cp[name]
        return cp
      })
    }
  }

  function normalizeKeyword(raw) {
    return String(raw || '').trim().replace(/\s+/g, ' ')
  }

  function uniqKeywords(list) {
    const out = []
    const seen = new Set()
    for (const kw of Array.isArray(list) ? list : []) {
      const v = normalizeKeyword(kw)
      const key = v.toLowerCase()
      if (!v || seen.has(key)) continue
      seen.add(key)
      out.push(v)
    }
    return out
  }

  async function persistSeoKeywords(nextKeywords) {
    if (!editingId) return
    setSeoKeywordsSaving(true)
    setError('')
    try {
      const { error } = await supabase
        .from('products')
        .update({ seo_keywords: nextKeywords })
        .eq('id', editingId)
      if (error) throw error
      setSavedPulse(true)
      setTimeout(() => setSavedPulse(false), 900)
      await load()
    } catch (err) {
      console.error(err)
      setError('تعذر حفظ الكلمات المفتاحية')
    } finally {
      setSeoKeywordsSaving(false)
    }
  }

  async function addSeoKeyword(raw) {
    const v = normalizeKeyword(raw)
    if (!v) return
    const current = Array.isArray(form.seo_keywords) ? form.seo_keywords : []
    const next = uniqKeywords([...current, v])
    setForm((f) => ({ ...f, seo_keywords: next }))
    setSeoKeywordInput('')
    await persistSeoKeywords(next)
  }

  async function removeSeoKeyword(keyword) {
    const current = Array.isArray(form.seo_keywords) ? form.seo_keywords : []
    const next = current.filter((k) => String(k || '').toLowerCase() !== String(keyword || '').toLowerCase())
    setForm((f) => ({ ...f, seo_keywords: next }))
    await persistSeoKeywords(next)
  }

  async function onUploadCardImage(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('يجب اختيار صورة')
      return
    }
    setLoading(true)
    setError('')
    try {
      const url = await uploadToStorage('products', file)
      setForm((f) => ({ ...f, card_image_url: url }))
    } catch (err) {
      console.error(err)
      setError('تعذر رفع الصورة إلى التخزين')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  function validate() {
    const v = {}
    if (!String(form.name || '').trim()) v.name = 'الاسم مطلوب'
    if (!String(form.category || '').trim()) v.category = 'التصنيف مطلوب'
    setErrors(v)
    return Object.keys(v).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, seo_keywords: uniqKeywords(form.seo_keywords) }
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload])
        if (error) throw error
      }
      setForm(empty)
      setSeoKeywordInput('')
      await load()
      setSavedPulse(true)
      setTimeout(() => setSavedPulse(false), 1200)
      newProduct()
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء الحفظ')
    } finally {
      setLoading(false)
    }
  }

  function newProduct() {
    setEditingId(null)
    setForm(empty)
    setErrors({})
    setSeoKeywordInput('')
  }

  async function onEdit(item) {
    setForm({
      name: item.name || '',
      category: item.category || '',
      description: item.description || '',
      origin: item.origin || '',
      purity: item.purity || '',
      cas: item.cas || '',
      card_image_url: item.card_image_url || '',
      seo_keywords: Array.isArray(item.seo_keywords) ? item.seo_keywords : [],
    })
    setEditingId(item.id)
    setSeoKeywordInput('')
  }

  async function onDelete(id) {
    if (!confirm('هل تريد حذف المنتج؟')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setError('تعذر الحذف')
    } else {
      await load()
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className={`rounded-xl border p-4 ${savedPulse ? 'border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-900/40 transition' : ''} border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 backdrop-blur`}>
        <div className="flex items-center justify-between mb-2">
          <SectionHeader title={editingId ? 'تعديل منتج' : 'إضافة منتج'} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={newProduct}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
            >
              منتج جديد
            </button>
          </div>
        </div>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'الاسم', required: true, placeholder: 'مثال: Paracetamol API' },
              { key: 'category', label: 'التصنيف', required: true, placeholder: 'مثال: apis / hplc' },
              { key: 'origin', label: 'البراند', required: false, placeholder: 'مثال: Merck' },
              { key: 'purity', label: 'النقاء', required: false, placeholder: 'مثال: 99.9%' },
              { key: 'cas', label: 'CAS', required: false, placeholder: 'مثال: 103-90-2' },
            ].map((f) => (
              <div key={f.key} className="flex flex-col">
                <label className="block text-sm mb-1">
                  {f.label}{f.required ? <span className="text-red-600">*</span> : null}
                </label>
                <input
                  name={f.key}
                  value={form[f.key]}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent ${errors[f.key] ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-300' : 'border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-300'}`}
                />
                {errors[f.key] && <span className="text-xs text-red-600 mt-1">{errors[f.key]}</span>}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-1">رابط صورة الكارت</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                name="card_image_url"
                value={form.card_image_url}
                onChange={onChange}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer text-sm">
                <span className="transition-transform duration-150 group-hover:scale-105">رفع صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUploadCardImage}
                  className="hidden"
                  title="اختر صورة لرفعها"
                />
              </label>
            </div>
            {form.card_image_url && (
              <div className="mt-2">
                <img src={form.card_image_url} alt="preview" className="h-28 w-full max-w-sm rounded border border-slate-200 dark:border-slate-700 object-cover" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-1">الوصف</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              placeholder="وصف مختصر للمنتج"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-2">الكلمات المفتاحية (SEO)</label>
            <div className="flex flex-col gap-2">
              <input
                value={seoKeywordInput}
                onChange={(e) => setSeoKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void addSeoKeyword(seoKeywordInput)
                  }
                }}
                placeholder="اكتب كلمة مفتاحية واضغط Enter"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              {seoKeywordsSaving && (
                <div className="text-xs text-slate-500">
                  جاري حفظ الكلمات المفتاحية...
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(form.seo_keywords) ? form.seo_keywords : []).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => { void removeSeoKeyword(kw) }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm"
                    title="اضغط للحذف"
                  >
                    <span>{kw}</span>
                    <span className="text-slate-500">×</span>
                  </button>
                ))}
                {(Array.isArray(form.seo_keywords) ? form.seo_keywords : []).length === 0 && (
                  <span className="text-xs text-slate-500">لا توجد كلمات مفتاحية بعد</span>
                )}
              </div>
              {!editingId && (
                <div className="text-xs text-slate-500">
                  سيتم حفظ الكلمات المفتاحية عند الضغط على "إضافة".
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-2">صور المنتج</label>
            <ProductImagesManager productId={editingId} embedded />
            {!editingId && (
              <div className="mt-2 text-xs text-slate-500">
                لرفع الصور، احفظ المنتج أولاً ثم اختر "تعديل" من القائمة.
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center gap-2 ${loading ? 'animate-pulse' : ''}`}
            >
              {editingId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            {editingId && (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                onClick={newProduct}
              >
                إلغاء
              </button>
            )}
            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                جاري الحفظ...
              </span>
            )}
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <SectionHeader title="قائمة المنتجات" />
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-slate-500 truncate">{item.category}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800" onClick={() => onEdit(item)}>تعديل</button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(item.id)}>حذف</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-slate-500">لا توجد منتجات</div>}
          </div>
        )}
      </div>
    </div>
  )
}

function PartnersPanel() {
  const empty = useMemo(() => ({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    priority: 0,
    is_active: true,
    name_ar: '',
    description_ar: '',
  }), [])
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('priority')
    if (error) setError('فشل جلب الشركاء')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function onUploadLogo(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('يجب اختيار صورة')
      return
    }
    setLoading(true)
    setError('')
    try {
      const url = await uploadToStorage('partners', file)
      setForm((f) => ({ ...f, logo_url: url }))
    } catch (err) {
      console.error(err)
      setError('تعذر رفع الصورة إلى التخزين')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, priority: Number(form.priority || 0) }
      if (editingId) {
        const { error } = await supabase
          .from('partners')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([payload])
        if (error) throw error
      }
      setForm(empty)
      setEditingId(null)
      await load()
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء الحفظ')
    } finally {
      setLoading(false)
    }
  }

  function onEdit(item) {
    setForm({
      name: item.name || '',
      logo_url: item.logo_url || '',
      website_url: item.website_url || '',
      description: item.description || '',
      priority: item.priority ?? 0,
      is_active: !!item.is_active,
      name_ar: item.name_ar || '',
      description_ar: item.description_ar || '',
    })
    setEditingId(item.id)
  }

  async function onDelete(id) {
    if (!confirm('هل تريد حذف الشريك؟')) return
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) {
      setError('تعذر الحذف')
    } else {
      await load()
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <SectionHeader title={editingId ? 'تعديل شريك' : 'إضافة شريك'} />
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name','website_url','name_ar','priority'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="block text-sm mb-1">{field}</label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={onChange}
                  className={`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent ${
                    field === 'website_url' ? 'truncate overflow-hidden text-ellipsis whitespace-nowrap' : ''
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['description','description_ar'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="block text-sm mb-1">{field}</label>
                <textarea
                  name={field}
                  value={form[field]}
                  onChange={onChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-1">logo_url</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                name="logo_url"
                value={form.logo_url}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
              />
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer text-sm">
                <span>رفع شعار</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUploadLogo}
                  className="hidden"
                  title="اختر شعار لرفعه"
                />
              </label>
            </div>
            {form.logo_url && (
              <div className="mt-2">
                <img src={form.logo_url} alt="logo preview" className="h-24 w-full max-w-sm rounded border border-slate-200 dark:border-slate-700 object-contain" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={onChange}
            />
            <label htmlFor="is_active" className="text-sm">نشط</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {editingId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            {editingId && (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                onClick={() => { setEditingId(null); setForm(empty) }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <SectionHeader title="قائمة الشركاء" />
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-slate-500 truncate text-left" dir="ltr">{item.website_url}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800" onClick={() => onEdit(item)}>تعديل</button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(item.id)}>حذف</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-slate-500">لا توجد شركات</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('overview')

  function logout() {
    localStorage.removeItem('admin_session')
    setSession(null)
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center">
          <h1 className="text-xl font-semibold mb-2">لوحة التحكم غير متاحة</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            إعدادات Supabase غير موجودة أو غير صحيحة على هذا النشر.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <DashboardLogin onSuccess={setSession} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-700 p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">إدارة المحتوى والواجهة بسهولة وكفاءة</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:inline">{session.email}</span>
            <button onClick={logout} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">خروج</button>
          </div>
        </div>
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === 'overview' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setTab('overview')}
            >
              نظرة عامة
            </button>
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === 'visits' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setTab('visits')}
            >
              الزيارات
            </button>
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === 'products' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setTab('products')}
            >
              المنتجات
            </button>
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === 'partners' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setTab('partners')}
            >
              الشركاء
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {tab === 'overview' ? <Overview /> : tab === 'visits' ? <Visits /> : tab === 'products' ? <ProductsPanel /> : <PartnersPanel />}
        </div>
      </div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-2xl px-3 pb-3">
          <div className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg">
            <ul className="flex items-stretch">
              {[
                { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
                { key: 'visits', label: 'الزيارات', icon: BarChart3 },
                { key: 'products', label: 'المنتجات', icon: Package },
                { key: 'partners', label: 'الشركاء', icon: Users },
              ].map((item) => {
                const active = tab === item.key
                const IconComp = item.icon
                return (
                  <li key={item.key} className="flex-1">
                    <button
                      type="button"
                      onClick={() => setTab(item.key)}
                      className={`w-full group flex flex-col items-center justify-center gap-1 py-3 ${active ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl transition-all ${active ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-500/20' : 'bg-transparent'}`}>
                        <IconComp className={`h-5 w-5 ${active ? 'text-emerald-600' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                      </span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

function ProductImagesManager({ productId, embedded = false }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const prevProductIdRef = useRef(productId || null)

  async function loadImages() {
    if (!productId) {
      setImages((imgs) => imgs.filter((i) => !i.id))
      return
    }
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) setError('فشل جلب صور المنتج')
    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    const prev = prevProductIdRef.current
    prevProductIdRef.current = productId || null
    if (productId && prev === null) {
      const staged = images.filter((i) => !i.id)
      if (staged.length > 0) {
        ;(async () => {
          setLoading(true)
          setError('')
          try {
            const payload = staged.map((i) => ({
              product_id: productId,
              url: i.url,
              sort_order: Number(i.sort_order || 0),
              is_primary: !!i.is_primary,
            }))
            const { error } = await supabase
              .from('product_images')
              .insert(payload)
            if (error) throw error
            await loadImages()
          } catch (err) {
            console.error(err)
            setError('تعذر ربط الصور بالمنتج الجديد')
          } finally {
            setLoading(false)
          }
        })()
        return
      }
    }
    if (productId) loadImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function onUpload(e) {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) {
      e.target.value = ''
      return
    }
    setLoading(true)
    setError('')
    try {
      const startOrder = images.length
      const urls = await Promise.all(files.map((f) => uploadToStorage('products', f)))
      if (productId) {
        const payload = urls.map((url, idx) => ({
          product_id: productId,
          url,
          sort_order: startOrder + idx,
          is_primary: false,
        }))
        const { error } = await supabase
          .from('product_images')
          .insert(payload)
        if (error) throw error
        await loadImages()
      } else {
        setImages((imgs) => [
          ...imgs,
          ...urls.map((url, idx) => ({ id: null, url, sort_order: startOrder + idx, is_primary: false })),
        ])
      }
    } catch (err) {
      console.error(err)
      setError('تعذر رفع الصورة أو حفظها')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  async function updateImage(id, fields, urlKey) {
    if (!id) {
      setImages((imgs) =>
        imgs.map((i) => (i.id ? i : (i.url === urlKey ? { ...i, ...fields } : i)))
      )
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase
        .from('product_images')
        .update(fields)
        .eq('id', id)
      if (error) throw error
      await loadImages()
    } catch (err) {
      console.error(err)
      setError('تعذر تحديث الصورة')
    } finally {
      setLoading(false)
    }
  }

  async function setPrimary(id, urlKey) {
    if (!id && !productId) {
      setImages((imgs) => {
        const cleared = imgs.map((i) => ({ ...i, is_primary: false }))
        return cleared.map((i) => (i.id ? i : (i.url === urlKey ? { ...i, is_primary: true } : i)))
      })
      return
    }
    if (!id || !productId) return
    setLoading(true)
    setError('')
    try {
      const { error: clearErr } = await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)
      if (clearErr) throw clearErr
      const { error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', id)
      if (error) throw error
      await loadImages()
    } catch (err) {
      console.error(err)
      setError('تعذر تعيين الصورة كأساسية')
    } finally {
      setLoading(false)
    }
  }

  async function removeImage(id, urlKey) {
    if (!id) {
      setImages((imgs) => imgs.filter((i) => (i.id ? true : i.url !== urlKey)))
      return
    }
    if (!confirm('هل تريد حذف هذه الصورة؟')) return
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id)
      if (error) throw error
      await loadImages()
    } catch (err) {
      console.error(err)
      setError('تعذر حذف الصورة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={embedded ? '' : 'mt-6'}>
      {!embedded && <SectionHeader title="صور المنتج" />}
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer text-sm">
            <span>إضافة صور</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              title="اختر صور لإضافتها"
              disabled={loading}
            />
          </label>
        </div>
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id ?? img.url} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-3">
                <img src={img.url} alt="" className="w-24 h-24 rounded object-cover border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">الترتيب</label>
                    <input
                      type="number"
                      className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-transparent"
                      defaultValue={img.sort_order ?? 0}
                      onBlur={(e) => updateImage(img.id, { sort_order: Number(e.target.value || 0) }, img.url)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`primary_${img.id ?? img.url}`}
                      checked={!!img.is_primary}
                      onChange={() => setPrimary(img.id, img.url)}
                    />
                    <label htmlFor={`primary_${img.id ?? img.url}`} className="text-sm">أساسية</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-red-600 text-white"
                      onClick={() => removeImage(img.id, img.url)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="text-sm text-slate-500">لا توجد صور لهذا المنتج</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
