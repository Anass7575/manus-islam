import { createContext, useContext, useState, useEffect } from 'react'

// Définition des langues supportées avec leurs métadonnées
const SUPPORTED_LANGUAGES = [
  { 
    code: 'ar', 
    name: 'العربية', 
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
    quranEdition: 'ar.alafasy',
    translationEdition: null // Texte original
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
    quranEdition: 'en.sahih',
    translationEdition: 'en.sahih'
  },
  { 
    code: 'fr', 
    name: 'Français', 
    nativeName: 'Français',
    dir: 'ltr',
    flag: '🇫🇷',
    quranEdition: 'fr.hamidullah',
    translationEdition: 'fr.hamidullah'
  },
  { 
    code: 'es', 
    name: 'Español', 
    nativeName: 'Español',
    dir: 'ltr',
    flag: '🇪🇸',
    quranEdition: 'es.cortes',
    translationEdition: 'es.cortes'
  },
  { 
    code: 'hi', 
    name: 'हिन्दी', 
    nativeName: 'हिन्दी',
    dir: 'ltr',
    flag: '🇮🇳',
    quranEdition: 'hi.hindi',
    translationEdition: 'hi.hindi'
  },
  { 
    code: 'zh', 
    name: '中文', 
    nativeName: '中文',
    dir: 'ltr',
    flag: '🇨🇳',
    quranEdition: 'zh.jian',
    translationEdition: 'zh.jian'
  },
  { 
    code: 'ru', 
    name: 'Русский', 
    nativeName: 'Русский',
    dir: 'ltr',
    flag: '🇷🇺',
    quranEdition: 'ru.kuliev',
    translationEdition: 'ru.kuliev'
  },
  { 
    code: 'bn', 
    name: 'বাংলা', 
    nativeName: 'বাংলা',
    dir: 'ltr',
    flag: '🇧🇩',
    quranEdition: 'bn.bengali',
    translationEdition: 'bn.bengali'
  },
  { 
    code: 'pt', 
    name: 'Português', 
    nativeName: 'Português',
    dir: 'ltr',
    flag: '🇧🇷',
    quranEdition: 'pt.elhayek',
    translationEdition: 'pt.elhayek'
  },
  { 
    code: 'ur', 
    name: 'اردو', 
    nativeName: 'اردو',
    dir: 'rtl',
    flag: '🇵🇰',
    quranEdition: 'ur.jalandhry',
    translationEdition: 'ur.jalandhry'
  }
]

