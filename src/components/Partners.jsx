import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/useLanguage'
import { supabase } from '../lib/supabase'

export default function Partners() {
  const { t, language } = useLanguage()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [shouldLoad, setShouldLoad] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return
    fetchPartners()
  }, [shouldLoad])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })

      if (error) {
        console.warn('Supabase partners error:', error)
        // Use fallback data
        setPartners([
          {
            id: 1,
            name: 'Bayer',
            name_ar: 'باير',
            logo_url: 'https://via.placeholder.com/200x100/1e40af/ffffff?text=Bayer',
            website_url: 'https://www.bayer.com',
            description: 'Global pharmaceutical and life sciences company',
            description_ar: 'شركة عالمية للأدوية وعلوم الحياة'
          },
          {
            id: 2,
            name: 'Merck',
            name_ar: 'ميرك',
            logo_url: 'https://via.placeholder.com/200x100/059669/ffffff?text=Merck',
            website_url: 'https://www.merck.com',
            description: 'Leading science and technology company',
            description_ar: 'شركة رائدة في العلوم والتكنولوجيا'
          },
          {
            id: 3,
            name: 'Sigma-Aldrich',
            name_ar: 'سيجما-ألدريتش',
            logo_url: 'https://via.placeholder.com/200x100/dc2626/ffffff?text=Sigma',
            website_url: 'https://www.sigmaaldrich.com',
            description: 'Premium laboratory chemicals and reagents',
            description_ar: 'مواد كيميائية ومعامل عالية الجودة'
          },
          {
            id: 4,
            name: 'Thermo Fisher',
            name_ar: 'ثيرمو فيشر',
            logo_url: 'https://via.placeholder.com/200x100/7c3aed/ffffff?text=Thermo',
            website_url: 'https://www.thermofisher.com',
            description: 'Scientific instruments and laboratory equipment',
            description_ar: 'أدوات علمية وتجهيزات معامل'
          },
          {
            id: 5,
            name: 'Agilent',
            name_ar: 'أجيلنت',
            logo_url: 'https://via.placeholder.com/200x100/ea580c/ffffff?text=Agilent',
            website_url: 'https://www.agilent.com',
            description: 'Analytical instruments and solutions',
            description_ar: 'أدوات تحليلية وحلول'
          }
        ])
      } else {
        setPartners(data || [])
      }
    } catch (err) {
      console.warn('Network error fetching partners:', err)
      // Use fallback data
      setPartners([
        {
          id: 1,
          name: 'Bayer',
          name_ar: 'باير',
          logo_url: 'https://via.placeholder.com/200x100/1e40af/ffffff?text=Bayer',
          website_url: 'https://www.bayer.com',
          description: 'Global pharmaceutical and life sciences company',
          description_ar: 'شركة عالمية للأدوية وعلوم الحياة'
        },
        {
          id: 2,
          name: 'Merck',
          name_ar: 'ميرك',
          logo_url: 'https://via.placeholder.com/200x100/059669/ffffff?text=Merck',
          website_url: 'https://www.merck.com',
          description: 'Leading science and technology company',
          description_ar: 'شركة رائدة في العلوم والتكنولوجيا'
        },
        {
          id: 3,
          name: 'Sigma-Aldrich',
          name_ar: 'سيجما-ألدريتش',
          logo_url: 'https://via.placeholder.com/200x100/dc2626/ffffff?text=Sigma',
          website_url: 'https://www.sigmaaldrich.com',
          description: 'Premium laboratory chemicals and reagents',
          description_ar: 'مواد كيميائية ومعامل عالية الجودة'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePartnerClick = (partner) => {
    if (partner.website_url) {
      window.open(partner.website_url, '_blank')
    }
  }

  if (loading && !shouldLoad) {
    return (
      <section ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('ourPartners')}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t('partnersDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('ourPartners')}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t('partnersDesc')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('ourPartners')}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t('partnersDesc')}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => handlePartnerClick(partner)}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg mb-4 overflow-hidden">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={language === 'ar' ? partner.name_ar : partner.name}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="200"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/200x100/6b7280/ffffff?text=${encodeURIComponent(
                        language === 'ar' ? partner.name_ar : partner.name
                      )}`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                      {language === 'ar' ? partner.name_ar : partner.name}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white text-center mb-2">
                {language === 'ar' ? partner.name_ar : partner.name}
              </h3>
              {partner.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center line-clamp-2">
                  {language === 'ar' ? partner.description_ar : partner.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
