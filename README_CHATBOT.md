# 🤖 Chatbot IA Islamique - Manus Islam

## 🌟 Nouveauté : Assistant IA spécialisé dans le Coran et la Sunna authentique

Votre application manus-islam dispose maintenant d'un chatbot intelligent qui répond aux questions sur l'Islam en se basant uniquement sur le Coran et les hadiths authentiques.

## ✨ Fonctionnalités

- 🕌 **Spécialisé dans l'Islam** : Répond uniquement aux questions sur le Coran et la Sunna
- 📚 **Sources authentiques** : Cite toujours les références (sourates, hadiths sahih)
- 🌍 **Multilingue** : Interface en français avec citations arabes
- 💬 **Interface moderne** : Design élégant et facile à utiliser
- 🔍 **Questions suggérées** : Propose des questions courantes
- ⚡ **Réponses rapides** : Optimisé avec cache intelligent

## 🚀 Comment utiliser

1. **Ouvrir le chatbot** : Cliquez sur le bouton vert avec l'icône "IA" en bas à droite
2. **Poser une question** : Tapez votre question ou cliquez sur une suggestion
3. **Recevoir la réponse** : L'IA répond avec sources et références islamiques
4. **Continuer** : Posez d'autres questions sur l'Islam

## 📝 Exemples de questions

- "Que dit le Coran sur la patience ?"
- "Quels sont les piliers de l'Islam ?"
- "Comment faire les ablutions selon la Sunna ?"
- "Que dit le Prophète (ﷺ) sur la charité ?"
- "Quelle est l'importance de la prière en Islam ?"

## ⚙️ Configuration (pour les développeurs)

### 1. Variables d'environnement

Créez un fichier `.env` avec votre clé API OpenAI :

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_BASE=https://api.openai.com/v1
```

### 2. Obtenir une clé API OpenAI

1. Allez sur [https://platform.openai.com/](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Créez une nouvelle clé API
5. Copiez la clé dans votre fichier `.env`

### 3. Installation

Le chatbot est déjà intégré ! Il suffit de :

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer l'application
npm run dev
```

## 🔧 Fichiers ajoutés

- `src/components/ChatBot.jsx` - Composant principal du chatbot
- `src/services/chatbotService.js` - Service IA pour les réponses
- `.env.example` - Exemple de configuration
- `README_CHATBOT.md` - Cette documentation

## 🛡️ Sécurité et Limitations

### ✅ Ce que fait le chatbot :
- Répond aux questions sur l'Islam, le Coran et la Sunna
- Cite des sources authentiques (Sahih al-Bukhari, Muslim, etc.)
- Fournit des références précises
- Encourage la vérification avec des savants

### ❌ Ce que le chatbot ne fait PAS :
- Ne répond pas aux questions non-islamiques
- N'émet pas de fatwas complexes
- Évite les débats sectaires
- Ne traite pas de politique contemporaine

## 🎯 Qualité des réponses

Le chatbot est configuré pour fournir des réponses :
- **Authentiques** : Basées sur le Coran et la Sunna sahih
- **Structurées** : Format clair avec sources
- **Respectueuses** : Ton approprié pour les sujets religieux
- **Précises** : Références exactes des hadiths et versets

## 🔄 Exemple de réponse

```
بسم الله الرحمن الرحيم

Les piliers de l'Islam sont au nombre de cinq, ils constituent 
la base de la foi et de la pratique musulmane. Le Prophète 
Muhammad (ﷺ) les a clairement enseignés :

« L'Islam est basé sur cinq choses :
1. Attester qu'il n'y a pas d'autre divinité digne d'adoration 
   qu'Allah et que Muhammad est Son messager (chahada).
2. Accomplir la prière (salat).
3. Donner la zakat (aumône obligatoire).
4. Jeûner le mois de Ramadan (sawm).
5. Faire le pèlerinage à la Maison sacrée (hajj), si on en a 
   les moyens. »

(Sahih al-Bukhari, n°8 ; Sahih Muslim, n°16)

En arabe :
« بُنِيَ الإسلامُ على خَمْسٍ: شَهَادَةِ أنْ لا إلهَ إلا اللهُ... »

Conseil pratique : Il est important pour tout musulman de bien 
connaître ces piliers et de s'efforcer à les accomplir avec 
sincérité.

والله أعلم
```

## 🐛 Dépannage

### Problème : Le chatbot ne répond pas
- Vérifiez votre clé API OpenAI dans `.env`
- Vérifiez votre connexion internet
- Consultez la console du navigateur pour les erreurs

### Problème : Erreur 400 - Modèle non supporté
- Le service utilise `gpt-4.1-mini` par défaut
- Modèles supportés : `gpt-4.1-mini`, `gpt-4.1-nano`, `gemini-2.5-flash`

### Problème : Questions non-islamiques rejetées
- C'est normal ! Le chatbot est spécialisé uniquement dans l'Islam
- Reformulez votre question en lien avec l'Islam, le Coran ou la Sunna

## 📞 Support

Pour toute question technique ou suggestion d'amélioration :
1. Consultez la documentation complète
2. Vérifiez les logs dans la console du navigateur
3. Testez avec les questions suggérées

## 🎉 Profitez de votre assistant islamique !

Le chatbot est maintenant prêt à vous accompagner dans votre apprentissage de l'Islam. Posez vos questions et découvrez les enseignements du Coran et de la Sunna authentique.

**Qu'Allah vous facilite dans votre quête de connaissance !**

---

*Intégré avec ❤️ dans manus-islam*
*Basé sur le Coran et la Sunna authentique*

