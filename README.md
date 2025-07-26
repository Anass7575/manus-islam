# Islam Web - Site Islamique Multilingue

Un site web moderne et complet pour la lecture du Saint Coran et l'étude de Sahih al-Bukhari, disponible dans les langues les plus parlées du monde.

## 🌟 Fonctionnalités

### 📖 Coran Complet
- **114 sourates** avec texte arabe authentique
- **Traductions multilingues** dans 8 langues principales
- **Navigation intuitive** par sourate
- **Recherche avancée** dans le texte
- **Interface responsive** pour tous les appareils

### 📚 Sahih al-Bukhari
- **Collection complète** des hadiths authentiques
- **Organisation par chapitres** thématiques
- **Texte arabe** avec traductions
- **Informations sur les narrateurs**
- **Système de référencement**

### 🌍 Support Multilingue
- **Français** - Traduction Hamidullah
- **English** - Sahih International
- **العربية** - Texte original
- **Español** - Traduction Cortés
- **हिन्दी** - Traduction Hindi
- **Русский** - Traduction Kuliev
- **Português** - Traduction Elhayek
- **اردو** - Traduction Jalandhry

## 🚀 Technologies Utilisées

- **React 18** - Framework frontend moderne
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/UI** - Composants UI élégants
- **Lucide React** - Icônes modernes
- **Al Quran Cloud API** - Données du Coran
- **Hadith JSON** - Base de données des hadiths

## 📱 Fonctionnalités Techniques

### Interface Utilisateur
- **Design responsive** adaptatif
- **Mode sombre/clair** (à venir)
- **Navigation fluide** entre les pages
- **Chargement optimisé** des données
- **Gestion d'erreur** robuste

### Performance
- **Mise en cache** des données API
- **Chargement paresseux** des contenus
- **Optimisation des images**
- **Compression des assets**

### Accessibilité
- **Support RTL** pour l'arabe
- **Contraste élevé** pour la lisibilité
- **Navigation au clavier**
- **Lecteurs d'écran** compatibles

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- npm ou pnpm

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd islam-website

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

### Scripts Disponibles
```bash
# Développement
pnpm run dev

# Build de production
pnpm run build

# Prévisualisation du build
pnpm run preview

# Linting
pnpm run lint
```

## 📊 Structure du Projet

```
islam-website/
├── src/
│   ├── components/          # Composants React
│   │   ├── QuranPage.jsx   # Page du Coran
│   │   └── HadithPage.jsx  # Page des hadiths
│   ├── services/           # Services API
│   │   ├── quranService.js # Service Coran
│   │   └── hadithService.js# Service hadiths
│   ├── App.jsx            # Composant principal
│   └── main.jsx           # Point d'entrée
├── public/                # Assets statiques
└── README.md             # Documentation
```

## 🔧 Configuration

### Variables d'Environnement
```env
# API Configuration
VITE_QURAN_API_BASE=http://api.alquran.cloud/v1
VITE_HADITH_API_BASE=https://hadithapi.com
```

### Personnalisation
- **Thèmes** : Modifiez `tailwind.config.js`
- **Langues** : Ajoutez dans `services/quranService.js`
- **Styles** : Personnalisez dans `src/App.css`

## 🌐 APIs Utilisées

### Al Quran Cloud API
- **Base URL** : `http://api.alquran.cloud/v1`
- **Documentation** : [alquran.cloud](https://alquran.cloud/api)
- **Fonctionnalités** :
  - Métadonnées des sourates
  - Texte arabe complet
  - Traductions multilingues
  - Recherche dans le texte

### Hadith JSON Database
- **Source** : [hadith-json](https://github.com/AhmedBaset/hadith-json)
- **Contenu** : Sahih al-Bukhari complet
- **Format** : JSON structuré
- **Langues** : Arabe et traductions

## 📈 Optimisations

### Performance
- **Lazy loading** des composants
- **Mise en cache** des requêtes API
- **Compression** des images
- **Minification** du code

### SEO
- **Meta tags** optimisés
- **Structure sémantique** HTML
- **URLs** descriptives
- **Sitemap** généré

### Accessibilité
- **ARIA labels** appropriés
- **Contraste** conforme WCAG
- **Navigation** au clavier
- **Support** des lecteurs d'écran

## 🚀 Déploiement

### Build de Production
```bash
pnpm run build
```

### Déploiement Automatique
Le site peut être déployé sur :
- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **Serveur personnalisé**

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou suggestion :
- **Issues** : Utilisez GitHub Issues
- **Email** : [contact@islamweb.com]
- **Documentation** : Consultez ce README

## 🙏 Remerciements

- **Al Quran Cloud** pour l'API du Coran
- **Ahmed Baset** pour la base de données des hadiths
- **Communauté React** pour les outils et ressources
- **Traducteurs** pour les versions multilingues

---

**Qu'Allah bénisse ce projet et le rende bénéfique pour la Ummah** 🤲

