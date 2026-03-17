import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, MessageCircle, Package, Facebook } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useLanguage } from '../contexts/useLanguage'
import { useCallback } from 'react'
import { supabase } from '../lib/supabase'

const fallbackProducts = [
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
    card_image_url: '/placeholder-product.jpg'
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
    card_image_url: '/placeholder-product.jpg'
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
    card_image_url: '/placeholder-product.jpg'
  }
]

export default function ProductDetail() {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productImageUrls, setProductImageUrls] = useState([])
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isAutoSlideshowPaused, setIsAutoSlideshowPaused] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      const numericId = Number(id)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', numericId)
        .single()

      if (error) throw error
      if (data) {
        setProduct(data)
      }

      try {
        if (data) {
          const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('url, sort_order, is_primary')
          .eq('product_id', data.id)
          .order('is_primary', { ascending: false })
          .order('sort_order', { ascending: true })

          if (!imagesError) {
            const urls = [
              data?.card_image_url,
              ...(imagesData || []).map((img) => img.url)
            ].filter(Boolean)
            const uniqueUrls = Array.from(new Set(urls))
            setProductImageUrls(uniqueUrls)
          }
        } else {
          throw new Error('No product data, use fallback images')
        }
      } catch {
        const fb = fallbackProducts.find((p) => p.id === Number(id))
        setProductImageUrls(fb?.card_image_url ? [fb.card_image_url] : [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      const fb = fallbackProducts.find((p) => p.id === Number(id))
      if (fb) {
        setProduct(fb)
        setProductImageUrls(fb.card_image_url ? [fb.card_image_url] : [])
      }
    } finally {
      setLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  // Auto slideshow every 3 seconds
  useEffect(() => {
    if (productImageUrls.length <= 1 || isAutoSlideshowPaused) return
    
    const interval = setInterval(() => {
      setMainImageIndex((prev) => (prev + 1) % productImageUrls.length)
      if (swiperInstance) {
        swiperInstance.slideNext()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [productImageUrls.length, swiperInstance, isAutoSlideshowPaused])

  const handleWhatsAppClick = () => {
    const message = language === 'ar' 
      ? `مرحباً، أود الاستفسار عن المنتج: ${product?.name_ar || product?.name}`
      : `Hello, I would like to inquire about the product: ${product?.name}`
    
    window.open(`https://wa.me/201104620984?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">{t('error')}</p>
          <Link to="/products" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
            ← {t('browseProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          {t('browseProducts')}
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
            {/* Product Image Carousel */}
            <div className="space-y-4">
              {productImageUrls.length > 1 && (
                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'انقر على الصورة أو الصور المصغرة للتبديل، أو اتركها لتتغير تلقائياً' : 'Click image or thumbnails to switch, or let it auto-change'}
                </div>
              )}
              {/* Mobile: clickable image */}
              <div className="block md:hidden">
                <div 
                  className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer relative"
                  onClick={() => setIsAutoSlideshowPaused(!isAutoSlideshowPaused)}
                >
                  {productImageUrls[mainImageIndex] ? (
                    <img
                      src={productImageUrls[mainImageIndex]}
                      alt={language === 'ar' ? product?.name_ar || product?.name : product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/900x900/0f172a/ffffff?text=${encodeURIComponent(
                          language === 'ar' ? product?.name_ar || product?.name : product?.name
                        )}`
                      }}
                    />
                  ) : (
                    <Package className="h-24 w-24 text-slate-400 dark:text-slate-500" />
                  )}
                  {productImageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {mainImageIndex + 1} / {productImageUrls.length}
                    </div>
                  )}
                </div>
                {productImageUrls.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {productImageUrls.slice(0, 3).map((url, index) => (
                      <button
                        key={url || index}
                        onClick={() => {
                          setMainImageIndex(index)
                          setIsAutoSlideshowPaused(true)
                        }}
                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                          index === mainImageIndex
                            ? 'ring-2 ring-emerald-500 bg-slate-200 dark:bg-slate-600'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x300/0f172a/ffffff?text=${encodeURIComponent(
                              language === 'ar' ? product?.name_ar || product?.name : product?.name
                            )}`
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Desktop: swiper */}
              <div className="hidden md:block">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation={true}
                  className="rounded-lg"
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => {
                    setMainImageIndex(swiper.activeIndex)
                  }}
                  initialSlide={mainImageIndex}
                  autoplay={!isAutoSlideshowPaused ? { delay: 3000, disableOnInteraction: false } : false}
                >
                  {(productImageUrls.length > 0 ? productImageUrls : [null]).map((url, index) => (
                    <SwiperSlide key={url || index}>
                      <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {url ? (
                          <img
                            src={url}
                            alt={language === 'ar' ? product?.name_ar || product?.name : product?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/900x900/0f172a/ffffff?text=${encodeURIComponent(
                                language === 'ar' ? product?.name_ar || product?.name : product?.name
                              )}`
                            }}
                          />
                        ) : (
                          <Package className="h-24 w-24 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {productImageUrls.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {productImageUrls.slice(0, 3).map((url, index) => (
                      <button
                        key={url || index}
                        type="button"
                        onClick={() => {
                          swiperInstance?.slideTo(index)
                          setMainImageIndex(index)
                          setIsAutoSlideshowPaused(true)
                        }}
                        className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition overflow-hidden ${
                          index === mainImageIndex
                            ? 'ring-2 ring-emerald-500 bg-slate-200 dark:bg-slate-600'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/300x300/0f172a/ffffff?text=${encodeURIComponent(
                              language === 'ar' ? product?.name_ar || product?.name : product?.name
                            )}`
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'ar' ? product.name_ar : product.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {language === 'ar' ? product.description_ar : product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('brand')}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? product.origin_ar || product.origin : product.origin}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('purity')}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{product.purity}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">CAS</h3>
                  <p className="text-slate-600 dark:text-slate-400">{product.cas || t('available')}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('available')}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ {t('available')}</p>
                </div>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t('inquiryWhatsApp')}
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

          {/* Additional Information */}
          {product.specifications && (
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400">{product.specifications}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
