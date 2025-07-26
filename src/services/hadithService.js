// Service pour les hadiths Sahih al-Bukhari
// Utilise TOUS les hadiths du fichier bukhari.json complet

// Cache pour les données
let bukhariData = null
const hadithCache = new Map()
const chapterCache = new Map()

// Charger les données Bukhari depuis le fichier JSON
async function loadBukhariData() {
  if (bukhariData) {
    return bukhariData
  }
  
  try {
    console.log('Chargement de la base de données complète Sahih al-Bukhari...')
    const response = await fetch('/bukhari.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const jsonData = await response.json()
    
    // Vérifier la structure des données
    if (jsonData.hadiths && Array.isArray(jsonData.hadiths)) {
      bukhariData = jsonData.hadiths
      console.log('✅ Données Bukhari chargées:', bukhariData.length, 'hadiths au total')
      console.log('📊 Métadonnées:', jsonData.metadata || 'Non disponibles')
      return bukhariData
    } else if (Array.isArray(jsonData)) {
      // Fallback si c'est directement un tableau
      bukhariData = jsonData
      console.log('✅ Données Bukhari chargées (format tableau):', bukhariData.length, 'hadiths au total')
      return bukhariData
    } else {
      console.error('Structure de données inattendue:', Object.keys(jsonData))
      throw new Error('Format de données invalide - structure inattendue')
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données Bukhari:', error)
    throw error
  }
}

// Récupérer tous les chapitres avec le nombre réel de hadiths
export async function getAllChapters() {
  const cacheKey = 'all_chapters'
  
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)
  }
  
  try {
    const data = await loadBukhariData()
    
    // Grouper les hadiths par chapitre
    const chapterMap = new Map()
    
    data.forEach(hadith => {
      const chapterId = hadith.chapterId
      if (!chapterMap.has(chapterId)) {
        chapterMap.set(chapterId, {
          id: chapterId,
          title: getChapterTitle(chapterId),
          arabicTitle: getChapterArabicTitle(chapterId),
          hadithCount: 0,
          hadiths: []
        })
      }
      
      const chapter = chapterMap.get(chapterId)
      chapter.hadithCount++
      chapter.hadiths.push(hadith)
    })
    
    // Convertir en tableau et trier par ID
    const chapters = Array.from(chapterMap.values()).sort((a, b) => a.id - b.id)
    
    console.log(`📚 ${chapters.length} chapitres trouvés avec un total de ${data.length} hadiths`)
    
    chapterCache.set(cacheKey, chapters)
    return chapters
  } catch (error) {
    console.error('Erreur lors du chargement des chapitres:', error)
    // Retourner des données de fallback
    return getFallbackChapters()
  }
}

// Récupérer un chapitre spécifique
export async function getChapter(chapterId) {
  const chapters = await getAllChapters()
  return chapters.find(chapter => chapter.id === chapterId)
}

// Récupérer les hadiths d'un chapitre
export async function getChapterHadiths(chapterId) {
  const cacheKey = `chapter_${chapterId}`
  
  if (hadithCache.has(cacheKey)) {
    console.log(`📖 Hadiths du chapitre ${chapterId} récupérés du cache`)
    return hadithCache.get(cacheKey)
  }
  
  try {
    console.log(`🔍 Chargement des hadiths du chapitre ${chapterId}...`)
    const data = await loadBukhariData()
    
    // Filtrer les hadiths par chapitre
    const chapterHadiths = data.filter(hadith => hadith.chapterId === chapterId)
    
    // Trier par ID dans le livre
    chapterHadiths.sort((a, b) => a.idInBook - b.idInBook)
    
    console.log(`✅ ${chapterHadiths.length} hadiths trouvés pour le chapitre ${chapterId}`)
    
    hadithCache.set(cacheKey, chapterHadiths)
    return chapterHadiths
  } catch (error) {
    console.error('Erreur lors du chargement des hadiths du chapitre:', error)
    throw error
  }
}

// Rechercher dans les hadiths
export async function searchHadiths(query) {
  if (!query || query.trim().length < 2) {
    return []
  }
  
  try {
    console.log(`🔍 Recherche: "${query}"`)
    const data = await loadBukhariData()
    const searchTerm = query.toLowerCase()
    const results = []
    
    data.forEach(hadith => {
      const arabicMatch = hadith.arabic && hadith.arabic.includes(query)
      const englishMatch = hadith.english && hadith.english.text && 
                          hadith.english.text.toLowerCase().includes(searchTerm)
      const narratorMatch = hadith.english && hadith.english.narrator && 
                           hadith.english.narrator.toLowerCase().includes(searchTerm)
      
      if (arabicMatch || englishMatch || narratorMatch) {
        results.push({
          ...hadith,
          chapter: {
            id: hadith.chapterId,
            title: getChapterTitle(hadith.chapterId),
            arabicTitle: getChapterArabicTitle(hadith.chapterId)
          }
        })
      }
    })
    
    console.log(`📋 ${results.length} résultats trouvés pour "${query}"`)
    return results.slice(0, 100) // Limiter à 100 résultats pour la performance
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return []
  }
}

// Récupérer un hadith spécifique
export async function getHadith(hadithId) {
  try {
    const data = await loadBukhariData()
    const hadith = data.find(h => h.id === hadithId)
    
    if (!hadith) {
      throw new Error('Hadith non trouvé')
    }
    
    return hadith
  } catch (error) {
    console.error('Erreur lors de la récupération du hadith:', error)
    throw error
  }
}

// Récupérer des hadiths aléatoires
export async function getRandomHadiths(count = 5) {
  try {
    const data = await loadBukhariData()
    
    // Mélanger et prendre les premiers
    const shuffled = [...data].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('Erreur lors de la récupération des hadiths aléatoires:', error)
    return []
  }
}

// Statistiques
export async function getStatistics() {
  try {
    const data = await loadBukhariData()
    const chapters = await getAllChapters()
    
    return {
      totalChapters: chapters.length,
      totalHadiths: data.length,
      availableChapters: chapters.length
    }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error)
    return {
      totalChapters: 0,
      totalHadiths: 0,
      availableChapters: 0
    }
  }
}

// Fonctions utilitaires pour les titres des chapitres
function getChapterTitle(chapterId) {
  const titles = {
    1: "Révélation",
    2: "Foi", 
    3: "Connaissance",
    4: "Ablutions",
    5: "Bain rituel",
    6: "Menstruation",
    7: "Tayammum",
    8: "Prière",
    9: "Heures de prière",
    10: "Appel à la prière",
    11: "Prière du vendredi",
    12: "Prière de la peur",
    13: "Prières des deux fêtes",
    14: "Prière impaire",
    15: "Prière de demande de pluie",
    16: "Éclipse",
    17: "Prosternation",
    18: "Raccourcissement de la prière",
    19: "Prière de nuit",
    20: "Actions pendant la prière",
    21: "Funérailles",
    22: "Zakat",
    23: "Jeûne",
    24: "Prière de nuit pendant le Ramadan",
    25: "Retraite spirituelle",
    26: "Pèlerinage",
    27: "Omra",
    28: "Pèlerinage interdit",
    29: "Pénalités de chasse",
    30: "Vertus de Médine",
    31: "Expéditions",
    32: "Cinquième du butin",
    33: "Tributs",
    34: "Ventes",
    35: "Salaam",
    36: "Prêts",
    37: "Litiges",
    38: "Objets trouvés",
    39: "Irrigation",
    40: "Prêts",
    41: "Représentation",
    42: "Partenariat",
    43: "Hypothèque",
    44: "Affranchissement",
    45: "Cadeaux",
    46: "Témoignage",
    47: "Réconciliation",
    48: "Conditions",
    49: "Testaments",
    50: "Combats",
    51: "Révolution",
    52: "Sang-argent",
    53: "Loi du talion",
    54: "Contrainte",
    55: "Ruses",
    56: "Interprétation des rêves",
    57: "Conditions",
    58: "Serments et vœux",
    59: "Expiation des serments",
    60: "Héritage",
    61: "Limites légales",
    62: "Crimes",
    63: "Apostasie",
    64: "Contrainte",
    65: "Messagers",
    66: "Vertus du Coran",
    67: "Mariage",
    68: "Divorce",
    69: "Soutien",
    70: "Nourriture",
    71: "Sacrifice",
    72: "Boissons",
    73: "Patients",
    74: "Médecine",
    75: "Vêtements",
    76: "Bonnes manières",
    77: "Demande de permission",
    78: "Invocations",
    79: "Repentir",
    80: "Riqaq",
    81: "Unité",
    82: "Troubles",
    83: "Jugements",
    84: "Souhaits",
    85: "Sang-argent",
    86: "Loi du talion",
    87: "Interprétation",
    88: "Troubles",
    89: "Jugements",
    90: "Souhaits",
    91: "Accepter les informations",
    92: "S'en tenir au Livre et à la Sunna",
    93: "Unité",
    94: "Troubles",
    95: "Jugements",
    96: "Souhaits",
    97: "Unité"
  }
  
  return titles[chapterId] || `Chapitre ${chapterId}`
}

function getChapterArabicTitle(chapterId) {
  const arabicTitles = {
    1: "بدء الوحي",
    2: "الإيمان",
    3: "العلم", 
    4: "الوضوء",
    5: "الغسل",
    6: "الحيض",
    7: "التيمم",
    8: "الصلاة",
    9: "مواقيت الصلاة",
    10: "الأذان",
    11: "الجمعة",
    12: "صلاة الخوف",
    13: "العيدين",
    14: "الوتر",
    15: "الاستسقاء",
    16: "الكسوف",
    17: "السجود",
    18: "تقصير الصلاة",
    19: "التهجد",
    20: "العمل في الصلاة",
    21: "الجنائز",
    22: "الزكاة",
    23: "الصوم",
    24: "قيام رمضان",
    25: "الاعتكاف",
    26: "الحج",
    27: "العمرة",
    28: "المحصر",
    29: "جزاء الصيد",
    30: "فضائل المدينة"
  }
  
  return arabicTitles[chapterId] || `الباب ${chapterId}`
}

// Données de fallback en cas d'erreur
function getFallbackChapters() {
  return [
    { id: 1, title: "Révélation", arabicTitle: "بدء الوحي", hadithCount: 7 },
    { id: 2, title: "Foi", arabicTitle: "الإيمان", hadithCount: 53 },
    { id: 3, title: "Connaissance", arabicTitle: "العلم", hadithCount: 76 },
    { id: 4, title: "Ablutions", arabicTitle: "الوضوء", hadithCount: 113 },
    { id: 5, title: "Bain rituel", arabicTitle: "الغسل", hadithCount: 31 },
    { id: 6, title: "Menstruation", arabicTitle: "الحيض", hadithCount: 33 },
    { id: 7, title: "Tayammum", arabicTitle: "التيمم", hadithCount: 23 },
    { id: 8, title: "Prière", arabicTitle: "الصلاة", hadithCount: 172 },
    { id: 9, title: "Heures de prière", arabicTitle: "مواقيت الصلاة", hadithCount: 38 },
    { id: 10, title: "Appel à la prière", arabicTitle: "الأذان", hadithCount: 166 }
  ]
}

// Fonction pour précharger les données (optionnel)
export async function preloadBukhariData() {
  try {
    await loadBukhariData()
    console.log('🚀 Données Bukhari préchargées avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors du préchargement:', error)
    return false
  }
}

