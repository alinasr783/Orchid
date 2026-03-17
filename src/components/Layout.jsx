import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, Globe, Sun, Moon, Home, Briefcase, Info, Package, MessageCircle, Facebook } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/useLanguage'
import { useTheme } from '../contexts/useTheme'
import logoPicture from '../assits/logo.png?format=webp;png&width=96;168;320&as=picture'
import { trackPageView } from '../lib/analytics'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { t, toggleLanguage, language, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/dashbord')
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setOpen(false), 0)
    trackPageView(location.pathname)
  }, [location.pathname])
  const phone = '201104620984'
  const message = language === 'ar' ? 'مرحباً، أود الاستفسار عن خدماتكم' : 'Hello, I would like to inquire about your services'
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  useEffect(() => {
    const titles = {
      '/': language === 'ar' ? 'الرئيسية' : 'Home',
      '/services': language === 'ar' ? 'خدماتنا' : 'Services',
      '/about': language === 'ar' ? 'من نحن' : 'About',
      '/products': language === 'ar' ? 'منتجاتنا' : 'Products',
      '/contact': language === 'ar' ? 'تواصل معنا' : 'Contact',
    }
    const label = titles[location.pathname] || ''
    document.title = `Rchid | ${label || 'Chemicals'}`
    const link = document.querySelector('link[rel="icon"]')
    if (link) {
      const src = (logoPicture && logoPicture.img && logoPicture.img.src) || (typeof logoPicture === 'string' ? logoPicture : '/logo.png')
      link.setAttribute('href', src)
    }
  }, [location.pathname, language])
  const containerAlign = dir === 'rtl' ? 'text-right' : 'text-left'
  const headingAlign = dir === 'rtl' ? 'text-right' : 'text-left'
  const rowClass = dir === 'rtl' ? 'flex-row-reverse justify-end text-right' : 'justify-start text-left'
  const navItems = [
    { to: '/', label: t('home'), iconDesktop: <Home className="h-4 w-4 text-slate-500 dark:text-slate-400" />, iconMobile: <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> },
    { to: '/services', label: t('services'), iconDesktop: <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />, iconMobile: <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> },
    { to: '/about', label: t('about'), iconDesktop: <Info className="h-4 w-4 text-slate-500 dark:text-slate-400" />, iconMobile: <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> },
    { to: '/products', label: t('products'), iconDesktop: <Package className="h-4 w-4 text-slate-500 dark:text-slate-400" />, iconMobile: <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> },
    { to: '/contact', label: t('contact'), iconDesktop: <MessageCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />, iconMobile: <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200" dir={dir}>
      {/* Header */}
      {!isDashboard && (
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <picture>
              {Array.isArray(logoPicture && logoPicture.sources)
                ? logoPicture.sources.map((s) => (
                    <source key={s.type} srcSet={s.srcset} type={s.type} sizes="(max-width: 640px) 96px, (max-width: 1024px) 168px, 168px" />
                  ))
                : null}
              <img
                src={(logoPicture && logoPicture.img && logoPicture.img.src) || (typeof logoPicture === 'string' ? logoPicture : '/logo.png')}
                srcSet={(logoPicture && logoPicture.img && logoPicture.img.srcset) || undefined}
                alt="Orchid Chemicals"
                className="h-14 w-24 sm:h-20 sm:w-20 object-contain"
                width="96"
                height="56"
                decoding="async"
                loading="eager"
              />
            </picture>
            <div className="flex flex-col">
              <span className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white"></span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {item.iconDesktop}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition ring-1 ring-emerald-400/40"
              onClick={() => setOpen(!open)}
              aria-label={t('menu')}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-sm font-semibold">{t('menu')}</span>
            </button>
          </div>
        </div>

      </header>
      )}
      {/* Mobile Nav Overlay */}
      {!isDashboard && open && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Mobile Nav Drawer */}
      {!isDashboard && (
      <div className={`md:hidden fixed top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="font-semibold text-slate-900 dark:text-white">{t('menu')}</span>
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4">
          <div className={`flex flex-col gap-2 ${dir === 'rtl' ? 'items-end' : 'items-start'}`}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {item.iconMobile}
                <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
              </Link>
            ))}
            <a
              href="https://www.facebook.com/share/1FPbbgPCRq/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-slate-900 dark:text-white">Facebook</span>
            </a>
          </div>
        </nav>
      </div>
      )}


      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* bottom nav moved to dashboard only */}

      {!isDashboard && !open && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className={`fixed ${dir === 'rtl' ? 'left-4' : 'right-4'} bottom-4 z-50`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">WhatsApp</span>
          </span>
        </a>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <img
                src={(logoPicture && logoPicture.img && logoPicture.img.src) || (typeof logoPicture === 'string' ? logoPicture : '/logo.png')}
                alt="Orchid Chemicals"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
              <span className="text-lg sm:text-xl font-semibold text-white">{t('orchidChemicals')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('trustedPartnerSince')}
            </p>
          </div>

          <div className={containerAlign}>
            <h3 className={`font-semibold text-white mb-3 text-sm sm:text-base ${headingAlign}`}>{t('contactInfo')}</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className={`flex items-center ${rowClass} gap-2`}>
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>01104620984</span>
              </div>
              <div className={`flex items-center ${rowClass} gap-2`}>
                <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="break-all">sales@orchidchemi.com</span>
              </div>
              <div className={`flex items-center ${rowClass} gap-2`}>
                <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>1 شارع الجوت، القاهرة</span>
              </div>
              <a 
                href="https://www.facebook.com/share/1FPbbgPCRq/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center ${rowClass} gap-2 hover:text-emerald-400 transition`}
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">{t('quickLinks')}</h3>
            <div className="space-y-2 text-sm">
              <Link to="/services" className="block hover:text-emerald-400 transition">{t('services')}</Link>
              <Link to="/about" className="block hover:text-emerald-400 transition">{t('about')}</Link>
              <Link to="/products" className="block hover:text-emerald-400 transition">{t('products')}</Link>
              <Link to="/contact" className="block hover:text-emerald-400 transition">{t('contact')}</Link>
              <a 
                href="https://www.facebook.com/share/1FPbbgPCRq/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
          © 2024 {t('orchidChemicals')}. {t('allRightsReserved')}
        </div>
      </footer>
    </div>
  )
}
