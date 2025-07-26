import React, { createContext, useContext, useState, useEffect } from 'react'

// Langues supportées avec leurs codes API
const SUPPORTED_LANGUAGES = {
  'ar': { name: 'العربية', code: 'ar', quranEdition: 'quran-uthmani', flag: '🇸🇦' },
  'en': { name: 'English', code: 'en', quranEdition: 'en.sahih', flag: '🇺🇸' },
  'fr': { name: 'Français', code: 'fr', quranEdition: 'fr.hamidullah', flag: '🇫🇷' },
  'es': { name: 'Español', code: 'es', quranEdition: 'es.cortes', flag: '🇪🇸' },
  'hi': { name: 'हिन्दी', code: 'hi', quranEdition: 'hi.hindi', flag: '🇮🇳' },
  'zh': { name: '中文', code: 'zh', quranEdition: 'zh.chinese', flag: '🇨🇳' },
  'ru': { name: 'Русский', code: 'ru', quranEdition: 'ru.kuliev', flag: '🇷🇺' },
  'bn': { name: 'বাংলা', code: 'bn', quranEdition: 'bn.bengali', flag: '🇧🇩' },
  'pt': { name: 'Português', code: 'pt', quranEdition: 'pt.elhayek', flag: '🇵🇹' },
  'ur': { name: 'اردو', code: 'ur', quranEdition: 'ur.jalandhry', flag: '🇵🇰' }
}

// Créer le contexte
const LanguageContext = createContext()

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Provider du contexte
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr') // Français par défaut
  const [isLoading, setIsLoading] = useState(false)

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('islam-web-language')
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Changer la langue
  const changeLanguage = async (languageCode) => {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.error('Langue non supportée:', languageCode)
      return
    }

    setIsLoading(true)
    try {
      setCurrentLanguage(languageCode)
      localStorage.setItem('islam-web-language', languageCode)
      
      // Optionnel: Recharger les données avec la nouvelle langue
      // Ceci sera géré par les composants individuels qui écoutent le changement
      
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtenir les informations de la langue courante
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES['fr']
  }

  // Obtenir toutes les langues supportées
  const getSupportedLanguages = () => {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info
    }))
  }

  // Obtenir l'édition du Coran pour la langue courante
  const getQuranEdition = () => {
    return getCurrentLanguageInfo().quranEdition
  }

  // Vérifier si une langue est RTL (Right-to-Left)
  const isRTL = (langCode = currentLanguage) => {
    return ['ar', 'ur'].includes(langCode)
  }

  const value = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getSupportedLanguages,
    getQuranEdition,
    isRTL,
    isLoading,
    SUPPORTED_LANGUAGES
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext

