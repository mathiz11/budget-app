# 💰 Budget App

Application web moderne de gestion de budget mensuel. Suivez vos dépenses par catégories, respectez vos objectifs financiers et gardez le contrôle de votre budget.

## 📋 Présentation

Budget App est une Single Page Application (SPA) qui vous permet de :

- 📊 Visualiser votre budget mensuel en temps réel
- 💸 Suivre vos dépenses par catégories personnalisables
- 🏷️ Gérer vos catégories par défaut (templates pour nouveaux mois)
- 📈 Analyser vos habitudes de consommation
- 🎯 Respecter vos limites budgétaires avec des alertes visuelles
- 📅 Naviguer facilement entre les mois et initialiser de nouveaux budgets
- 🔒 Authentification sécurisée avec Supabase Auth

## 🛠️ Stack Technique

**Frontend**

- Vue.js 3 (Composition API) + TypeScript
- Vue Router 4 (navigation)
- Tailwind CSS + DaisyUI (UI)
- Pinia (gestion d'état)
- Vite (build tool)

**Backend**

- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)
- Architecture simplifiée des catégories (v2.0)

**Outils**

- pnpm (gestionnaire de packages)
- ESLint + Prettier (qualité de code)

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Compte Supabase configuré avec le schéma de base de données

### Installation

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos clés Supabase (URL et ANON_KEY)

# 3. Lancer l'application
pnpm dev
```

L'application sera accessible sur **http://localhost:5173**

## 🏗️ Structure du Projet

```
budget-app/
├── src/
│   ├── components/          # Composants Vue réutilisables
│   │   ├── AppHeader.vue
│   │   ├── AuthForm.vue
│   │   ├── CategoryCard.vue
│   │   ├── CategoryModal.vue
│   │   ├── ExpenseForm.vue
│   │   ├── ExpenseList.vue
│   │   ├── MonthSelector.vue
│   │   ├── MonthSummaryCard.vue
│   │   └── RevenueModal.vue
│   ├── services/            # Services métier
│   │   ├── authService.ts
│   │   ├── calculationService.ts
│   │   ├── categoryService.ts
│   │   ├── expenseService.ts
│   │   └── monthService.ts
│   ├── stores/              # Stores Pinia
│   │   ├── authStore.ts
│   │   └── budgetStore.ts
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   ├── views/               # Vues principales
│   │   ├── Dashboard.vue
│   │   └── DefaultCategories.vue
│   ├── router/              # Configuration du routeur
│   │   └── index.ts
│   ├── lib/                 # Configuration
│   │   └── supabase.ts
│   ├── App.vue              # Composant racine
│   ├── main.ts              # Point d'entrée
│   └── style.css            # Styles globaux
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Déploiement

```bash
# Build de production
pnpm build

# Les fichiers optimisés sont dans dist/
```

**Plateformes recommandées :**

- Vercel / Netlify
- Configuration : Build command `pnpm build`, Output `dist/`
- Variables d'environnement : `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`

---

Développé avec ❤️ et Vue.js