// Traductions de l'interface utilisateur
const UI_TRANSLATIONS = {
  ar: {
    home: 'الرئيسية',
    quran: 'القرآن',
    hadith: 'الحديث',
    search: 'بحث',
    searchPlaceholder: 'البحث في القرآن أو الأحاديث...',
    startReading: 'ابدأ القراءة',
    exploreHadiths: 'استكشف الأحاديث',
    features: 'الميزات',
    multilingual: 'متعدد اللغات',
    multilingualDesc: 'متوفر بأكثر اللغات تحدثاً في العالم',
    advancedSearch: 'بحث متقدم',
    advancedSearchDesc: 'ابحث بسهولة في القرآن والأحاديث',
    intuitiveNavigation: 'تنقل بديهي',
    intuitiveNavigationDesc: 'واجهة حديثة وسهلة الاستخدام',
    verses: 'آيات',
    chapters: 'فصول',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    noResults: 'لا توجد نتائج'
  },
  en: {
    home: 'Home',
    quran: 'Quran',
    hadith: 'Hadith',
    search: 'Search',
    searchPlaceholder: 'Search in Quran or Hadiths...',
    startReading: 'Start Reading',
    exploreHadiths: 'Explore Hadiths',
    features: 'Features',
    multilingual: 'Multilingual',
    multilingualDesc: 'Available in the 10 most spoken languages worldwide',
    advancedSearch: 'Advanced Search',
    advancedSearchDesc: 'Easily search through Quran and Hadiths',
    intuitiveNavigation: 'Intuitive Navigation',
    intuitiveNavigationDesc: 'Modern and easy-to-use interface',
    verses: 'verses',
    chapters: 'chapters',
    loading: 'Loading...',
    error: 'Error',
    noResults: 'No results found'
  },
  fr: {
    home: 'Accueil',
    quran: 'Coran',
    hadith: 'Sahih al-Bukhari',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher dans le Coran ou les hadiths...',
    startReading: 'Commencer la lecture',
    exploreHadiths: 'Explorer les hadiths',
    features: 'Fonctionnalités',
    multilingual: 'Multilingue',
    multilingualDesc: 'Disponible dans les 10 langues les plus parlées au monde',
    advancedSearch: 'Recherche avancée',
    advancedSearchDesc: 'Recherchez facilement dans le Coran et les hadiths',
    intuitiveNavigation: 'Navigation intuitive',
    intuitiveNavigationDesc: 'Interface moderne et facile à utiliser',
    verses: 'versets',
    chapters: 'chapitres',
    loading: 'Chargement...',
    error: 'Erreur',
    noResults: 'Aucun résultat trouvé'
  },
  es: {
    home: 'Inicio',
    quran: 'Corán',
    hadith: 'Hadiz',
    search: 'Buscar',
    searchPlaceholder: 'Buscar en el Corán o Hadiths...',
    startReading: 'Comenzar a leer',
    exploreHadiths: 'Explorar Hadiths',
    features: 'Características',
    multilingual: 'Multilingüe',
    multilingualDesc: 'Disponible en los 10 idiomas más hablados del mundo',
    advancedSearch: 'Búsqueda avanzada',
    advancedSearchDesc: 'Busca fácilmente en el Corán y Hadiths',
    intuitiveNavigation: 'Navegación intuitiva',
    intuitiveNavigationDesc: 'Interfaz moderna y fácil de usar',
    verses: 'versículos',
    chapters: 'capítulos',
    loading: 'Cargando...',
    error: 'Error',
    noResults: 'No se encontraron resultados'
  },
  hi: {
    home: 'होम',
    quran: 'कुरान',
    hadith: 'हदीस',
    search: 'खोजें',
    searchPlaceholder: 'कुरान या हदीस में खोजें...',
    startReading: 'पढ़ना शुरू करें',
    exploreHadiths: 'हदीस देखें',
    features: 'विशेषताएं',
    multilingual: 'बहुभाषी',
    multilingualDesc: 'दुनिया की 10 सबसे अधिक बोली जाने वाली भाषाओं में उपलब्ध',
    advancedSearch: 'उन्नत खोज',
    advancedSearchDesc: 'कुरान और हदीस में आसानी से खोजें',
    intuitiveNavigation: 'सहज नेवीगेशन',
    intuitiveNavigationDesc: 'आधुनिक और उपयोग में आसान इंटरफेस',
    verses: 'आयतें',
    chapters: 'अध्याय',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    noResults: 'कोई परिणाम नहीं मिला'
  },
  zh: {
    home: '首页',
    quran: '古兰经',
    hadith: '圣训',
    search: '搜索',
    searchPlaceholder: '在古兰经或圣训中搜索...',
    startReading: '开始阅读',
    exploreHadiths: '探索圣训',
    features: '功能',
    multilingual: '多语言',
    multilingualDesc: '支持全球10种最常用语言',
    advancedSearch: '高级搜索',
    advancedSearchDesc: '轻松搜索古兰经和圣训',
    intuitiveNavigation: '直观导航',
    intuitiveNavigationDesc: '现代化且易于使用的界面',
    verses: '节',
    chapters: '章',
    loading: '加载中...',
    error: '错误',
    noResults: '未找到结果'
  },
  ru: {
    home: 'Главная',
    quran: 'Коран',
    hadith: 'Хадис',
    search: 'Поиск',
    searchPlaceholder: 'Поиск в Коране или Хадисах...',
    startReading: 'Начать чтение',
    exploreHadiths: 'Изучить Хадисы',
    features: 'Возможности',
    multilingual: 'Многоязычный',
    multilingualDesc: 'Доступен на 10 самых распространенных языках мира',
    advancedSearch: 'Расширенный поиск',
    advancedSearchDesc: 'Легко ищите в Коране и Хадисах',
    intuitiveNavigation: 'Интуитивная навигация',
    intuitiveNavigationDesc: 'Современный и простой в использовании интерфейс',
    verses: 'стихи',
    chapters: 'главы',
    loading: 'Загрузка...',
    error: 'Ошибка',
    noResults: 'Результаты не найдены'
  },
  bn: {
    home: 'হোম',
    quran: 'কুরআন',
    hadith: 'হাদিস',
    search: 'অনুসন্ধান',
    searchPlaceholder: 'কুরআন বা হাদিসে অনুসন্ধান করুন...',
    startReading: 'পড়া শুরু করুন',
    exploreHadiths: 'হাদিস অন্বেষণ করুন',
    features: 'বৈশিষ্ট্য',
    multilingual: 'বহুভাষিক',
    multilingualDesc: 'বিশ্বের ১০টি সর্বাধিক কথ্য ভাষায় উপলব্ধ',
    advancedSearch: 'উন্নত অনুসন্ধান',
    advancedSearchDesc: 'কুরআন এবং হাদিসে সহজে অনুসন্ধান করুন',
    intuitiveNavigation: 'স্বজ্ঞাত নেভিগেশন',
    intuitiveNavigationDesc: 'আধুনিক এবং ব্যবহার করা সহজ ইন্টারফেস',
    verses: 'আয়াত',
    chapters: 'অধ্যায়',
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    noResults: 'কোন ফলাফল পাওয়া যায়নি'
  },
  pt: {
    home: 'Início',
    quran: 'Alcorão',
    hadith: 'Hadith',
    search: 'Buscar',
    searchPlaceholder: 'Buscar no Alcorão ou Hadiths...',
    startReading: 'Começar a ler',
    exploreHadiths: 'Explorar Hadiths',
    features: 'Recursos',
    multilingual: 'Multilíngue',
    multilingualDesc: 'Disponível nos 10 idiomas mais falados do mundo',
    advancedSearch: 'Busca avançada',
    advancedSearchDesc: 'Busque facilmente no Alcorão e Hadiths',
    intuitiveNavigation: 'Navegação intuitiva',
    intuitiveNavigationDesc: 'Interface moderna e fácil de usar',
    verses: 'versículos',
    chapters: 'capítulos',
    loading: 'Carregando...',
    error: 'Erro',
    noResults: 'Nenhum resultado encontrado'
  },
  ur: {
    home: 'ہوم',
    quran: 'قرآن',
    hadith: 'حدیث',
    search: 'تلاش',
    searchPlaceholder: 'قرآن یا احادیث میں تلاش کریں...',
    startReading: 'پڑھنا شروع کریں',
    exploreHadiths: 'احادیث دیکھیں',
    features: 'خصوصیات',
    multilingual: 'کثیر لسانی',
    multilingualDesc: 'دنیا کی 10 سب سے زیادہ بولی جانے والی زبانوں میں دستیاب',
    advancedSearch: 'ایڈوانس سرچ',
    advancedSearchDesc: 'قرآن اور احادیث میں آسانی سے تلاش کریں',
    intuitiveNavigation: 'آسان نیویگیشن',
    intuitiveNavigationDesc: 'جدید اور استعمال میں آسان انٹرفیس',
    verses: 'آیات',
    chapters: 'ابواب',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'خرابی',
    noResults: 'کوئی نتیجہ نہیں ملا'
  }
}

// Créer le contexte
const LanguageContext = createContext()

// Hook personnalisé pour utiliser le contexte
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Provider du contexte
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('fr')
  const [isLoading, setIsLoading] = useState(false)

  // Charger la langue depuis localStorage au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('islam-web-language')
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('islam-web-language', currentLanguage)
    
    // Mettre à jour la direction du document
    const currentLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage)
    if (currentLangData) {
      document.documentElement.dir = currentLangData.dir
      document.documentElement.lang = currentLanguage
    }
  }, [currentLanguage])

  // Fonction pour changer de langue
  const changeLanguage = async (languageCode) => {
    if (languageCode === currentLanguage) return
    
    setIsLoading(true)
    try {
      // Vérifier que la langue est supportée
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode)
      if (!language) {
        throw new Error(`Language ${languageCode} is not supported`)
      }
      
      setCurrentLanguage(languageCode)
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtenir les données de la langue actuelle
  const getCurrentLanguageData = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[2] // Fallback to French
  }

  // Obtenir une traduction
  const t = (key) => {
    const translations = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.fr
    return translations[key] || key
  }

  // Obtenir toutes les langues supportées
  const getSupportedLanguages = () => {
    return SUPPORTED_LANGUAGES
  }

  // Valeur du contexte
  const value = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguageData,
    getSupportedLanguages,
    t,
    isLoading,
    isRTL: getCurrentLanguageData().dir === 'rtl'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext

