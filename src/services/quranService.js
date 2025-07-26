// Service pour l'API du Coran avec support multilingue
const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
const CORS_PROXY = 'https://corsproxy.io/?'

// Cache pour éviter les appels répétés
const cache = new Map()

// Mapping des codes de langue vers les éditions de l'API
const LANGUAGE_EDITIONS = {
  ar: 'ar.alafasy',
  en: 'en.sahih',
  fr: 'fr.hamidullah',
  es: 'es.cortes',
  hi: 'hi.hindi',
  zh: 'zh.jian',
  ru: 'ru.kuliev',
  bn: 'bn.bengali',
  pt: 'pt.elhayek',
  ur: 'ur.jalandhry'
}

// Fonction utilitaire pour faire des requêtes avec gestion CORS
async function fetchWithCors(url) {
  try {
    // Essayer d'abord sans proxy
    const response = await fetch(url)
    if (response.ok) {
      return response
    }
    throw new Error('CORS error')
  } catch (error) {
    // Si erreur CORS, utiliser le proxy
    const proxiedUrl = CORS_PROXY + encodeURIComponent(url)
    return fetch(proxiedUrl)
  }
}

// Fonction utilitaire pour les appels API avec cache
async function fetchWithCache(url, cacheKey) {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  try {
    const response = await fetchWithCors(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    cache.set(cacheKey, data)
    return data
  } catch (error) {
    console.error('Erreur lors de l\'appel API:', error)
    throw error
  }
}

// Récupérer toutes les sourates avec métadonnées
export async function getAllSurahs() {
  const cacheKey = 'all_surahs'
  const data = await fetchWithCache(`${QURAN_API_BASE}/meta`, cacheKey)
  
  if (data.code === 200) {
    return data.data.surahs.references.map(surah => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType
    }))
  }
  
  throw new Error('Erreur lors de la récupération des sourates')
}

// Récupérer une sourate avec traduction dans la langue spécifiée
export async function getSurahWithTranslation(surahNumber, languageCode = 'fr') {
  const edition = LANGUAGE_EDITIONS[languageCode] || LANGUAGE_EDITIONS.fr
  const cacheKey = `surah_${surahNumber}_${edition}`
  
  try {
    const data = await fetchWithCache(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`, cacheKey)
    
    if (data.code === 200) {
      return {
        surah: data.data,
        language: languageCode,
        edition: edition
      }
    }
    
    throw new Error('Erreur lors de la récupération de la sourate')
  } catch (error) {
    console.error(`Erreur pour la sourate ${surahNumber} en ${languageCode}:`, error)
    
    // Fallback vers l'arabe si la traduction échoue
    if (languageCode !== 'ar') {
      return getSurahWithTranslation(surahNumber, 'ar')
    }
    
    throw error
  }
}

// Récupérer une sourate bilingue (arabe + traduction)
export async function getSurahBilingual(surahNumber, languageCode = 'fr') {
  try {
    const [arabicData, translationData] = await Promise.all([
      getSurahWithTranslation(surahNumber, 'ar'),
      languageCode !== 'ar' ? getSurahWithTranslation(surahNumber, languageCode) : null
    ])
    
    // Combiner les données arabes et la traduction
    const combinedAyahs = arabicData.surah.ayahs.map((arabicAyah, index) => {
      const translationAyah = translationData ? translationData.surah.ayahs[index] : null
      
      return {
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        text: arabicAyah.text,
        translation: translationAyah ? translationAyah.text : null,
        juz: arabicAyah.juz,
        manzil: arabicAyah.manzil,
        page: arabicAyah.page,
        ruku: arabicAyah.ruku,
        hizbQuarter: arabicAyah.hizbQuarter,
        sajda: arabicAyah.sajda
      }
    })
    
    return {
      surah: {
        ...arabicData.surah,
        ayahs: combinedAyahs
      },
      language: languageCode,
      hasTranslation: languageCode !== 'ar'
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération bilingue de la sourate ${surahNumber}:`, error)
    throw error
  }
}

// Rechercher dans le Coran
export async function searchQuran(query, languageCode = 'fr') {
  const edition = LANGUAGE_EDITIONS[languageCode] || LANGUAGE_EDITIONS.fr
  const cacheKey = `search_${query}_${edition}`
  
  try {
    const data = await fetchWithCache(`${QURAN_API_BASE}/search/${encodeURIComponent(query)}/${edition}`, cacheKey)
    
    if (data.code === 200) {
      return {
        query,
        count: data.data.count,
        matches: data.data.matches,
        language: languageCode
      }
    }
    
    return {
      query,
      count: 0,
      matches: [],
      language: languageCode
    }
  } catch (error) {
    console.error(`Erreur lors de la recherche "${query}" en ${languageCode}:`, error)
    throw error
  }
}

// Obtenir les éditions disponibles pour une langue
export function getAvailableEditions(languageCode) {
  return LANGUAGE_EDITIONS[languageCode] || LANGUAGE_EDITIONS.fr
}

// Obtenir les langues supportées
export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_EDITIONS)
}

// Vérifier si une langue est supportée
export function isLanguageSupported(languageCode) {
  return languageCode in LANGUAGE_EDITIONS
}

// Récupérer l'édition de traduction pour une langue
export function getTranslationEdition(languageCode) {
  return LANGUAGE_EDITIONS[languageCode] || LANGUAGE_EDITIONS.fr
}

