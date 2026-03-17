import { CheckCircle, Beaker, TestTube, BarChart3, Microscope, Dna, Building2, MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/useLanguage'
import servicesImage from '../assits/services.png'

export default function Services() {
  const { t, dir, language } = useLanguage()
  const services = [
    {
      title_ar: 'الخامات الدوائية (APIs)',
      title_en: 'Pharmaceutical APIs',
      desc_ar: 'نوفر خامات ذات منشأ أوروبي معتمد مع مطابقة تامة لمعايير التصنيع الجيد (GMP)، مما يضمن جودة فائقة للصناعات الدوائية.',
      desc_en: 'We provide European-origin certified raw materials with full GMP compliance, ensuring exceptional quality for pharmaceutical industries.',
      features_ar: [
        'منشأ أوروبي معتمد',
        'مطابقة لمعايير GMP',
        'جودة صفرية الأخطاء',
        'شهادات تحليل معتمدة'
      ],
      features_en: [
        'European-origin certified',
        'GMP standards compliance',
        'Zero-error quality',
        'Certified analysis certificates'
      ],
      icon: Beaker
    },
    {
      title_ar: 'محاليل HPLC والكروماتوغرافيا',
      title_en: 'HPLC & Chromatography Solutions',
      desc_ar: 'مذيبات ومحاليل عالية النقاء تضمن أداءً مثالياً لأجهزة التحليل الدقيق وتمنع تداخل الشوائب.',
      desc_en: 'High-purity solvents and solutions ensure optimal performance for precise analytical instruments and prevent impurity interference.',
      features_ar: [
        'نقاء فائق 99.9%',
        'منع تداخل الشوائب',
        'أداء مثالي للأجهزة',
        'توفير بكميات مختلفة'
      ],
      features_en: [
        'Ultra-high purity 99.9%',
        'Prevents impurity interference',
        'Optimal device performance',
        'Available in various quantities'
      ],
      icon: TestTube
    },
    {
      title_ar: 'المحاليل المرجعية والمعايرة',
      title_en: 'Reference & Calibration Solutions',
      desc_ar: 'معايير قياسية معتمدة ضرورية لضبط الجودة وضمان "التوافق المعياري" للتحاليل المخبرية.',
      desc_en: 'Certified reference standards essential for quality control and ensuring "regulatory compliance" for laboratory analyses.',
      features_ar: [
        'معايير ISO معتمدة',
        'شهادات التتبع',
        'دقة عالية في القياس',
        'صلاحية طويلة الأمد'
      ],
      features_en: [
        'ISO certified standards',
        'Traceability certificates',
        'High measurement accuracy',
        'Long-term validity'
      ],
      icon: BarChart3
    },
    {
      title_ar: 'كيماويات المعامل فائقة النقاء',
      title_en: 'Ultra-Pure Laboratory Chemicals',
      desc_ar: 'تشكيلة واسعة من الكيماويات التحليلية والبحثية تدعم كافة التطبيقات من البحث الأساسي إلى التطوير الصناعي.',
      desc_en: 'A wide range of analytical and research chemicals supporting all applications from basic research to industrial development.',
      features_ar: [
        'نقاء 99.99%',
        'تشكيلة واسعة',
        'للبحث والتطوير',
        'تغليف آمن'
      ],
      features_en: [
        '99.99% purity',
        'Wide selection',
        'For research & development',
        'Secure packaging'
      ],
      icon: Microscope
    },
    {
      title_ar: 'البيولوجيا الجزيئية والنانو',
      title_en: 'Molecular Biology & Nanotechnology',
      desc_ar: 'تشمل أطقم الـ PCR ومستلزمات تكنولوجيا النانو لدعم البحث العلمي السيادي.',
      desc_en: 'Including PCR kits and nanotechnology supplies to support sovereign scientific research.',
      features_ar: [
        'أطقم PCR متقدمة',
        'تكنولوجيا النانو',
        'دعم البحث السيادي',
        'تدريب فني شامل'
      ],
      features_en: [
        'Advanced PCR kits',
        'Nanotechnology',
        'Sovereign research support',
        'Comprehensive technical training'
      ],
      icon: Dna
    },
    {
      title_ar: 'تجهيزات المختبرات الشاملة',
      title_en: 'Comprehensive Laboratory Setup',
      desc_ar: 'حلول تسليم المفتاح لتجهيز المختبرات بأحدث المعدات مع دعم فني متكامل يضمن الكفاءة التشغيلية.',
      desc_en: 'Turnkey solutions for equipping laboratories with the latest equipment and integrated technical support ensuring operational efficiency.',
      features_ar: [
        'تسليم المفتاح',
        'أحدث المعدات',
        'دعم فني متكامل',
        'ضمان الجودة'
      ],
      features_en: [
        'Turnkey delivery',
        'Latest equipment',
        'Integrated technical support',
        'Quality assurance'
      ],
      icon: Building2
    }
  ]

  const handleServiceOrder = (serviceTitle) => {
    const message = language === 'ar' 
      ? `مرحباً، أود طلب الخدمة: ${serviceTitle}`
      : `Hello, I would like to order the service: ${serviceTitle}`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCustomService = () => {
    const message = language === 'ar' 
      ? `مرحباً، أحتاج إلى خدمة مخصصة. هل يمكنكم المساعدة؟`
      : `Hello, I need a custom service. Can you help?`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('ourServices')}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              {t('servicesTitleDesc')}
            </p>
            <div className="flex flex-wrap gap-4"></div>
          </div>
          <div className="flex justify-center">
            <img 
              src={servicesImage} 
              alt="Orchid Chemicals Services" 
              className="w-full max-w-none object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t('specializedServices')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('servicesDesc')}
            </p>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const IconComponent = service.icon
            return (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition group">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      <IconComponent className="h-8 w-8" />
                    </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {language === 'ar' ? service.title_ar : service.title_en}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {language === 'ar' ? service.desc_ar : service.desc_en}
                  </p>
                  
                  <ul className="space-y-3">
                    {(language === 'ar' ? service.features_ar : service.features_en).map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-t border-slate-100 dark:border-slate-600">
                  <button 
                    onClick={() => handleServiceOrder(dir === 'ar' ? service.title_ar : service.title_en)}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition font-medium"
                  >
                    {t('orderService')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('needCustomService')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            {t('customServiceDesc')}
          </p>
          <button 
            onClick={handleCustomService}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            {t('contactExpert')}
          </button>
        </div>
      </div>
    </section>
  </div>
  )
}
