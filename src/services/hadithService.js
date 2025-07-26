// Service pour les hadiths Sahih al-Bukhari
// Utilise un système de chargement à la demande par chapitre pour optimiser les performances

// Cache pour les données
let chaptersIndex = null
const hadithCache = new Map()
const chapterCache = new Map()

// Charger l'index des chapitres
async function loadChaptersIndex() {
  if (chaptersIndex) {
    return chaptersIndex
  }
  
  try {
    console.log('📚 Chargement de l\'index des chapitres Sahih al-Bukhari...')
    const response = await fetch('/hadiths/index.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    chaptersIndex = await response.json()
    console.log('✅ Index des chapitres chargé:', chaptersIndex.length, 'chapitres disponibles')
    return chaptersIndex
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'index des chapitres:', error)
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
    const index = await loadChaptersIndex()
    
    // Transformer l'index en format de chapitres avec métadonnées
    const chapters = index.map(chapter => ({
      id: chapter.id,
      title: getChapterTitle(chapter.id),
      arabicTitle: getChapterArabicTitle(chapter.id),
      hadithCount: chapter.hadithCount,
      filename: chapter.filename
    }))
    
    console.log(`📖 ${chapters.length} chapitres disponibles`)
    
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

// Récupérer les hadiths d'un chapitre (chargement à la demande)
export async function getChapterHadiths(chapterId) {
  const cacheKey = `chapter_${chapterId}`
  
  if (hadithCache.has(cacheKey)) {
    console.log(`📖 Hadiths du chapitre ${chapterId} récupérés du cache`)
    return hadithCache.get(cacheKey)
  }
  
  try {
    console.log(`🔍 Chargement des hadiths du chapitre ${chapterId}...`)
    
    // Charger le fichier spécifique du chapitre
    const response = await fetch(`/hadiths/chapter_${chapterId}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const chapterHadiths = await response.json()
    
    // Trier par ID dans le livre
    chapterHadiths.sort((a, b) => (a.idInBook || a.id) - (b.idInBook || b.id))
    
    console.log(`✅ ${chapterHadiths.length} hadiths chargés pour le chapitre ${chapterId}`)
    
    hadithCache.set(cacheKey, chapterHadiths)
    return chapterHadiths
  } catch (error) {
    console.error(`Erreur lors du chargement des hadiths du chapitre ${chapterId}:`, error)
    throw error
  }
}

// Rechercher dans les hadiths (recherche dans l'index puis chargement à la demande)
export async function searchHadiths(query) {
  if (!query || query.trim().length < 2) {
    return []
  }
  
  try {
    console.log(`🔍 Recherche: "${query}"`)
    const searchTerm = query.toLowerCase()
    const results = []
    
    // Obtenir la liste des chapitres
    const chapters = await getAllChapters()
    
    // Rechercher dans les chapitres qui correspondent au terme de recherche
    for (const chapter of chapters.slice(0, 10)) { // Limiter à 10 chapitres pour la performance
      try {
        const hadiths = await getChapterHadiths(chapter.id)
        
        hadiths.forEach(hadith => {
          const arabicMatch = hadith.arabic && hadith.arabic.includes(query)
          const englishMatch = hadith.english && hadith.english.text && 
                              hadith.english.text.toLowerCase().includes(searchTerm)
          const narratorMatch = hadith.english && hadith.english.narrator && 
                               hadith.english.narrator.toLowerCase().includes(searchTerm)
          
          if (arabicMatch || englishMatch || narratorMatch) {
            results.push({
              ...hadith,
              chapter: {
                id: chapter.id,
                title: chapter.title,
                arabicTitle: chapter.arabicTitle
              }
            })
          }
        })
        
        // Limiter les résultats pour éviter une surcharge
        if (results.length >= 50) break
      } catch (error) {
        console.warn(`Erreur lors de la recherche dans le chapitre ${chapter.id}:`, error)
      }
    }
    
    console.log(`📋 ${results.length} résultats trouvés pour "${query}"`)
    return results
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return []
  }
}

// Récupérer un hadith spécifique
export async function getHadith(hadithId, chapterId) {
  try {
    if (chapterId) {
      const hadiths = await getChapterHadiths(chapterId)
      const hadith = hadiths.find(h => h.id === hadithId)
      if (hadith) return hadith
    }
    
    // Si pas trouvé, chercher dans tous les chapitres (moins efficace)
    const chapters = await getAllChapters()
    for (const chapter of chapters) {
      try {
        const hadiths = await getChapterHadiths(chapter.id)
        const hadith = hadiths.find(h => h.id === hadithId)
        if (hadith) return hadith
      } catch (error) {
        continue
      }
    }
    
    throw new Error('Hadith non trouvé')
  } catch (error) {
    console.error('Erreur lors de la récupération du hadith:', error)
    throw error
  }
}

// Récupérer des hadiths aléatoires
export async function getRandomHadiths(count = 5) {
  try {
    const chapters = await getAllChapters()
    const results = []
    
    // Sélectionner des chapitres aléatoires
    const randomChapters = chapters.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, chapters.length))
    
    for (const chapter of randomChapters) {
      try {
        const hadiths = await getChapterHadiths(chapter.id)
        if (hadiths.length > 0) {
          const randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)]
          results.push({
            ...randomHadith,
            chapter: {
              id: chapter.id,
              title: chapter.title,
              arabicTitle: chapter.arabicTitle
            }
          })
        }
        
        if (results.length >= count) break
      } catch (error) {
        continue
      }
    }
    
    return results.slice(0, count)
  } catch (error) {
    console.error('Erreur lors de la récupération des hadiths aléatoires:', error)
    return []
  }
}

// Statistiques
export async function getStatistics() {
  try {
    const chapters = await getAllChapters()
    const totalHadiths = chapters.reduce((sum, chapter) => sum + chapter.hadithCount, 0)
    
    return {
      totalChapters: chapters.length,
      totalHadiths: totalHadiths,
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

// Précharger les chapitres les plus importants
export async function preloadImportantChapters() {
  const importantChapters = [1, 2, 3, 8, 23] // Révélation, Foi, Connaissance, Prière, Jeûne
  
  try {
    console.log('🚀 Préchargement des chapitres importants...')
    const promises = importantChapters.map(chapterId => 
      getChapterHadiths(chapterId).catch(error => {
        console.warn(`Échec du préchargement du chapitre ${chapterId}:`, error)
        return null
      })
    )
    
    await Promise.all(promises)
    console.log('✅ Chapitres importants préchargés')
    return true
  } catch (error) {
    console.error('❌ Erreur lors du préchargement:', error)
    return false
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
    30: "فضائل المدينة",
    31: "الجهاد",
    32: "الخمس",
    33: "الجزية",
    34: "البيوع",
    35: "السلم",
    36: "الإجارة",
    37: "الخصومات",
    38: "اللقطة",
    39: "المساقاة",
    40: "الاستقراض",
    41: "الوكالة",
    42: "الشركة",
    43: "الرهن",
    44: "العتق",
    45: "الهبة",
    46: "الشهادات",
    47: "الصلح",
    48: "الشروط",
    49: "الوصايا",
    50: "الجهاد",
    51: "الخمس",
    52: "الديات",
    53: "القسامة",
    54: "المحاربين",
    55: "الحيل",
    56: "التعبير",
    57: "الاعتصام",
    58: "الأيمان",
    59: "كفارة الأيمان",
    60: "الفرائض",
    61: "الحدود",
    62: "الجنايات",
    63: "أخبار الآحاد",
    64: "المغازي",
    65: "التفسير",
    66: "فضائل القرآن",
    67: "النكاح",
    68: "الطلاق",
    69: "النفقات",
    70: "الأطعمة",
    71: "العقيقة",
    72: "الأشربة",
    73: "المرضى",
    74: "الطب",
    75: "اللباس",
    76: "الأدب",
    77: "الاستئذان",
    78: "الدعوات",
    79: "التوبة",
    80: "الرقاق",
    81: "القدر",
    82: "الفتن",
    83: "الأحكام",
    84: "التمني",
    85: "أخبار الآحاد",
    86: "الاعتصام",
    87: "التوحيد",
    88: "الفتن",
    89: "الأحكام",
    90: "التمني",
    91: "أخبار الآحاد",
    92: "الاعتصام",
    93: "التوحيد",
    94: "الفتن",
    95: "الأحكام",
    96: "التمني",
    97: "التوحيد"
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

