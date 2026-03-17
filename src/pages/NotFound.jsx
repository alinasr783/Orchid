import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {t('pageNotFound') || 'الصفحة غير موجودة'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {t('home') || 'الصفحة الرئيسية'}
          </Link>
          <Link to="/dashbord" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}
