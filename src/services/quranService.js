// Service pour l'API du Coran avec support multilingue
const API_BASE_URL = 'https://api.alquran.cloud/v1'

// Cache pour éviter les requêtes répétées
const cache = new Map()

// Fonction utilitaire pour les requêtes avec gestion CORS
const fetchWithCors = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur de requête:', error)
    throw error
  }
}

// Obtenir toutes les sourates avec traduction dans une langue spécifique
export const getAllSurahs = async (edition = 'fr.hamidullah') => {
  const cacheKey = `surahs_${edition}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    console.log(`📖 Chargement des sourates avec l'édition: ${edition}`)
    
    // Obtenir la liste des sourates avec métadonnées
    const metaResponse = await fetchWithCors(`${API_BASE_URL}/meta`)
    
    if (!metaResponse.data || !metaResponse.data.surahs) {
      throw new Error('Données de métadonnées invalides')
    }

    const surahs = metaResponse.data.surahs.references.map(surah => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType
    }))

    console.log(`✅ ${surahs.length} sourates chargées pour l'édition ${edition}`)
    
    cache.set(cacheKey, surahs)
    return surahs
  } catch (error) {
    console.error('Erreur lors du chargement des sourates:', error)
    throw new Error('Impossible de charger les sourates')
  }
}

// Obtenir une sourate spécifique avec traduction
export const getSurah = async (surahNumber, edition = 'fr.hamidullah') => {
  const cacheKey = `surah_${surahNumber}_${edition}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    console.log(`📖 Chargement de la sourate ${surahNumber} avec l'édition: ${edition}`)
    
    // Obtenir la sourate avec traduction
    const response = await fetchWithCors(`${API_BASE_URL}/surah/${surahNumber}/${edition}`)
    
    if (!response.data) {
      throw new Error('Données de sourate invalides')
    }

    const surah = {
      number: response.data.number,
      name: response.data.name,
      englishName: response.data.englishName,
      englishNameTranslation: response.data.englishNameTranslation,
      numberOfAyahs: response.data.numberOfAyahs,
      revelationType: response.data.revelationType,
      ayahs: response.data.ayahs.map(ayah => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        juz: ayah.juz,
        manzil: ayah.manzil,
        page: ayah.page,
        ruku: ayah.ruku,
        hizbQuarter: ayah.hizbQuarter,
        sajda: ayah.sajda
      }))
    }

    console.log(`✅ Sourate ${surahNumber} chargée avec ${surah.ayahs.length} versets`)
    
    cache.set(cacheKey, surah)
    return surah
  } catch (error) {
    console.error(`Erreur lors du chargement de la sourate ${surahNumber}:`, error)
    throw new Error(`Impossible de charger la sourate ${surahNumber}`)
  }
}

// Obtenir une sourate avec texte arabe ET traduction
export const getSurahWithTranslation = async (surahNumber, translationEdition = 'fr.hamidullah') => {
  const cacheKey = `surah_bilingual_${surahNumber}_${translationEdition}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    console.log(`📖 Chargement bilingue de la sourate ${surahNumber}`)
    
    // Obtenir le texte arabe et la traduction en parallèle
    const [arabicResponse, translationResponse] = await Promise.all([
      fetchWithCors(`${API_BASE_URL}/surah/${surahNumber}/ar.alafasy`),
      fetchWithCors(`${API_BASE_URL}/surah/${surahNumber}/${translationEdition}`)
    ])

    if (!arabicResponse.data || !translationResponse.data) {
      throw new Error('Données de sourate invalides')
    }

    const surah = {
      number: arabicResponse.data.number,
      name: arabicResponse.data.name,
      englishName: arabicResponse.data.englishName,
      englishNameTranslation: arabicResponse.data.englishNameTranslation,
      numberOfAyahs: arabicResponse.data.numberOfAyahs,
      revelationType: arabicResponse.data.revelationType,
      ayahs: arabicResponse.data.ayahs.map((arabicAyah, index) => {
        const translationAyah = translationResponse.data.ayahs[index]
        return {
          number: arabicAyah.number,
          numberInSurah: arabicAyah.numberInSurah,
          arabicText: arabicAyah.text,
          translationText: translationAyah ? translationAyah.text : '',
          juz: arabicAyah.juz,
          manzil: arabicAyah.manzil,
          page: arabicAyah.page,
          ruku: arabicAyah.ruku,
          hizbQuarter: arabicAyah.hizbQuarter,
          sajda: arabicAyah.sajda
        }
      })
    }

    console.log(`✅ Sourate bilingue ${surahNumber} chargée avec ${surah.ayahs.length} versets`)
    
    cache.set(cacheKey, surah)
    return surah
  } catch (error) {
    console.error(`Erreur lors du chargement bilingue de la sourate ${surahNumber}:`, error)
    throw new Error(`Impossible de charger la sourate ${surahNumber}`)
  }
}

// Rechercher dans le Coran
export const searchQuran = async (query, edition = 'fr.hamidullah', limit = 20) => {
  try {
    console.log(`🔍 Recherche dans le Coran: "${query}" (${edition})`)
    
    const response = await fetchWithCors(`${API_BASE_URL}/search/${encodeURIComponent(query)}/${edition}`)
    
    if (!response.data || !response.data.matches) {
      return []
    }

    const results = response.data.matches.slice(0, limit).map(match => ({
      surah: {
        number: match.surah.number,
        name: match.surah.name,
        englishName: match.surah.englishName
      },
      ayah: {
        number: match.numberInSurah,
        text: match.text
      }
    }))

    console.log(`✅ ${results.length} résultats trouvés pour "${query}"`)
    return results
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    throw new Error('Impossible d\'effectuer la recherche')
  }
}

// Obtenir les éditions disponibles
export const getAvailableEditions = async () => {
  const cacheKey = 'editions'
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    console.log('📚 Chargement des éditions disponibles')
    
    const response = await fetchWithCors(`${API_BASE_URL}/edition`)
    
    if (!response.data) {
      throw new Error('Données d\'éditions invalides')
    }

    const editions = response.data
      .filter(edition => edition.type === 'translation')
      .map(edition => ({
        identifier: edition.identifier,
        language: edition.language,
        name: edition.name,
        englishName: edition.englishName,
        type: edition.type
      }))

    console.log(`✅ ${editions.length} éditions chargées`)
    
    cache.set(cacheKey, editions)
    return editions
  } catch (error) {
    console.error('Erreur lors du chargement des éditions:', error)
    throw new Error('Impossible de charger les éditions')
  }
}

// Nettoyer le cache
export const clearCache = () => {
  cache.clear()
  console.log('🧹 Cache du service Coran nettoyé')
}

