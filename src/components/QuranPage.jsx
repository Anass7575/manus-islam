import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Search, BookOpen, Play, Pause, Volume2, Loader2 } from 'lucide-react'
import { getAllSurahs, getSurahWithTranslation } from '../services/quranService.js'
import { useLanguage } from '../contexts/LanguageContext.jsx'

// Composant pour afficher une sourate
function SurahCard({ surah, onSelect, isSelected }) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-teal-500 bg-teal-50' : ''
      }`}
      onClick={() => onSelect(surah)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
              {surah.number}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900" dir="rtl">
                {surah.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {surah.englishName}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{surah.englishNameTranslation}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {surah.numberOfAyahs} versets
              </Badge>
              <Badge variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'} className="text-xs">
                {surah.revelationType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// Composant pour afficher les versets d'une sourate
function SurahDisplay({ surah, language }) {
  const { isRTL } = useLanguage()
  
  if (!surah) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Sélectionnez une sourate</h3>
          <p className="text-gray-500">Choisissez une sourate dans la liste pour commencer la lecture du Coran</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la sourate */}
      <div className="text-center py-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg">
        <h2 className="text-3xl font-bold text-teal-800 mb-2" dir="rtl">
          {surah.name} - {surah.englishName}
        </h2>
        <p className="text-lg text-gray-600 mb-4">{surah.englishNameTranslation}</p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">{surah.numberOfAyahs} versets</Badge>
          <Badge variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'}>
            {surah.revelationType}
          </Badge>
          <Button size="sm" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Écouter
          </Button>
        </div>
      </div>

      {/* Versets */}
      <div className="space-y-6">
        {surah.ayahs?.map((ayah) => (
          <div key={ayah.number} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {ayah.numberInSurah}
              </div>
              <div className="flex-1 space-y-4">
                {/* Texte arabe */}
                <div className="text-right" dir="rtl">
                  <p className="text-2xl leading-loose text-gray-900 font-arabic">
                    {ayah.arabicText}
                  </p>
                </div>
                
                {/* Traduction */}
                <div className={`${isRTL(language) ? 'text-right' : 'text-left'}`} 
                     dir={isRTL(language) ? 'rtl' : 'ltr'}>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {ayah.translationText}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-2">
                  <Button size="sm" variant="ghost">
                    <Play className="w-4 h-4 mr-1" />
                    Écouter
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Volume2 className="w-4 h-4 mr-1" />
                    Partager
                  </Button>
                  <Button size="sm" variant="ghost">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Marquer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Composant principal de la page Coran
function QuranPage() {
  const { currentLanguage, getQuranEdition, getCurrentLanguageInfo } = useLanguage()
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingSurah, setLoadingSurah] = useState(false)
  const [error, setError] = useState(null)

  // Charger toutes les sourates
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true)
        setError(null)
        const edition = getQuranEdition()
        console.log('🔄 Chargement des sourates avec édition:', edition)
        
        const surahsData = await getAllSurahs(edition)
        setSurahs(surahsData)
      } catch (err) {
        console.error('Erreur lors du chargement des sourates:', err)
        setError('Impossible de charger les sourates. Veuillez réessayer.')
      } finally {
        setLoading(false)
      }
    }

    loadSurahs()
  }, [currentLanguage, getQuranEdition])

  // Charger une sourate spécifique
  const handleSurahSelect = async (surah) => {
    try {
      setLoadingSurah(true)
      setError(null)
      const edition = getQuranEdition()
      console.log('🔄 Chargement de la sourate', surah.number, 'avec édition:', edition)
      
      const surahData = await getSurahWithTranslation(surah.number, edition)
      setSelectedSurah(surahData)
    } catch (err) {
      console.error('Erreur lors du chargement de la sourate:', err)
      setError(`Impossible de charger la sourate ${surah.name}. Veuillez réessayer.`)
    } finally {
      setLoadingSurah(false)
    }
  }

  // Filtrer les sourates selon le terme de recherche
  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  )

  const currentLangInfo = getCurrentLanguageInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">القرآن الكريم</h1>
          <p className="text-xl text-gray-600 mb-2">Le Saint Coran</p>
          <p className="text-gray-500">
            La collection complète des 114 sourates du Coran en {currentLangInfo.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar avec liste des sourates */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Sourates du Coran</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez une sourate pour commencer la lecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Barre de recherche */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une sourate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sélecteur de langue */}
                <div className="mb-4">
                  <Badge variant="outline" className="w-full justify-center">
                    {currentLangInfo.flag} {currentLangInfo.name}
                  </Badge>
                </div>

                {/* Liste des sourates */}
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                      <span className="ml-2 text-gray-600">Chargement...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-2">{error}</p>
                      <Button size="sm" onClick={() => window.location.reload()}>
                        Réessayer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredSurahs.map((surah) => (
                        <SurahCard
                          key={surah.number}
                          surah={surah}
                          onSelect={handleSurahSelect}
                          isSelected={selectedSurah?.number === surah.number}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Card className="min-h-96">
              <CardContent className="p-6">
                {loadingSurah ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    <span className="ml-3 text-gray-600">Chargement de la sourate...</span>
                  </div>
                ) : (
                  <SurahDisplay surah={selectedSurah} language={currentLanguage} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuranPage

