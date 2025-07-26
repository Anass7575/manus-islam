// Service pour l'API du Coran avec proxy CORS
const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
const CORS_PROXY = 'https://corsproxy.io/?'

// Cache pour éviter les appels répétés
const cache = new Map()

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

// Récupérer une sourate spécifique avec ses versets
export async function getSurah(surahNumber, edition = 'quran-uthmani') {
  const cacheKey = `surah_${surahNumber}_${edition}`
  const data = await fetchWithCache(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`, cacheKey)
  
  if (data.code === 200) {
    return {
      number: data.data.number,
      name: data.data.name,
      englishName: data.data.englishName,
      englishNameTranslation: data.data.englishNameTranslation,
      numberOfAyahs: data.data.numberOfAyahs,
      revelationType: data.data.revelationType,
      ayahs: data.data.ayahs.map(ayah => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        juz: ayah.juz,
        page: ayah.page,
        sajda: ayah.sajda
      }))
    }
  }
  
  throw new Error('Erreur lors de la récupération de la sourate')
}

// Récupérer une sourate avec traduction
export async function getSurahWithTranslation(surahNumber, translationEdition = 'fr.hamidullah') {
  try {
    // Récupérer le texte arabe
    const arabicSurah = await getSurah(surahNumber, 'quran-uthmani')
    
    // Récupérer la traduction
    const translationData = await fetchWithCache(
      `${QURAN_API_BASE}/surah/${surahNumber}/${translationEdition}`,
      `surah_${surahNumber}_${translationEdition}`
    )
    
    if (translationData.code === 200) {
      // Combiner le texte arabe et la traduction
      const combinedAyahs = arabicSurah.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: translationData.data.ayahs[index]?.text || ''
      }))
      
      return {
        ...arabicSurah,
        ayahs: combinedAyahs
      }
    }
    
    // Si la traduction échoue, retourner seulement le texte arabe
    return arabicSurah
  } catch (error) {
    console.error('Erreur lors de la récupération avec traduction:', error)
    // Fallback: retourner seulement le texte arabe
    return await getSurah(surahNumber)
  }
}

// Rechercher dans le Coran
export async function searchQuran(query, edition = 'quran-uthmani') {
  if (!query || query.trim().length < 2) {
    return []
  }
  
  const cacheKey = `search_${query}_${edition}`
  const data = await fetchWithCache(
    `${QURAN_API_BASE}/search/${encodeURIComponent(query)}/${edition}`,
    cacheKey
  )
  
  if (data.code === 200) {
    return data.data.matches.map(match => ({
      surah: match.surah,
      ayah: match.numberInSurah,
      text: match.text
    }))
  }
  
  return []
}

// Récupérer les éditions disponibles pour une langue
export async function getEditionsForLanguage(languageCode) {
  const cacheKey = `editions_${languageCode}`
  const data = await fetchWithCache(`${QURAN_API_BASE}/edition/language/${languageCode}`, cacheKey)
  
  if (data.code === 200) {
    return data.data.filter(edition => edition.format === 'text').map(edition => ({
      identifier: edition.identifier,
      language: edition.language,
      name: edition.name,
      englishName: edition.englishName,
      type: edition.type
    }))
  }
  
  return []
}

// Mapping des langues vers les éditions de traduction
export const TRANSLATION_EDITIONS = {
  'fr': 'fr.hamidullah',
  'en': 'en.sahih',
  'es': 'es.cortes',
  'ar': 'quran-uthmani',
  'hi': 'hi.hindi',
  'ru': 'ru.kuliev',
  'pt': 'pt.elhayek',
  'ur': 'ur.jalandhry'
}

// Récupérer l'édition de traduction pour une langue
export function getTranslationEdition(languageCode) {
  return TRANSLATION_EDITIONS[languageCode] || 'en.sahih'
}

