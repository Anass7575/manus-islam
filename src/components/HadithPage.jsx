import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, BookOpen, User, Hash, Loader2 } from 'lucide-react'
import { getAllChapters, getChapterHadiths, searchHadiths } from '../services/hadithService.js'

// Composant pour afficher un chapitre
function ChapterCard({ chapter, onSelect, isSelected }) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(chapter)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {chapter.id}
            </div>
            <div>
              <CardTitle className="text-lg text-blue-800">{chapter.title}</CardTitle>
              <CardDescription className="text-sm" dir="rtl">{chapter.arabicTitle}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {chapter.hadithCount} hadiths
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

// Composant pour afficher un hadith
function HadithDisplay({ hadith, language }) {
  return (
    <div className="border-b border-gray-100 py-6 last:border-b-0">
      <div className="space-y-4">
        {/* En-tête du hadith */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
              <Hash className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Hadith {hadith.id}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{hadith.english?.narrator || 'Narrateur inconnu'}</span>
          </div>
        </div>

        {/* Texte arabe */}
        <div className="bg-amber-50 p-4 rounded-lg border-r-4 border-amber-400">
          <p className="text-xl leading-loose font-arabic text-gray-800" dir="rtl">
            {hadith.arabic}
          </p>
        </div>

        {/* Traduction */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-600">Narrateur: </span>
            <span className="text-sm text-gray-700">{hadith.english?.narrator || 'Narrateur inconnu'}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {hadith.english?.text || 'Traduction non disponible'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 text-sm">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Partager
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
            Marquer
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
            Référence
          </Button>
        </div>
      </div>
    </div>
  )
}

// Composant principal de la page Hadith
function HadithPage() {
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [error, setError] = useState(null)

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ]

  // Charger tous les chapitres au montage du composant
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setChaptersLoading(true)
        const chaptersData = await getAllChapters()
        setChapters(chaptersData)
        setError(null)
      } catch (err) {
        console.error('Erreur lors du chargement des chapitres:', err)
        setError('Erreur lors du chargement des chapitres')
      } finally {
        setChaptersLoading(false)
      }
    }

    loadChapters()
  }, [])

  // Charger les hadiths d'un chapitre
  const loadChapterHadiths = async (chapter) => {
    try {
      setLoading(true)
      setError(null)
      
      const hadithsData = await getChapterHadiths(chapter.id)
      setHadiths(hadithsData)
    } catch (err) {
      console.error('Erreur lors du chargement des hadiths:', err)
      setError('Erreur lors du chargement des hadiths')
    } finally {
      setLoading(false)
    }
  }

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter)
    loadChapterHadiths(chapter)
  }

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.arabicTitle.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">صحيح البخاري</h1>
          <p className="text-xl text-blue-700 mb-2">Sahih al-Bukhari</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La collection la plus authentique des hadiths du Prophète Muhammad (ﷺ), 
            compilée par l'Imam Muhammad al-Bukhari.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Liste des chapitres */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Chapitres</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez un chapitre pour explorer les hadiths
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Barre de recherche */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher un chapitre..."
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

                {/* Liste des chapitres */}
                <ScrollArea className="h-96">
                  {chaptersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Chargement...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-600">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredChapters.map((chapter) => (
                        <ChapterCard
                          key={chapter.id}
                          chapter={chapter}
                          onSelect={handleChapterSelect}
                          isSelected={selectedChapter?.id === chapter.id}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal - Affichage des hadiths */}
          <div className="lg:col-span-2">
            {selectedChapter ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-blue-800">
                        {selectedChapter.title}
                      </CardTitle>
                      <CardDescription className="text-lg" dir="rtl">
                        {selectedChapter.arabicTitle}
                      </CardDescription>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedChapter.hadithCount} hadiths dans ce chapitre
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                      <p className="mt-4 text-gray-600">Chargement des hadiths...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 text-red-600">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {hadiths.map((hadith) => (
                        <HadithDisplay
                          key={hadith.id}
                          hadith={hadith}
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
                    Sélectionnez un chapitre
                  </h3>
                  <p className="text-gray-500">
                    Choisissez un chapitre dans la liste pour explorer les hadiths de Sahih al-Bukhari
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

export default HadithPage

