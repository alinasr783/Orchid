import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/useLanguage'
import contactPicture from '../assits/contact.png?format=avif;webp&width=480;768;1024;1440&as=picture'

export default function Contact() {
  const { t, dir } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Send WhatsApp notification
      const message = dir === 'ar'
        ? `رسالة جديدة من ${formData.name}\nالموضوع: ${formData.subject}\nالرسالة: ${formData.message}`
        : `New message from ${formData.name}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
      
      const phone = '201104620984'
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      if (supabase) {
        const { error } = await supabase
          .from('contacts')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString()
          }])
        if (error) throw error
      }

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      window.open(whatsappUrl, '_blank')
      
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sending message:', error)
      const errorMessage = dir === 'ar'
        ? 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل مباشرة عبر الواتساب.'
        : 'An error occurred while sending the message. Please try again or contact us directly via WhatsApp.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    const message = dir === 'ar' 
      ? 'مرحباً، أود الاستفسار عن خدماتكم'
      : 'Hello, I would like to inquire about your services'
    const phone = '201104620984'
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('contactUs')}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              {t('contactDesc')}
            </p>
            <div className="flex flex-wrap gap-4"></div>
          </div>
          <div className="flex justify-center">
            <picture>
              {Array.isArray(contactPicture && contactPicture.sources)
                ? contactPicture.sources.map((s) => (
                    <source key={s.type} srcSet={s.srcset} type={s.type} sizes="(max-width: 768px) 90vw, 50vw" />
                  ))
                : null}
              <img
                src={(contactPicture && contactPicture.img && contactPicture.img.src) || (typeof contactPicture === 'string' ? contactPicture : '')}
                srcSet={(contactPicture && contactPicture.img && contactPicture.img.srcset) || undefined}
                alt="Orchid Chemicals Contact"
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

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('contactUs')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {dir === 'ar' 
                ? 'نحن هنا لمساعدتك في العثور على الحلول الكيميائية المناسبة لمشروعك. تواصل معنا اليوم.'
                : 'We are here to help you find the right chemical solutions for your project. Contact us today.'
              }
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('contactInfo')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('phone')}</h3>
                    <p className="text-slate-600 dark:text-slate-400">01104620984</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {dir === 'ar' ? 'متاح من 9 صباحاً حتى 5 مساءً' : 'Available from 9 AM to 5 PM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('email')}</h3>
                    <p className="text-slate-600 dark:text-slate-400">sales@orchidchemi.com</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {dir === 'ar' ? 'نرد خلال 24 ساعة' : 'Response within 24 hours'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('address')}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {dir === 'ar' ? '1 شارع الجوت، أمام محطة مترو كلية الزراعة' : '1 El-Gout Street, In front of Agriculture College Metro Station'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {dir === 'ar' ? 'جامعة عين شمس، القاهرة' : 'Ain Shams University, Cairo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('workingHours')}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t('satThu')}: 9 {dir === 'ar' ? 'ص' : 'AM'} - 5 {dir === 'ar' ? 'م' : 'PM'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">{t('friClosed')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950 p-6 rounded-2xl">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-3">{t('quickContact')}</h3>
              <p className="text-emerald-700 dark:text-emerald-400 mb-4">
                {t('quickContactDesc')}
              </p>
              <button
                onClick={openWhatsApp}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                {t('contactWhatsApp')}
              </button>
              <a
                href="https://www.facebook.com/share/1FPbbgPCRq/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('sendMessage')}</h2>
            
            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-lg mb-6">
                <p className="font-medium">{t('messageSent')}</p>
                <p className="text-sm">{t('messageSentDesc')}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('fullName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('email')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('phoneNumber')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('subject')} *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('message')} *</label>
                  <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder={t('messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') : t('sendMessageBtn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}
