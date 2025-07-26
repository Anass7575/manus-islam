import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Search, BookOpen, Play, Pause, Volume2, Loader2, ArrowLeft } from 'lucide-react'
import { getAllSurahs, getSurahBilingual, searchQuran } from '../services/quranService.js'
import { useLanguage } from '../contexts/LanguageContext.jsx'

// Composant pour afficher une sourate
function SurahCard({ surah, onSelect, isSelected, t, isRTL }) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
      }`}
      onClick={() => onSelect(surah)}
    >
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
              {surah.number}
            </div>
            <div>
              <CardTitle className="text-lg text-emerald-800">{surah.name}</CardTitle>
              <CardDescription className="text-sm">{surah.englishName}</CardDescription>
            </div>
          </div>
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <p className="text-sm font-medium text-gray-700">{surah.englishNameTranslation}</p>
            <p className="text-xs text-gray-500">{surah.numberOfAyahs} {t('verses')} • {surah.revelationType}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// Composant pour afficher les versets
function AyahDisplay({ ayah, t, isRTL }) {
  return (
    <div className="border-b border-gray-100 py-6 last:border-b-0">
      <div className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
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
              <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {ayah.translation}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className={`flex items-center space-x-3 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
              <Volume2 className="w-4 h-4 mr-1" />
              {t('currentLanguage') === 'ar' ? 'استمع' :
               t('currentLanguage') === 'en' ? 'Listen' :
               t('currentLanguage') === 'fr' ? 'Écouter' :
               t('currentLanguage') === 'es' ? 'Escuchar' :
               t('currentLanguage') === 'hi' ? 'सुनें' :
               t('currentLanguage') === 'zh' ? '听' :
               t('currentLanguage') === 'ru' ? 'Слушать' :
               t('currentLanguage') === 'bn' ? 'শুনুন' :
               t('currentLanguage') === 'pt' ? 'Ouvir' :
               t('currentLanguage') === 'ur' ? 'سنیں' :
               'Écouter'}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
              {t('currentLanguage') === 'ar' ? 'شارك' :
               t('currentLanguage') === 'en' ? 'Share' :
               t('currentLanguage') === 'fr' ? 'Partager' :
               t('currentLanguage') === 'es' ? 'Compartir' :
               t('currentLanguage') === 'hi' ? 'साझा करें' :
               t('currentLanguage') === 'zh' ? '分享' :
               t('currentLanguage') === 'ru' ? 'Поделиться' :
               t('currentLanguage') === 'bn' ? 'শেয়ার' :
               t('currentLanguage') === 'pt' ? 'Compartilhar' :
               t('currentLanguage') === 'ur' ? 'شیئر' :
               'Partager'}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
              {t('currentLanguage') === 'ar' ? 'علّم' :
               t('currentLanguage') === 'en' ? 'Bookmark' :
               t('currentLanguage') === 'fr' ? 'Marquer' :
               t('currentLanguage') === 'es' ? 'Marcar' :
               t('currentLanguage') === 'hi' ? 'बुकमार्क' :
               t('currentLanguage') === 'zh' ? '书签' :
               t('currentLanguage') === 'ru' ? 'Закладка' :
               t('currentLanguage') === 'bn' ? 'বুকমার্ক' :
               t('currentLanguage') === 'pt' ? 'Marcar' :
               t('currentLanguage') === 'ur' ? 'نشان' :
               'Marquer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal de la page Coran
function QuranPage() {
  const { currentLanguage, t, isRTL } = useLanguage()
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [ayahs, setAyahs] = useState([])
  const [loading, setLoading] = useState(false)
  const [surahsLoading, setSurahsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Charger toutes les sourates au démarrage
  useEffect(() => {
    loadSurahs()
  }, [])

  // Recharger la sourate sélectionnée quand la langue change
  useEffect(() => {
    if (selectedSurah) {
      loadSurahContent(selectedSurah.number)
    }
  }, [currentLanguage, selectedSurah?.number])

  const loadSurahs = async () => {
    try {
      setSurahsLoading(true)
      setError(null)
      const surahsData = await getAllSurahs()
      setSurahs(surahsData)
    } catch (err) {
      setError(t('error'))
      console.error('Erreur lors du chargement des sourates:', err)
    } finally {
      setSurahsLoading(false)
    }
  }

  const loadSurahContent = async (surahNumber) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSurahBilingual(surahNumber, currentLanguage)
      setAyahs(data.surah.ayahs)
    } catch (err) {
      setError(t('error'))
      console.error('Erreur lors du chargement de la sourate:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah)
    setSearchResults([])
    loadSurahContent(surah.number)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setError(null)
      const results = await searchQuran(searchQuery, currentLanguage)
      setSearchResults(results.matches || [])
      setSelectedSurah(null)
      setAyahs([])
    } catch (err) {
      setError(t('error'))
      console.error('Erreur lors de la recherche:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleBackToSurahs = () => {
    setSelectedSurah(null)
    setAyahs([])
    setSearchResults([])
    setSearchQuery('')
  }

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            {t('quran')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('currentLanguage') === 'ar' ? 'اقرأ القرآن الكريم مع الترجمة في لغتك المفضلة' :
             t('currentLanguage') === 'en' ? 'Read the Holy Quran with translation in your preferred language' :
             t('currentLanguage') === 'fr' ? 'Lisez le Saint Coran avec traduction dans votre langue préférée' :
             t('currentLanguage') === 'es' ? 'Lee el Sagrado Corán con traducción en tu idioma preferido' :
             t('currentLanguage') === 'hi' ? 'अपनी पसंदीदा भाषा में अनुवाद के साथ पवित्र कुरान पढ़ें' :
             t('currentLanguage') === 'zh' ? '用您喜欢的语言阅读神圣的古兰经及其翻译' :
             t('currentLanguage') === 'ru' ? 'Читайте Священный Коран с переводом на вашем предпочитаемом языке' :
             t('currentLanguage') === 'bn' ? 'আপনার পছন্দের ভাষায় অনুবাদ সহ পবিত্র কুরআন পড়ুন' :
             t('currentLanguage') === 'pt' ? 'Leia o Sagrado Alcorão com tradução em seu idioma preferido' :
             t('currentLanguage') === 'ur' ? 'اپنی پسندیدہ زبان میں ترجمے کے ساتھ مقدس قرآن پڑھیں' :
             'Lisez le Saint Coran avec traduction dans votre langue préférée'}
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl`}
            />
            <Button
              onClick={handleSearch}
              className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700`}
              disabled={isSearching}
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 text-lg">{error}</p>
            <Button onClick={loadSurahs} className="mt-4">
              {t('currentLanguage') === 'ar' ? 'إعادة المحاولة' :
               t('currentLanguage') === 'en' ? 'Retry' :
               t('currentLanguage') === 'fr' ? 'Réessayer' :
               t('currentLanguage') === 'es' ? 'Reintentar' :
               t('currentLanguage') === 'hi' ? 'पुनः प्रयास करें' :
               t('currentLanguage') === 'zh' ? '重试' :
               t('currentLanguage') === 'ru' ? 'Повторить' :
               t('currentLanguage') === 'bn' ? 'পুনরায় চেষ্টা করুন' :
               t('currentLanguage') === 'pt' ? 'Tentar novamente' :
               t('currentLanguage') === 'ur' ? 'دوبارہ کوشش کریں' :
               'Réessayer'}
            </Button>
          </div>
        )}

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('currentLanguage') === 'ar' ? 'نتائج البحث' :
                 t('currentLanguage') === 'en' ? 'Search Results' :
                 t('currentLanguage') === 'fr' ? 'Résultats de recherche' :
                 t('currentLanguage') === 'es' ? 'Resultados de búsqueda' :
                 t('currentLanguage') === 'hi' ? 'खोज परिणाम' :
                 t('currentLanguage') === 'zh' ? '搜索结果' :
                 t('currentLanguage') === 'ru' ? 'Результаты поиска' :
                 t('currentLanguage') === 'bn' ? 'অনুসন্ধানের ফলাফল' :
                 t('currentLanguage') === 'pt' ? 'Resultados da pesquisa' :
                 t('currentLanguage') === 'ur' ? 'تلاش کے نتائج' :
                 'Résultats de recherche'}
              </h2>
              <Button variant="outline" onClick={handleBackToSurahs}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('currentLanguage') === 'ar' ? 'العودة' :
                 t('currentLanguage') === 'en' ? 'Back' :
                 t('currentLanguage') === 'fr' ? 'Retour' :
                 t('currentLanguage') === 'es' ? 'Volver' :
                 t('currentLanguage') === 'hi' ? 'वापस' :
                 t('currentLanguage') === 'zh' ? '返回' :
                 t('currentLanguage') === 'ru' ? 'Назад' :
                 t('currentLanguage') === 'bn' ? 'ফিরে যান' :
                 t('currentLanguage') === 'pt' ? 'Voltar' :
                 t('currentLanguage') === 'ur' ? 'واپس' :
                 'Retour'}
              </Button>
            </div>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{result.surah.name}</span>
                      <span>•</span>
                      <span>{t('currentLanguage') === 'ar' ? 'آية' : t('currentLanguage') === 'en' ? 'Verse' : t('currentLanguage') === 'fr' ? 'Verset' : 'Verset'} {result.numberInSurah}</span>
                    </div>
                    <p className={`text-lg ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {result.text}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Affichage d'une sourate sélectionnée */}
        {selectedSurah && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-emerald-800">{selectedSurah.name}</h2>
                <p className="text-lg text-gray-600">{selectedSurah.englishName} - {selectedSurah.englishNameTranslation}</p>
                <p className="text-sm text-gray-500">{selectedSurah.numberOfAyahs} {t('verses')} • {selectedSurah.revelationType}</p>
              </div>
              <Button variant="outline" onClick={handleBackToSurahs}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('currentLanguage') === 'ar' ? 'العودة' :
                 t('currentLanguage') === 'en' ? 'Back' :
                 t('currentLanguage') === 'fr' ? 'Retour' :
                 t('currentLanguage') === 'es' ? 'Volver' :
                 t('currentLanguage') === 'hi' ? 'वापस' :
                 t('currentLanguage') === 'zh' ? '返回' :
                 t('currentLanguage') === 'ru' ? 'Назад' :
                 t('currentLanguage') === 'bn' ? 'ফিরে যান' :
                 t('currentLanguage') === 'pt' ? 'Voltar' :
                 t('currentLanguage') === 'ur' ? 'واپس' :
                 'Retour'}
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
                <p className="text-gray-600">{t('loading')}</p>
              </div>
            ) : (
              <Card className="p-6">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {ayahs.map((ayah) => (
                      <AyahDisplay
                        key={ayah.number}
                        ayah={ayah}
                        t={t}
                        isRTL={isRTL}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>
        )}

        {/* Liste des sourates */}
        {!selectedSurah && searchResults.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('currentLanguage') === 'ar' ? 'السور' :
               t('currentLanguage') === 'en' ? 'Surahs' :
               t('currentLanguage') === 'fr' ? 'Sourates' :
               t('currentLanguage') === 'es' ? 'Suras' :
               t('currentLanguage') === 'hi' ? 'सूरे' :
               t('currentLanguage') === 'zh' ? '章节' :
               t('currentLanguage') === 'ru' ? 'Суры' :
               t('currentLanguage') === 'bn' ? 'সূরা' :
               t('currentLanguage') === 'pt' ? 'Suras' :
               t('currentLanguage') === 'ur' ? 'سورے' :
               'Sourates'}
            </h2>

            {surahsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
                <p className="text-gray-600">{t('loading')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.number}
                    surah={surah}
                    onSelect={handleSurahSelect}
                    isSelected={false}
                    t={t}
                    isRTL={isRTL}
                  />
                ))}
              </div>
            )}

            {filteredSurahs.length === 0 && !surahsLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600">{t('noResults')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuranPage

