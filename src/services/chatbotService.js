// Service pour le chatbot islamique spécialisé
// Utilise l'API OpenAI pour répondre aux questions sur le Coran et la Sunna authentique

// Configuration de l'API OpenAI
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
const OPENAI_API_BASE = import.meta.env.VITE_OPENAI_API_BASE || process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'

// Prompt système pour spécialiser l'IA dans l'Islam authentique
const SYSTEM_PROMPT = `Tu es un assistant islamique spécialisé dans le Coran et la Sunna authentique. Tes réponses doivent UNIQUEMENT se baser sur :

1. Le Coran (القرآن الكريم)
2. Les hadiths authentiques (صحيح) du Prophète Muhammad (ﷺ)
3. Les enseignements des Salaf as-Salih (les pieux prédécesseurs)

RÈGLES STRICTES :
- Ne réponds QUE aux questions liées à l'Islam
- Cite toujours tes sources (sourate/verset, hadith avec référence)
- Si tu n'es pas sûr d'une information, dis-le clairement
- Pour les questions non-islamiques, redirige poliment vers les sources islamiques
- Utilise un ton respectueux et bienveillant
- Commence par "بسم الله" quand approprié
- Termine par des invocations quand approprié

FORMAT DE RÉPONSE :
- Réponse claire et concise
- Citations coraniques en arabe avec traduction
- Références précises (ex: Sahih al-Bukhari, hadith n°...)
- Conseil pratique si applicable

SUJETS ACCEPTÉS :
- Croyance (Aqida)
- Adoration (Ibada)
- Morale et éthique islamique
- Histoire islamique authentique
- Jurisprudence (Fiqh) basique
- Invocations et dhikr

SUJETS REFUSÉS :
- Questions non-islamiques
- Débats sectaires
- Fatwas complexes (renvoyer vers les savants)
- Politique contemporaine
- Sciences non-religieuses

Réponds en français principalement, avec des citations arabes quand nécessaire.`

// Cache pour éviter les requêtes répétées
const responseCache = new Map()

// Fonction principale pour poser une question islamique
export async function askIslamicQuestion(question) {
  try {
    // Vérifier le cache
    const cacheKey = question.toLowerCase().trim()
    if (responseCache.has(cacheKey)) {
      console.log('📋 Réponse récupérée du cache')
      return responseCache.get(cacheKey)
    }

    // Validation de la question
    if (!question || question.trim().length < 3) {
      return "Veuillez poser une question plus détaillée sur l'Islam, le Coran ou la Sunna."
    }

    // Vérifier si c'est une question islamique
    if (!isIslamicQuestion(question)) {
      return `Je suis spécialisé uniquement dans les questions sur l'Islam, le Coran et la Sunna authentique. 

Votre question ne semble pas porter sur ces sujets. Je peux vous aider avec :
• Les enseignements du Coran
• Les hadiths du Prophète (ﷺ)
• Les pratiques islamiques
• La croyance musulmane
• L'histoire islamique

Pourriez-vous reformuler votre question en lien avec l'Islam ?`
    }

    console.log('🤖 Envoi de la question à l\'IA:', question)

    // Préparer la requête
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: question
      }
    ]

    // Appel à l'API OpenAI
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini', // Utiliser un modèle supporté
        messages: messages,
        max_tokens: 1000,
        temperature: 0.3, // Réponses plus cohérentes et factuelles
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Erreur API OpenAI:', response.status, errorData)
      
      if (response.status === 401) {
        return "Erreur d'authentification. Veuillez vérifier la configuration de l'API."
      } else if (response.status === 429) {
        return "Trop de requêtes. Veuillez patienter un moment avant de poser une nouvelle question."
      } else {
        return "Une erreur technique s'est produite. Veuillez réessayer dans quelques instants."
      }
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Réponse API invalide:', data)
      return "Réponse invalide de l'IA. Veuillez réessayer."
    }

    const aiResponse = data.choices[0].message.content.trim()
    
    // Validation de la réponse
    if (!aiResponse || aiResponse.length < 10) {
      return "Réponse trop courte reçue. Veuillez reformuler votre question."
    }

    // Ajouter au cache
    responseCache.set(cacheKey, aiResponse)
    
    // Limiter la taille du cache
    if (responseCache.size > 100) {
      const firstKey = responseCache.keys().next().value
      responseCache.delete(firstKey)
    }

    console.log('✅ Réponse IA reçue:', aiResponse.substring(0, 100) + '...')
    return aiResponse

  } catch (error) {
    console.error('❌ Erreur lors de la requête IA:', error)
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "Erreur de connexion. Vérifiez votre connexion internet et réessayez."
    }
    
    return `Une erreur inattendue s'est produite. En attendant, je vous encourage à :

• Consulter directement le Coran dans l'application
• Parcourir les hadiths de Sahih al-Bukhari
• Rechercher dans les sources islamiques authentiques

Veuillez réessayer votre question dans quelques instants.`
  }
}

// Fonction pour vérifier si une question est liée à l'Islam
function isIslamicQuestion(question) {
  const islamicKeywords = [
    // Français
    'islam', 'musulman', 'coran', 'quran', 'allah', 'prophète', 'muhammad', 'hadith', 'sunna', 'sunnah',
    'prière', 'salat', 'ramadan', 'jeûne', 'hajj', 'pèlerinage', 'zakat', 'charité', 'mosquée',
    'imam', 'sourate', 'verset', 'ayah', 'bukhari', 'muslim', 'tirmidhi', 'abu dawud',
    'halal', 'haram', 'makruh', 'mustahab', 'fiqh', 'aqida', 'tawhid', 'shirk',
    'dua', 'dhikr', 'invocation', 'ablution', 'wudu', 'ghusl', 'tahara', 'pureté',
    'jihad', 'hijab', 'nikah', 'mariage', 'divorce', 'héritage', 'usure', 'riba',
    'paradis', 'enfer', 'jannah', 'jahannam', 'akhirah', 'jugement', 'résurrection',
    'ange', 'jinn', 'shaytan', 'satan', 'prophètes', 'messagers', 'livre',
    
    // Arabe (translittéré)
    'bismillah', 'alhamdulillah', 'subhanallah', 'astaghfirullah', 'inshallah', 'mashallah',
    'salallahu alayhi wasallam', 'radiallahu anhu', 'alayhis salam',
    'la ilaha illa allah', 'allahu akbar', 'barakallahu feek',
    
    // Termes spécifiques
    'sahaba', 'compagnons', 'califes', 'omar', 'abu bakr', 'othman', 'ali',
    'aisha', 'fatima', 'khadija', 'mecque', 'médine', 'kaaba', 'qibla',
    'eid', 'aïd', 'fitr', 'adha', 'sacrifice', 'omra', 'umrah'
  ]

  const questionLower = question.toLowerCase()
  
  // Vérifier si la question contient des mots-clés islamiques
  const hasIslamicKeywords = islamicKeywords.some(keyword => 
    questionLower.includes(keyword.toLowerCase())
  )

  // Vérifier les patterns de questions islamiques
  const islamicPatterns = [
    /que dit (le coran|l'islam|la sunna)/i,
    /selon (l'islam|le coran|la sunna)/i,
    /dans (l'islam|le coran)/i,
    /prophète.*dit/i,
    /allah.*dit/i,
    /comment.*islam/i,
    /pourquoi.*islam/i,
    /est-ce que.*halal/i,
    /est-ce que.*haram/i,
    /comment.*prier/i,
    /comment.*jeûner/i,
    /piliers.*islam/i
  ]

  const hasIslamicPattern = islamicPatterns.some(pattern => 
    pattern.test(questionLower)
  )

  return hasIslamicKeywords || hasIslamicPattern
}

// Fonction pour obtenir des suggestions de questions
export function getIslamicQuestionSuggestions() {
  return [
    "Que dit le Coran sur la patience (sabr) ?",
    "Quels sont les piliers de l'Islam ?",
    "Comment faire les ablutions selon la Sunna ?",
    "Que dit le Prophète (ﷺ) sur la charité ?",
    "Quelle est l'importance de la prière en Islam ?",
    "Comment se comporter avec ses parents selon l'Islam ?",
    "Que dit le Coran sur la justice ?",
    "Quelles sont les invocations du matin et du soir ?",
    "Comment demander pardon à Allah ?",
    "Que dit l'Islam sur l'acquisition de la connaissance ?",
    "Quels sont les droits du voisin en Islam ?",
    "Comment purifier son cœur selon la Sunna ?"
  ]
}

// Fonction pour nettoyer le cache
export function clearResponseCache() {
  responseCache.clear()
  console.log('🧹 Cache des réponses nettoyé')
}

// Fonction pour obtenir les statistiques du cache
export function getCacheStats() {
  return {
    size: responseCache.size,
    keys: Array.from(responseCache.keys()).slice(0, 5) // Premiers 5 pour debug
  }
}

// Fonction pour précharger des réponses communes (optionnel)
export async function preloadCommonQuestions() {
  const commonQuestions = [
    "Quels sont les piliers de l'Islam ?",
    "Comment faire les ablutions ?",
    "Que dit le Coran sur la patience ?"
  ]

  console.log('🚀 Préchargement des questions communes...')
  
  for (const question of commonQuestions) {
    try {
      await askIslamicQuestion(question)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Délai entre requêtes
    } catch (error) {
      console.warn('⚠️ Erreur lors du préchargement:', question, error)
    }
  }
  
  console.log('✅ Préchargement terminé')
}

