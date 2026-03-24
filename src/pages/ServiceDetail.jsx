import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, MessageCircle, Wrench } from 'lucide-react'
import { useLanguage } from '../contexts/useLanguage'
import { useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function ServiceDetail() {
  const { id } = useParams()
  const { t, dir, language } = useLanguage()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchService = useCallback(async () => {
    try {
      if (!supabase) throw new Error('Supabase not configured')
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setService(data)
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    const idTimer = setTimeout(() => {
      fetchService()
    }, 0)
    return () => clearTimeout(idTimer)
  }, [fetchService])

  const handleWhatsAppClick = () => {
    const message = dir === 'ar' 
      ? `مرحباً، أود طلب الخدمة: ${service?.name_ar || service?.name}`
      : `Hello, I would like to order the service: ${service?.name}`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCustomServiceClick = () => {
    const message = dir === 'ar' 
      ? `مرحباً، أحتاج إلى خدمة مخصصة. هل يمكنكم المساعدة؟`
      : `Hello, I need a custom service. Can you help?`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">{t('error')}</p>
          <Link to="/services" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
            ← {t('ourServices')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          {t('ourServices')}
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Service Icon */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                  <Wrench className="h-24 w-24 text-slate-400" />
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {language === 'ar' ? service.name_ar : service.name}
                  </h1>
                  <p className="text-slate-600">
                    {language === 'ar' ? service.description_ar : service.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t('orderService')}
                  </button>

                  <button
                    onClick={handleCustomServiceClick}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t('needCustomService')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {service.details && (
            <div className="border-t border-slate-200 p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {dir === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600">{service.details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
