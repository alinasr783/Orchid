import { Link } from 'react-router-dom'
import { FlaskConical, CheckCircle, ArrowRight, Beaker, TestTube, BarChart3, Microscope, Dna, Building2 } from 'lucide-react'
import { useLanguage } from '../contexts/useLanguage'
import Partners from '../components/Partners'
import heroImage from '../assits/hero.png'

export default function Home() {
  const { t, dir, language } = useLanguage()
  const services = [
    {
      title_ar: 'الخامات الدوائية (APIs)',
      title_en: 'Pharmaceutical APIs',
      desc_ar: 'خامات ذات منشأ أوروبي معتمد ومطابقة تامة لمعايير التصنيع الجيد (GMP).',
      desc_en: 'European-origin certified raw materials fully compliant with Good Manufacturing Practices (GMP).',
      icon: Beaker
    },
    {
      title_ar: 'محاليل HPLC والكروماتوغرافيا',
      title_en: 'HPLC & Chromatography Solutions',
      desc_ar: 'مذيبات ومحاليل عالية النقاء تضمن أداءً مثالياً لأجهزة التحليل الدقيق.',
      desc_en: 'High-purity solvents and solutions ensuring optimal performance for precise analytical instruments.',
      icon: TestTube
    },
    {
      title_ar: 'المحاليل المرجعية والمعايرة',
      title_en: 'Reference & Calibration Solutions',
      desc_ar: 'معايير قياسية معتمدة ضرورية لضبط الجودة وضمان التوافق المعياري.',
      desc_en: 'Certified reference standards essential for quality control and regulatory compliance.',
      icon: BarChart3
    },
    {
      title_ar: 'كيماويات المعامل فائقة النقاء',
      title_en: 'Ultra-Pure Laboratory Chemicals',
      desc_ar: 'تشكيلة واسعة من الكيماويات التحليلية والبحثية لدعم البحث الأساسي.',
      desc_en: 'Comprehensive range of analytical and research chemicals supporting fundamental research.',
      icon: Microscope
    },
    {
      title_ar: 'البيولوجيا الجزيئية والنانو',
      title_en: 'Molecular Biology & Nanotechnology',
      desc_ar: 'أطقم الـ PCR ومستلزمات تكنولوجيا النانو لدعم البحث العلمي السيادي.',
      desc_en: 'PCR kits and nanotechnology supplies supporting sovereign scientific research.',
      icon: Dna
    },
    {
      title_ar: 'تجهيزات المختبرات الشاملة',
      title_en: 'Comprehensive Laboratory Setup',
      desc_ar: 'حلول تسليم المفتاح لتجهيز المختبرات بأحدث المعدات والدعم الفني المتكامل.',
      desc_en: 'Turnkey solutions for equipping laboratories with cutting-edge equipment and comprehensive technical support.',
      icon: Building2
    }
  ]

  // partners section now fully driven by Supabase via <Partners />

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">
              {t('orchidChemicals')}
              <span className="block text-emerald-600 dark:text-emerald-400">{t('trustedPartner')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6 lg:mb-8">
              {t('partnershipDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/products" className="bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium text-center flex items-center justify-center gap-2">
                <span>{t('browseProducts')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 px-4 sm:px-6 py-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition font-medium text-center flex items-center justify-center gap-2">
                <span>{t('contactUs')}</span>
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <picture>
              <source media="(max-width: 767px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
              <img 
                src={heroImage} 
                alt="Orchid Chemicals Hero" 
                className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl object-contain rounded-2xl shadow-2xl"
                width="1200"
                height="800"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t('specializedServices')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('servicesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, i) => {
              const IconComponent = service.icon
              return (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition">
                  <div className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 ${dir === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                      {language === 'ar' ? service.title_ar : service.title_en}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'ar' ? service.desc_ar : service.desc_en}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partners Section (DB-driven) */}
      <Partners />

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('readyForPartnership')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('partnershipDesc')}
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition font-semibold">
            <span>{t('getStarted')}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      

    </div>
  )
}
