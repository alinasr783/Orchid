import { FlaskConical, Award, Users, Calendar, MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/useLanguage'
import whoUsPicture from '../assits/who_us.png?format=avif;webp&width=480;768;1024;1440&as=picture'

export default function About() {
  const { t, dir, language } = useLanguage()
  const milestones = [
    { 
      year: '2000', 
      title_ar: 'التأسيس', 
      title_en: 'Foundation',
      desc_ar: 'تأسست أوركيد للكيماويات لتكون الجسر بين الابتكارات العلمية الدولية والسوق المصري.', 
      desc_en: 'Orchid Chemicals was established to be the bridge between international scientific innovations and the Egyptian market.'
    },
    { 
      year: '2005', 
      title_ar: 'التوسع الإقليمي', 
      title_en: 'Regional Expansion',
      desc_ar: 'بدأنا في توسيع نطاق خدماتنا لتغطية المزيد من القطاعات الصناعية.', 
      desc_en: 'We began expanding our service scope to cover more industrial sectors.'
    },
    { 
      year: '2010', 
      title_ar: 'الاعتمادات الدولية', 
      title_en: 'International Accreditations',
      desc_ar: 'حصلنا على اعتمادات من كبرى الشركات العالمية في مجال الكيماويات.', 
      desc_en: 'We obtained accreditations from major global companies in the chemicals field.'
    },
    { 
      year: '2015', 
      title_ar: 'الابتكار التقني', 
      title_en: 'Technical Innovation',
      desc_ar: 'أطلقنا حلول الـ PCR المتقدمة لدعم البحث العلمي السيادي.', 
      desc_en: 'We launched advanced PCR solutions to support sovereign scientific research.'
    },
    { 
      year: '2020', 
      title_ar: 'التحول الرقمي', 
      title_en: 'Digital Transformation',
      desc_ar: 'أطلقنا منصتنا الرقمية لتسهيل التواصل مع عملائنا.', 
      desc_en: 'We launched our digital platform to facilitate communication with our clients.'
    },
    { 
      year: '2024', 
      title_ar: 'الريادة السوقية', 
      title_en: 'Market Leadership',
      desc_ar: 'أصبحنا من الشركات الرائدة في مجال الكيماويات التحليلية في مصر.', 
      desc_en: 'We became one of the leading companies in the analytical chemicals field in Egypt.'
    }
  ]

  const values = [
    {
      title_ar: 'الدقة والجودة',
      title_en: 'Precision & Quality',
      desc_ar: 'تخضع عملية اختيار منتجاتنا لبروتوكولات تدقيق صارمة لضمان مطابقتها لأرقى المعايير الدولية.',
      desc_en: 'Our product selection process undergoes strict auditing protocols to ensure compliance with the highest international standards.',
      icon: <Award className="h-8 w-8 text-emerald-600" />
    },
    {
      title_ar: 'الالتزام والاحترافية',
      title_en: 'Commitment & Professionalism',
      desc_ar: 'نتبنى نهج التميز في إدارة الوقت واحترام مواعيد التوريد كركيزة أساسية في استدامة الشراكة التقنية.',
      desc_en: 'We adopt excellence in time management and delivery schedule adherence as a fundamental pillar in sustaining technical partnerships.',
      icon: <Users className="h-8 w-8 text-emerald-600" />
    },
    {
      title_ar: 'الابتكار التحويلي',
      title_en: 'Transformative Innovation',
      desc_ar: 'نقدم حلولاً متقدمة في البيولوجيا الجزيئية والنانو لدعم البحث العلمي السيادي في مصر.',
      desc_en: 'We provide advanced solutions in molecular biology and nanotechnology to support sovereign scientific research in Egypt.',
      icon: <FlaskConical className="h-8 w-8 text-emerald-600" />
    }
  ]

  const handleContactExpert = () => {
    const message = language === 'ar' 
      ? `مرحباً، أود التحدث مع خبيركم حول مشروعي. هل يمكنكم المساعدة؟`
      : `Hello, I would like to speak with your expert about my project. Can you help?`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('aboutUs')}
              <span className="block text-emerald-600 dark:text-emerald-400">{t('orchidChemicals')}</span>
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">{t('aboutIntro')}</p>
            <div className="flex flex-wrap gap-4"></div>
          </div>
          <div className="flex justify-center">
            <picture>
              {Array.isArray(whoUsPicture && whoUsPicture.sources)
                ? whoUsPicture.sources.map((s) => (
                    <source key={s.type} srcSet={s.srcset} type={s.type} sizes="(max-width: 768px) 90vw, 50vw" />
                  ))
                : null}
              <img
                src={(whoUsPicture && whoUsPicture.img && whoUsPicture.img.src) || (typeof whoUsPicture === 'string' ? whoUsPicture : '')}
                srcSet={(whoUsPicture && whoUsPicture.img && whoUsPicture.img.srcset) || undefined}
                alt="Orchid Chemicals About Us"
                className="w-full max-w-none object-cover rounded-2xl shadow-2xl"
                width="1200"
                height="800"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('ourValues')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{t('valuesIntro')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition">
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {language === 'ar' ? value.title_ar : value.title_en}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'ar' ? value.desc_ar : value.desc_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('ourJourney')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">{t('journeyIntro')}</p>
          </div>

          <div className="relative">
            <div
              className={`hidden md:block absolute ${dir === 'rtl' ? 'right-1/2' : 'left-1/2'} top-0 bottom-0 w-1 bg-emerald-200 dark:bg-emerald-800 transform ${dir === 'rtl' ? 'translate-x-1/2' : '-translate-x-1/2'}`}
            ></div>
            <div
              className={`md:hidden absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-0 bottom-0 w-px bg-emerald-200 dark:bg-emerald-800`}
            ></div>
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {milestones.map((milestone, i) => {
                const isEven = i % 2 === 0
                const desktopDirection = isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                const desktopPad = isEven ? 'md:pl-12 md:pr-0' : 'md:pr-12 md:pl-0'
                const mobilePad = dir === 'rtl' ? 'pr-12 pl-0' : 'pl-12 pr-0'
                const mobileDotPos = dir === 'rtl' ? 'right-4' : 'left-4'
                const desktopDotPos = dir === 'rtl' ? 'right-1/2' : 'left-1/2'
                const desktopDotTransform = dir === 'rtl' ? 'translate-x-1/2' : '-translate-x-1/2'
                const cardTextAlign = dir === 'rtl' ? 'text-right' : 'text-left'
                const metaRow = dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'
                return (
                  <div key={i} className={`relative flex flex-col md:items-center ${desktopDirection}`}>
                    <div className="hidden md:block md:w-1/2"></div>
                    <div
                      className={`md:hidden absolute ${mobileDotPos} top-6 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white dark:border-slate-900`}
                    ></div>
                    <div
                      className={`hidden md:block absolute ${desktopDotPos} top-1/2 transform -translate-y-1/2 ${desktopDotTransform} w-4 h-4 bg-emerald-600 rounded-full border-4 border-white dark:border-slate-900`}
                    ></div>
                    <div className={`w-full md:w-1/2 ${mobilePad} ${desktopPad}`}>
                      <div className={`bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600 ${cardTextAlign} break-words`}>
                        <div className={`flex items-center gap-3 mb-3 ${metaRow}`}>
                          <Calendar className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-emerald-600">{milestone.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {language === 'ar' ? milestone.title_ar : milestone.title_en}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          {language === 'ar' ? milestone.desc_ar : milestone.desc_en}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('readyForPartnership')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('partnershipDesc')}
          </p>
          <button 
            onClick={handleContactExpert}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition font-medium inline-flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            {t('contactExpert')}
          </button>
        </div>
      </section>
    </div>
  )
}
