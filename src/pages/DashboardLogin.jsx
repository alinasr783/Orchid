import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardLogin({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('admin_session')
    if (stored && onSuccess) onSuccess(JSON.parse(stored))
  }, [onSuccess])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (!supabase) throw new Error('لوحة التحكم غير مفعلة')
      const { data, error: qError } = await supabase
        .from('admins')
        .select('id,email')
        .eq('email', email.trim())
        .eq('password', password)
        .maybeSingle()
      if (qError) throw qError
      if (!data) {
        setError('بيانات الدخول غير صحيحة')
      } else {
        const session = { adminId: data.id, email: data.email, ts: Date.now() }
        localStorage.setItem('admin_session', JSON.stringify(session))
        if (onSuccess) onSuccess(session)
      }
    } catch (err) {
      setError('تعذر تسجيل الدخول، حاول مرة أخرى')
      if (import.meta.env.DEV) console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">تسجيل دخول المسؤول</h1>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <label className="block mb-2 text-sm">البريد الإلكتروني</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
        <label className="block mb-2 text-sm">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
