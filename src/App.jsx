import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Search, BookOpen, Scroll, Globe } from 'lucide-react'
import QuranPage from './components/QuranPage.jsx'
import HadithPage from './components/HadithPage.jsx'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx'
import './App.css'

// Composant pour le sélecteur de langue
function LanguageSelector() {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useLanguage()
  const languages = getSupportedLanguages()

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage} disabled={isLoading}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>{languages.find(l => l.code === currentLanguage)?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Composant de navigation
function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
              إ
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Islam Web</h1>
              <p className="text-sm text-gray-600">Coran et Sahih al-Bukhari</p>
            </div>
          </Link>

          {/* Navigation principale */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/') ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:text-orange-600'
            }`}>
              Accueil
            </Link>
            <Link to="/quran" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/quran') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:text-teal-600'
            }`}>
              Coran
            </Link>
            <Link to="/hadith" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/hadith') ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
            }`}>
              Sahih al-Bukhari
            </Link>
          </div>

          {/* Sélecteur de langue */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
          </div>

          {/* Navigation mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
          </div>
        </div>

        {/* Navigation mobile étendue */}
        <div className="md:hidden pb-3 space-x-1">
          <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
            isActive('/') ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
          }`}>
            Accueil
          </Link>
          <Link to="/quran" className={`block px-3 py-2 rounded-md text-base font-medium ${
            isActive('/quran') ? 'bg-teal-100 text-teal-700' : 'text-gray-700'
          }`}>
            Coran
          </Link>
          <Link to="/hadith" className={`block px-3 py-2 rounded-md text-base font-medium ${
            isActive('/hadith') ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
          }`}>
            Sahih al-Bukhari
          </Link>
        </div>
      </div>
    </nav>
  )
}

// Page d'accueil
function HomePage() {
  const { getCurrentLanguageInfo, isRTL } = useLanguage()
  const currentLang = getCurrentLanguageInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête principal */}
        <div className="text-center mb-16">
          <div className={`text-6xl font-bold text-emerald-800 mb-6 ${isRTL() ? 'font-arabic' : ''}`} 
               dir={isRTL() ? 'rtl' : 'ltr'}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h2 className="text-2xl text-gray-700 mb-8">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez le Saint Coran et les enseignements du Prophète Muhammad (ﷺ) à 
            travers Sahih al-Bukhari, disponibles dans les langues les plus parlées du monde.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Rechercher dans le Coran ou les hadiths..."
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Cartes principales */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Carte Coran */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-teal-800 text-center mb-4">القرآن الكريم</h3>
              <p className="text-lg text-gray-600 text-center mb-2">Le Saint Coran</p>
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Lisez le Coran complet avec ses 114 sourates, 
                disponible en arabe et traduit dans de nombreuses langues.
              </p>
              <div className="border-t border-gray-100 pt-6">
                <Link to="/quran">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg rounded-xl">
                    Commencer la lecture
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Sahih al-Bukhari */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 mx-auto">
                <Scroll className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 text-center mb-4">صحيح البخاري</h3>
              <p className="text-lg text-gray-600 text-center mb-2">Sahih al-Bukhari</p>
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Explorez la collection complète des hadiths 
                authentiques compilés par l'Imam al-Bukhari.
              </p>
              <div className="border-t border-gray-100 pt-6">
                <Link to="/hadith">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl">
                    Explorer les hadiths
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal de l'App avec le contexte
function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/hadith" element={<HadithPage />} />
        </Routes>
      </div>
    </Router>
  )
}

// App principale avec le provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App

