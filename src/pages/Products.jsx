import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search, Filter, Package, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/useLanguage'
import productsImage from '../assits/products.png'

export default function Products() {
  const { t, dir, language } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState({ title: '', title_ar: '', description: '', description_ar: '', hero_url: '' })

  const categories = [
    { id: 'all', name_ar: 'كل المنتجات', name_en: 'All Products' },
    { id: 'apis', name_ar: 'الخامات الدوائية', name_en: 'Pharmaceutical APIs' },
    { id: 'hplc', name_ar: 'محاليل HPLC', name_en: 'HPLC Solutions' },
    { id: 'standards', name_ar: 'المعايير المرجعية', name_en: 'Reference Standards' },
    { id: 'pure-chemicals', name_ar: 'كيماويات فائقة النقاء', name_en: 'Ultra-Pure Chemicals' },
    { id: 'molecular', name_ar: 'البيولوجيا الجزيئية', name_en: 'Molecular Biology' },
    { id: 'equipment', name_ar: 'تجهيزات المختبرات', name_en: 'Laboratory Equipment' }
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      
      if (error) {
        console.warn('Supabase error:', error)
        // Don't throw, just use fallback data
      } else if (data && data.length > 0) {
        setProducts(data)
        setLoading(false)
        return
      }
    } catch (err) {
      console.warn('Network/Supabase error:', err)
      // Continue to fallback data
    }
    
    // Fallback data for when Supabase is not available
    console.log('Using fallback product data')
    setProducts([
      { 
        id: 1, 
        name: 'Paracetamol API', 
        name_ar: 'الباراسيتامول API',
        category: 'apis', 
        description: 'High-quality pharmaceutical raw material', 
        description_ar: 'خامة دوائية عالية الجودة',
        origin: 'Germany', 
        origin_ar: 'ألمانيا',
        purity: '99.9%', 
        cas: '103-90-2',
        image: '/placeholder-product.jpg'
      },
      { 
        id: 2, 
        name: 'Acetonitrile HPLC', 
        name_ar: 'أسيتونيتريل HPLC',
        category: 'hplc', 
        description: 'High-purity solvent for analytical applications', 
        description_ar: 'مذيب عالي النقاء للتطبيقات التحليلية',
        origin: 'USA', 
        origin_ar: 'الولايات المتحدة',
        purity: '99.99%', 
        cas: '75-05-8',
        image: '/placeholder-product.jpg'
      },
      { 
        id: 3, 
        name: 'Reference Standard', 
        name_ar: 'معيار مرجعي',
        category: 'standards', 
        description: 'Certified analytical reference material', 
        description_ar: 'مادة مرجعية تحليلية معتمدة',
        origin: 'UK', 
        origin_ar: 'المملكة المتحدة',
        purity: '99.5%', 
        cas: '50-78-2',
        image: '/placeholder-product.jpg'
      }
    ])
    setLoading(false)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      fetchProducts()
    }, 0)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('products_page')
          .select('*')
          .limit(1)
          .maybeSingle()
        if (!error && data) {
          setPage({
            title: data.title || '',
            title_ar: data.title_ar || '',
            description: data.description || '',
            description_ar: data.description_ar || '',
            hero_url: data.hero_url || '',
          })
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  const openWhatsApp = (product) => {
    const message = language === 'ar' 
      ? `مرحباً، أود الاستفسار عن المنتج: ${product.name_ar || product.name}`
      : `Hello, I would like to inquire about the product: ${product.name}`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  const filteredProducts = products.filter(product => {
    const nameText = (language === 'ar' ? (product.name_ar || product.name) : product.name) || ''
    const descText = (language === 'ar' ? (product.description_ar || product.description) : product.description) || ''
    const matchesSearch = nameText.toLowerCase().includes(search.toLowerCase()) ||
                          descText.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              {language === 'ar' ? (page.title_ar || t('ourProducts')) : (page.title || t('ourProducts'))}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6 md:mb-8">
              {language === 'ar' ? (page.description_ar || t('productsDesc')) : (page.description || t('productsDesc'))}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
                {t('highQuality')}
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
                {t('globalOrigin')}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src={page.hero_url || productsImage} 
              alt="Orchid Chemicals Products" 
              className="w-full max-w-none object-cover rounded-2xl shadow-2xl"
              width="1200"
              height="800"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {language === 'ar' ? (page.title_ar || t('ourProducts')) : (page.title || t('ourProducts'))}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {language === 'ar' ? (page.description_ar || t('productsDesc')) : (page.description || t('productsDesc'))}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute ${dir === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400`} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full ${dir === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
              </div>
              <div className="relative">
                <Filter className={`absolute ${dir === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400`} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${dir === 'ar' ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'ar' ? cat.name_ar : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 animate-pulse">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {(product.card_image_url || product.thumbnail_url || product.image_url || product.image) ? (
                      <img
                        src={product.card_image_url || product.thumbnail_url || product.image_url || product.image}
                        alt={language === 'ar' ? (product.name_ar || product.name) : product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="600"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/600x600/0f172a/ffffff?text=${encodeURIComponent(
                            language === 'ar' ? (product.name_ar || product.name) : product.name
                          )}`
                        }}
                      />
                    ) : (
                      <Package className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {language === 'ar' ? (product.name_ar || product.name) : product.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 sm:mb-4">
                      {language === 'ar' ? (product.description_ar || product.description) : product.description}
                    </p>
                    
                    <div className="space-y-2 mb-3 sm:mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-500">{t('brand')}:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {language === 'ar' ? (product.origin_ar || product.origin) : product.origin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-500">{t('purity')}:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{product.purity}</span>
                      </div>
                      {product.cas && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-500">CAS:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">{product.cas}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        to={`/products/${product.id}`}
                        className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 transition text-sm font-medium text-center"
                      >
                        {t('viewDetails')}
                      </Link>
                      <button
                        onClick={() => openWhatsApp(product)}
                        className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition"
                        title={t('inquiryWhatsApp')}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-slate-400 dark:text-slate-500 mb-3 sm:mb-4">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white mb-2">
                {t('noMatchingProducts')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                {t('tryChangingSearch')}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 sm:mt-16 bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{t('cantFindProduct')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              {t('cantFindDesc')}
            </p>
            <button
              onClick={() => openWhatsApp({ name: language === 'ar' ? 'استشارة خاصة' : 'Custom consultation' })}
              className="bg-emerald-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('contactExpertBtn')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
