import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { BookOpen, Search, Globe, Moon, Sun, Menu } from 'lucide-react'
import QuranPage from './components/QuranPage.jsx'
import HadithPage from './components/HadithPage.jsx'
import './App.css'

// Composant Header
function Header() {
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState('fr')

  const languages = [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
    { code: 'es', name: 'Español', dir: 'ltr' },
    { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
    { code: 'zh', name: '中文', dir: 'ltr' },
    { code: 'ru', name: 'Русский', dir: 'ltr' },
    { code: 'bn', name: 'বাংলা', dir: 'ltr' },
    { code: 'pt', name: 'Português', dir: 'ltr' },
    { code: 'ur', name: 'اردو', dir: 'rtl' }
  ]

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
            <p className="text-xs text-muted-foreground">Coran et Sahih al-Bukhari</p>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              Accueil
            </Button>
          </Link>
          <Link to="/quran">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              Coran
            </Button>
          </Link>
          <Link to="/hadith">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              Sahih al-Bukhari
            </Button>
          </Link>
        </nav>

        {/* Actions à droite */}
        <div className="flex items-center space-x-3">
          {/* Sélecteur de langue */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Section héro */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-6">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
          <p className="text-xl md:text-2xl text-emerald-700 mb-8">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Découvrez le Saint Coran et les enseignements du Prophète Muhammad (ﷺ) 
            à travers Sahih al-Bukhari, disponibles dans les langues les plus parlées du monde.
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher dans le Coran ou les hadiths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
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
                <CardDescription className="text-lg">Le Saint Coran</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Lisez le Coran complet avec ses 114 sourates, disponible en arabe 
                  et traduit dans de nombreuses langues.
                </p>
                <Button 
                  onClick={() => navigate('/quran')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl"
                >
                  Commencer la lecture
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
                <CardDescription className="text-lg">Sahih al-Bukhari</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Explorez la collection complète des hadiths authentiques 
                  compilés par l'Imam al-Bukhari.
                </p>
                <Button 
                  onClick={() => navigate('/hadith')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                >
                  Explorer les hadiths
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
            Fonctionnalités
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multilingue</h3>
              <p className="text-gray-600">
                Disponible dans les 10 langues les plus parlées au monde
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recherche avancée</h3>
              <p className="text-gray-600">
                Recherchez facilement dans le Coran et les hadiths
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Navigation intuitive</h3>
              <p className="text-gray-600">
                Interface moderne et facile à utiliser
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
  )
}

export default App

