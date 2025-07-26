import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Search, BookOpen, Play, Pause, Volume2, Loader2 } from 'lucide-react'
import { getAllSurahs, getSurahWithTranslation, getTranslationEdition } from '../services/quranService.js'

// Composant pour afficher une sourate
function SurahCard({ surah, onSelect, isSelected }) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
      }`}
      onClick={() => onSelect(surah)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
              {surah.number}
            </div>
            <div>
              <CardTitle className="text-lg text-emerald-800">{surah.name}</CardTitle>
              <CardDescription className="text-sm">{surah.englishName}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{surah.englishNameTranslation}</p>
            <p className="text-xs text-gray-500">{surah.numberOfAyahs} versets • {surah.revelationType}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// Composant pour afficher les versets
function AyahDisplay({ ayah, translation, language }) {
  return (
    <div className="border-b border-gray-100 py-6 last:border-b-0">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {ayah.numberInSurah}
        </div>
        <div className="flex-1 space-y-4">
          {/* Texte arabe */}
          <div className="text-right">
            <p className="text-2xl leading-loose font-arabic text-gray-800" dir="rtl">
              {ayah.text}
            </p>
          </div>
          
          {/* Traduction */}
          {ayah.translation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {ayah.translation}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-3 text-sm">
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
              <Volume2 className="w-4 h-4 mr-1" />
              Écouter
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
              Partager
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
              Marquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal de la page Coran
function QuranPage() {
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(false)
  const [surahsLoading, setSurahsLoading] = useState(true)
  const [error, setError] = useState(null)

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'ur', name: 'اردو' }
  ]

  // Charger toutes les sourates au montage du composant
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setSurahsLoading(true)
        const surahsData = await getAllSurahs()
        setSurahs(surahsData)
        setError(null)
      } catch (err) {
        console.error('Erreur lors du chargement des sourates:', err)
        setError('Erreur lors du chargement des sourates')
      } finally {
        setSurahsLoading(false)
      }
    }

    loadSurahs()
  }, [])

  // Charger les versets d'une sourate
  const loadSurahAyahs = async (surah) => {
    try {
      setLoading(true)
      setError(null)
      
      const translationEdition = getTranslationEdition(selectedLanguage)
      const surahData = await getSurahWithTranslation(surah.number, translationEdition)
      
      setAyahs(surahData.ayahs)
    } catch (err) {
      console.error('Erreur lors du chargement des versets:', err)
      setError('Erreur lors du chargement des versets')
    } finally {
      setLoading(false)
    }
  }

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah)
    loadSurahAyahs(surah)
  }

  // Recharger les versets quand la langue change
  useEffect(() => {
    if (selectedSurah) {
      loadSurahAyahs(selectedSurah)
    }
  }, [selectedLanguage])

  const filteredSurahs = surahs.filter(surah =>
    surah.name.includes(searchQuery) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Liste des sourates */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
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
                    type="text"
                    placeholder="Rechercher une sourate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sélecteur de langue */}
                <div className="mb-4">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des sourates */}
                <ScrollArea className="h-96">
                  {surahsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      <span className="ml-2 text-gray-600">Chargement...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-600">
                      {error}
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

          {/* Contenu principal - Affichage des versets */}
          <div className="lg:col-span-2">
            {selectedSurah ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-emerald-800">
                        {selectedSurah.name} - {selectedSurah.englishName}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} versets • {selectedSurah.revelationType}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Écouter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                      <p className="mt-4 text-gray-600">Chargement des versets...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 text-red-600">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {ayahs.map((ayah) => (
                        <AyahDisplay
                          key={ayah.number}
                          ayah={ayah}
                          translation={ayah.translation}
                          language={selectedLanguage}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Sélectionnez une sourate
                  </h3>
                  <p className="text-gray-500">
                    Choisissez une sourate dans la liste pour commencer la lecture du Coran
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuranPage

