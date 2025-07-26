import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { BookOpen, Search, Globe, Moon, Sun, Menu } from 'lucide-react'
import QuranPage from './components/QuranPage.jsx'
import HadithPage from './components/HadithPage.jsx'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx'
import './App.css'

// Composant Header
function Header() {
  const [isDark, setIsDark] = useState(false)
  const { currentLanguage, changeLanguage, getSupportedLanguages, t, isRTL } = useLanguage()

  const languages = getSupportedLanguages()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo et titre */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">Islam Web</h1>
            <p className="text-xs text-muted-foreground">{t('quran')} & {t('hadith')}</p>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              {t('home')}
            </Button>
          </Link>
          <Link to="/quran">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              {t('quran')}
            </Button>
          </Link>
          <Link to="/hadith">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              {t('hadith')}
            </Button>
          </Link>
        </nav>

        {/* Actions à droite */}
        <div className="flex items-center space-x-3">
          {/* Sélecteur de langue */}
          <Select value={currentLanguage} onValueChange={changeLanguage}>
            <SelectTrigger className="w-40">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggle mode sombre */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-emerald-700 hover:text-emerald-800"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Menu mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

// Composant Page d'accueil
function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { t, isRTL } = useLanguage()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Section héro */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-6">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
          <p className="text-xl md:text-2xl text-emerald-700 mb-8">
            {t('currentLanguage') === 'ar' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 
             t('currentLanguage') === 'en' ? 'In the name of Allah, the Most Gracious, the Most Merciful' :
             t('currentLanguage') === 'fr' ? 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux' :
             t('currentLanguage') === 'es' ? 'En el nombre de Alá, el Compasivo, el Misericordioso' :
             t('currentLanguage') === 'hi' ? 'अल्लाह के नाम से जो अत्यंत कृपाशील, अत्यंत दयावान है' :
             t('currentLanguage') === 'zh' ? '奉至仁至慈的真主之名' :
             t('currentLanguage') === 'ru' ? 'Во имя Аллаха, Милостивого, Милосердного' :
             t('currentLanguage') === 'bn' ? 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে' :
             t('currentLanguage') === 'pt' ? 'Em nome de Allah, o Clemente, o Misericordioso' :
             t('currentLanguage') === 'ur' ? 'اللہ کے نام سے جو نہایت مہربان، رحم والا ہے' :
             'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux'}
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('currentLanguage') === 'ar' ? 'اكتشف القرآن الكريم وتعاليم النبي محمد (ص) من خلال صحيح البخاري، متوفر بأكثر اللغات تحدثاً في العالم' :
             t('currentLanguage') === 'en' ? 'Discover the Holy Quran and the teachings of Prophet Muhammad (ﷺ) through Sahih al-Bukhari, available in the most spoken languages of the world.' :
             t('currentLanguage') === 'fr' ? 'Découvrez le Saint Coran et les enseignements du Prophète Muhammad (ﷺ) à travers Sahih al-Bukhari, disponibles dans les langues les plus parlées du monde.' :
             t('currentLanguage') === 'es' ? 'Descubre el Sagrado Corán y las enseñanzas del Profeta Muhammad (ﷺ) a través de Sahih al-Bukhari, disponibles en los idiomas más hablados del mundo.' :
             t('currentLanguage') === 'hi' ? 'पवित्र कुरान और पैगंबर मुहम्मद (ﷺ) की शिक्षाओं को सहीह अल-बुखारी के माध्यम से खोजें, दुनिया की सबसे अधिक बोली जाने वाली भाषाओं में उपलब्ध।' :
             t('currentLanguage') === 'zh' ? '通过《布哈里圣训集》探索神圣的古兰经和先知穆罕默德（愿主福安之）的教导，提供世界上使用最广泛的语言版本。' :
             t('currentLanguage') === 'ru' ? 'Откройте для себя Священный Коран и учения Пророка Мухаммада (ﷺ) через Сахих аль-Бухари, доступные на самых распространенных языках мира.' :
             t('currentLanguage') === 'bn' ? 'পবিত্র কুরআন এবং নবী মুহাম্মদ (সা.) এর শিক্ষা সহীহ আল-বুখারীর মাধ্যমে আবিষ্কার করুন, বিশ্বের সর্বাধিক কথ্য ভাষায় উপলব্ধ।' :
             t('currentLanguage') === 'pt' ? 'Descubra o Sagrado Alcorão e os ensinamentos do Profeta Muhammad (ﷺ) através do Sahih al-Bukhari, disponíveis nas línguas mais faladas do mundo.' :
             t('currentLanguage') === 'ur' ? 'مقدس قرآن اور نبی محمد (ص) کی تعلیمات کو صحیح البخاری کے ذریعے دریافت کریں، دنیا کی سب سے زیادہ بولی جانے والی زبانوں میں دستیاب۔' :
             'Découvrez le Saint Coran et les enseignements du Prophète Muhammad (ﷺ) à travers Sahih al-Bukhari, disponibles dans les langues les plus parlées du monde.'}
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section des cartes principales */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Carte Coran */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-emerald-800">القرآن الكريم</CardTitle>
                <CardDescription className="text-lg">{t('quran')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  {t('currentLanguage') === 'ar' ? 'اقرأ القرآن الكامل مع 114 سورة، متوفر باللغة العربية ومترجم إلى لغات عديدة' :
                   t('currentLanguage') === 'en' ? 'Read the complete Quran with its 114 surahs, available in Arabic and translated into many languages.' :
                   t('currentLanguage') === 'fr' ? 'Lisez le Coran complet avec ses 114 sourates, disponible en arabe et traduit dans de nombreuses langues.' :
                   t('currentLanguage') === 'es' ? 'Lee el Corán completo con sus 114 suras, disponible en árabe y traducido a muchos idiomas.' :
                   t('currentLanguage') === 'hi' ? 'अपने 114 सूरों के साथ पूर्ण कुरान पढ़ें, अरबी में उपलब्ध और कई भाषाओं में अनुवादित।' :
                   t('currentLanguage') === 'zh' ? '阅读包含114章的完整古兰经，提供阿拉伯语原文和多种语言翻译。' :
                   t('currentLanguage') === 'ru' ? 'Читайте полный Коран с его 114 сурами, доступный на арабском языке и переведенный на многие языки.' :
                   t('currentLanguage') === 'bn' ? '114টি সূরা সহ সম্পূর্ণ কুরআন পড়ুন, আরবিতে উপলব্ধ এবং অনেক ভাষায় অনুবাদিত।' :
                   t('currentLanguage') === 'pt' ? 'Leia o Alcorão completo com suas 114 suras, disponível em árabe e traduzido para muitas línguas.' :
                   t('currentLanguage') === 'ur' ? '114 سورتوں کے ساتھ مکمل قرآن پڑھیں، عربی میں دستیاب اور کئی زبانوں میں ترجمہ شدہ۔' :
                   'Lisez le Coran complet avec ses 114 sourates, disponible en arabe et traduit dans de nombreuses langues.'}
                </p>
                <Button 
                  onClick={() => navigate('/quran')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl"
                >
                  {t('startReading')}
                </Button>
              </CardContent>
            </Card>

            {/* Carte Sahih al-Bukhari */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-800">صحيح البخاري</CardTitle>
                <CardDescription className="text-lg">{t('hadith')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  {t('currentLanguage') === 'ar' ? 'استكشف المجموعة الكاملة من الأحاديث الصحيحة التي جمعها الإمام البخاري' :
                   t('currentLanguage') === 'en' ? 'Explore the complete collection of authentic hadiths compiled by Imam al-Bukhari.' :
                   t('currentLanguage') === 'fr' ? 'Explorez la collection complète des hadiths authentiques compilés par l\'Imam al-Bukhari.' :
                   t('currentLanguage') === 'es' ? 'Explora la colección completa de hadices auténticos compilados por el Imam al-Bukhari.' :
                   t('currentLanguage') === 'hi' ? 'इमाम अल-बुखारी द्वारा संकलित प्रामाणिक हदीसों के पूर्ण संग्रह का अन्वेषण करें।' :
                   t('currentLanguage') === 'zh' ? '探索伊玛目布哈里编纂的完整真实圣训集。' :
                   t('currentLanguage') === 'ru' ? 'Изучите полную коллекцию достоверных хадисов, собранных имамом аль-Бухари.' :
                   t('currentLanguage') === 'bn' ? 'ইমাম আল-বুখারী কর্তৃক সংকলিত সত্যিকারের হাদিসের সম্পূর্ণ সংগ্রহ অন্বেষণ করুন।' :
                   t('currentLanguage') === 'pt' ? 'Explore a coleção completa de hadiths autênticos compilados pelo Imam al-Bukhari.' :
                   t('currentLanguage') === 'ur' ? 'امام البخاری کی جانب سے مرتب کردہ صحیح احادیث کے مکمل مجموعے کو دیکھیں۔' :
                   'Explorez la collection complète des hadiths authentiques compilés par l\'Imam al-Bukhari.'}
                </p>
                <Button 
                  onClick={() => navigate('/hadith')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                >
                  {t('exploreHadiths')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section des fonctionnalités */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t('features')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('multilingual')}</h3>
              <p className="text-gray-600">
                {t('multilingualDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('advancedSearch')}</h3>
              <p className="text-gray-600">
                {t('advancedSearchDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('intuitiveNavigation')}</h3>
              <p className="text-gray-600">
                {t('intuitiveNavigationDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Composant principal App
function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quran" element={<QuranPage />} />
              <Route path="/hadith" element={<HadithPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

