import { useState, useEffect } from 'react'
import { LanguageContext } from './language'

const translations = {
  ar: {
    // Layout
    home: 'الرئيسية',
    services: 'خدماتنا',
    about: 'من نحن',
    products: 'منتجاتنا',
    contact: 'تواصل معنا',
    brandName: 'أوركيد',
    orchidChemicals: 'أوركيد للكيماويات',
    trustedPartner: 'شريككم الموثوق منذ 2000',
    trustedPartnerSince: 'شريككم الموثوق في الحلول الكيميائية والتحليلية منذ عام 2000',
    
    // Home
    getStarted: 'ابدأ الآن',
    contactUs: 'تواصل معنا',
    browseProducts: 'تصفح منتجاتنا',
    specializedServices: 'خدماتنا المتخصصة',
    servicesDesc: 'نقدم مجموعة شاملة من الحلول الكيميائية والتحليلية المصممة لتلبية احتياجات القطاعات الأكثر حساسية',
    globalPartners: 'شركاؤنا العالميون',
    partnersDesc: 'نتعاون مع أفضل الشركات العالمية لضمان وصول أعلى مستويات التكنولوجيا إلى السوق المصري',
    readyForPartnership: 'مستعد لبدء شراكة تقنية ممتدة؟',
    partnershipDesc: 'تواصل معنا اليوم واكتشف كيف يمكننا دعم مشروعك البحثي أو الصناعي بأعلى معايير الجودة',
    
    // Services
    ourServices: 'خدماتنا المتخصصة',
    servicesTitleDesc: 'نقدم مجموعة شاملة من الحلول الكيميائية والتحليلية المصممة لتلبية احتياجات القطاعات الأكثر حساسية، مع التزام صارم بأعلى معايير الجودة العالمية.',
    needCustomService: 'هل تحتاج إلى خدمة مخصصة؟',
    customServiceDesc: 'فريقنا جاهز لتصميم حلول كيميائية مخصصة تناسب متطلبات مشروعك الخاص. تواصل معنا لمناقشة احتياجاتك التقنية.',
    contactExpert: 'تواصل مع خبيرنا',
    orderService: 'طلب الخدمة',
    
    // Products
    ourProducts: 'منتجاتنا',
    productsDesc: 'تشكيلة واسعة من الكيماويات والمواد التحليلية عالية الجودة من أفضل الشركات العالمية',
    searchPlaceholder: 'ابحث عن منتج...',
    allProducts: 'كل المنتجات',
    origin: 'المنشأ',
    brand: 'البراند',
    purity: 'النقاء',
    cas: 'CAS',
    inquiryWhatsApp: 'استفسار عبر واتساب',
    cantFindProduct: 'هل لا تجد ما تبحث عنه؟',
    cantFindDesc: 'فريقنا جاهز لمساعدتك في العثور على المنتج المناسب أو توريد مواد خاصة بمتطلبات مشروعك.',
    contactExpertBtn: 'تواصل مع خبيرنا',
    
    // About
    aboutUs: 'من نحن',
    ourValues: 'قيمنا الجوهرية',
    ourJourney: 'رحلتنا عبر الزمن',
    yearsExperience: 'سنة من الخبرة',
    happyClients: 'عميل سعيد',
    globalPartnersBadge: 'شريك عالمي',
    aboutIntro: 'شركة أوركيد للكيماويات، التي تأسست في عام 2000، هي الجسر الرابط بين أحدث الابتكارات العلمية الدولية والمتطلبات الدقيقة للسوق المصري. على مدار أكثر من عقدين، لم نكتفِ بدور الوكيل والموزع المعتمد، بل تحولنا إلى صمام أمان يدعم "السيادة التقنية" للمصانع والمختبرات المحلية.',
    valuesIntro: 'تعمل قيمنا المؤسسية كبوصلة استراتيجية تضمن "الاستدامة التشغيلية" لشركائنا، حيث نؤمن بأن كل جرام من الكيماويات الموردة يحمل مسؤولية دقة النتائج المخبرية النهائية.',
    journeyIntro: 'أكثر من 24 عاماً من التميز والابتكار في خدمة الصناعة المصرية',
    
    // Contact
    contactDesc: 'فريقنا جاهز لمساعدتك في العثور على الحلول الكيميائية المناسبة لمشروعك. تواصل معنا اليوم.',
    contactInfo: 'معلومات التواصل',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    workingHours: 'ساعات العمل',
    satThu: 'السبت - الخميس',
    friClosed: 'الجمعة: مغلق',
    quickContact: 'تواصل سريع عبر الواتساب',
    quickContactDesc: 'للاستفسارات العاجلة، تواصل معنا مباشرة عبر الواتساب',
    contactWhatsApp: 'تواصل عبر الواتساب',
    sendMessage: 'أرسل لنا رسالة',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'الرسالة',
    sendMessageBtn: 'إرسال الرسالة',
    messageSent: 'تم إرسال رسالتك بنجاح!',
    messageSentDesc: 'سنتواصل معك خلال 24 ساعة.',
    quickResponse: 'رد سريع',
    messagePlaceholder: 'صف احتياجاتك أو استفساراتك...',
    
    // Footer
    quickLinks: 'روابط سريعة',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    tryAgain: 'حاول مرة أخرى',
    available: 'متاح',
    from: 'من',
    to: 'إلى',
    closed: 'مغلق',
    menu: 'القائمة',
    highQuality: 'جودة عالية',
    globalOrigin: 'منشأ عالمي',
    noMatchingProducts: 'لا توجد منتجات مطابقة',
    tryChangingSearch: 'حاول تغيير كلمات البحث أو الفئة',
    
    // Company
    chemicals: 'للكيماويات',
    
    // Partners
    ourPartners: 'شركاؤنا',
    
    // (deduplicated keys kept above)
  },
  en: {
    // Layout
    home: 'Home',
    services: 'Services',
    about: 'About Us',
    products: 'Products',
    contact: 'Contact',
    brandName: 'Orchid',
    orchidChemicals: 'Orchid Chemicals',
    trustedPartner: 'Your Trusted Partner Since 2000',
    trustedPartnerSince: 'Your Trusted Partner in Chemical & Analytical Solutions Since 2000',
    
    // Home
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
    browseProducts: 'Browse Products',
    specializedServices: 'Our Specialized Services',
    servicesDesc: 'We offer a comprehensive range of chemical and analytical solutions designed to meet the needs of the most sensitive sectors',
    globalPartners: 'Our Global Partners',
    partnersDesc: 'We collaborate with the best international companies to ensure the highest levels of technology reach the Egyptian market',
    readyForPartnership: 'Ready to Start an Extended Technical Partnership?',
    partnershipDesc: 'Contact us today and discover how we can support your research or industrial project with the highest quality standards',
    
    // Services
    ourServices: 'Our Specialized Services',
    servicesTitleDesc: 'We offer a comprehensive range of chemical and analytical solutions designed to meet the needs of the most sensitive sectors, with strict adherence to the highest international quality standards.',
    needCustomService: 'Need a Custom Service?',
    customServiceDesc: 'Our team is ready to design customized chemical solutions that suit your project\'s specific requirements. Contact us to discuss your technical needs.',
    contactExpert: 'Contact Our Expert',
    orderService: 'Order Service',
    
    // Products
    ourProducts: 'Our Products',
    productsDesc: 'A wide range of high-quality chemicals and analytical materials from the best international companies',
    searchPlaceholder: 'Search for a product...',
    allProducts: 'All Products',
    origin: 'Origin',
    brand: 'Brand',
    purity: 'Purity',
    cas: 'CAS',
    inquiryWhatsApp: 'Inquiry via WhatsApp',
    cantFindProduct: 'Can\'t Find What You\'re Looking For?',
    cantFindDesc: 'Our team is ready to help you find the right product or supply special materials for your project requirements.',
    contactExpertBtn: 'Contact Our Expert',
    
    // About
    aboutUs: 'About Us',
    ourValues: 'Our Core Values',
    ourJourney: 'Our Journey Through Time',
    yearsExperience: 'Years of Experience',
    happyClients: 'Happy Clients',
    globalPartnersBadge: 'Global Partners',
    aboutIntro: 'Orchid Chemicals, established in 2000, is the bridge connecting the latest international scientific innovations with the precise requirements of the Egyptian market. For over two decades, we have evolved from being a certified agent and distributor to becoming a safety valve that supports the "technical sovereignty" of local factories and laboratories.',
    valuesIntro: 'Our institutional values serve as a strategic compass that ensures the "operational sustainability" of our partners, as we believe that every gram of supplied chemicals carries the responsibility for the accuracy of final laboratory results.',
    journeyIntro: 'More than 24 years of excellence and innovation in serving the Egyptian industry',
    
    // Contact
    contactDesc: 'Our team is ready to help you find the right chemical solutions for your project. Contact us today.',
    contactInfo: 'Contact Information',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    workingHours: 'Working Hours',
    satThu: 'Saturday - Thursday',
    friClosed: 'Friday: Closed',
    quickContact: 'Quick Contact via WhatsApp',
    quickContactDesc: 'For urgent inquiries, contact us directly via WhatsApp',
    contactWhatsApp: 'Contact via WhatsApp',
    sendMessage: 'Send Us a Message',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    sendMessageBtn: 'Send Message',
    messageSent: 'Your message has been sent successfully!',
    messageSentDesc: 'We will contact you within 24 hours.',
    quickResponse: 'Quick Response',
    messagePlaceholder: 'Describe your needs or inquiries...',
    
    // Footer
    quickLinks: 'Quick Links',
    allRightsReserved: 'All Rights Reserved.',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    tryAgain: 'Try Again',
    available: 'Available',
    from: 'From',
    to: 'To',
    closed: 'Closed',
    menu: 'Menu',
    highQuality: 'High Quality',
    globalOrigin: 'Global Origin',
    noMatchingProducts: 'No matching products',
    tryChangingSearch: 'Try changing your search terms or category',
    
    // Company
    chemicals: 'Chemicals',
    
    // Partners
    ourPartners: 'Our Partners',
    
    // (deduplicated keys kept above)
  }
}

export function LanguageProvider({ children }) {
  const savedLang = localStorage.getItem('language') || 'ar'
  const [language, setLanguage] = useState(savedLang)
  const [dir, setDir] = useState(savedLang === 'ar' ? 'rtl' : 'ltr')

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
    document.documentElement.setAttribute('dir', dir)
  }, [language, dir])

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
    setDir(newLang === 'ar' ? 'rtl' : 'ltr')
    localStorage.setItem('language', newLang)
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}
