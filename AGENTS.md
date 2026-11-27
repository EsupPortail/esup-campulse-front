# AGENTS.md — Campulse (front)

## Contexte métier

**Campulse** est la plateforme du Service de la Vie Universitaire (SVU)
de l'Université de Strasbourg. Elle centralise :

- L'**annuaire** des associations étudiantes
- La **signature de chartes**
- Les **demandes de subventions**
- La **gestion des dossiers** des associations

Elle est utilisée par le SVU et les ~240 associations étudiantes du
site Alsace.

### Modèle SaaS multi-université

La plateforme est déployée en SaaS dans environ 20 universités. Chaque
université est paramétrable indépendamment : identité visuelle,
wording, fonctionnalités actives. Le code doit rester générique
pour supporter cette personnalisation.

### Acteurs

- **Associations** — créent leur espace, gèrent leurs membres, signent
  les chartes, déposent des demandes de subvention.
- **SVU / gestionnaires** — valident les dossiers, gèrent les
  commissions d'aide aux projets étudiants, paramètrent la plateforme.
- **Commissions** — examinent les demandes de subvention, rendent
  un avis.

### Notions clés

- **Annuaire** : listing public des associations avec filtres.
- **Charte** : document à signer électroniquement, avec conditions
  et échéances.
- **Demande de subvention (dépôt de projet)** : dossier avec pièces
  justificatives, suivi de traitement par les commissions.
- **Commission d'aide aux projets étudiants (CAPE)** : entité qui
  examine les demandes, avec ses membres et ses calendriers.
- **Tableau de bord association** : espace de l'association, gestion
  des membres, rôles et droits.

## Stack technique

- **Vue 3** — Composition API, `<script setup>`
- **TypeScript** — strict
- **Vite** — build / dev
- **Quasar** — UI framework (composants, directives, composés)
- **Pinia** — gestion d'état
- **Vue Router** — routing
- **Vue I18n** — internationalisation
- **Vitest** — tests unitaires / composants
- **Playwright** — tests E2E
- **pnpm** — gestion des dépendances

> [!info]
> Quasar impose un système de **variables CSS / dark mode** et des
> **dense mode**. Le styling passe par les props Quasar, les
> variables CSS du thème Quasar, et le CSS du projet si nécessaire.
> Pas de framework CSS utility-first (pas de Tailwind, pas de Bootstrap).

## Conventions de code

- **TypeScript strict** : pas de `any`. Types explicites sur props,
  emits et retours de fonctions. Pas de création de nouveaux types
  sans demander l'avis avant.
- **Composants Vue 3** en `<script setup>`, Composition API uniquement.
  Pas d'Options API.
- **Quasar-first** : utiliser les composants Quasar existants avant
  de créer un composant custom.
- **Styling** : variables CSS du thème Quasar + CSS local du
  composant si besoin. Pas de CSS global hors fichier de thème.
- **Composant > ~100 lignes** → factorise en sous-composants ou
  extrais la logique en composable.
- **HTML sémantique** : éviter les `div` et `span` **si possible**
  et privilégier l'usage d'éléments porteurs de sens (`section`, `p`...).

### Nommage

| Élément                          | Convention   | Exemple               |
|----------------------------------|--------------|-----------------------|
| Composant / fichier de composant | PascalCase   | `AssociationCard.vue` |
| Utilitaire                       | camelCase    | `formatDate.ts`       |
| Composable                       | préfix `use` | `useSubventions`      |
| Props / emits                    | camelCase    | `isLoading`           |

### Quasar

- Notifications : `q-notify`, jamais `alert()` / `window.confirm()`
- Dialogs : `QDialog` / `useDialog()`, pas de modales custom
- Tables : `QTable` avec props de tri / filtrage quand possible
- Chargement : `v-loading` ou prop `spinner`, pas de spinner custom
- Directives utiles : `v-ripple`, `v-touch`
- Composés : `QDialog`, `QDrawer`

### Accessibilité

- **RGAA / WCAG AA** par défaut. Structure HTML sémantique stricte
  avant ARIA.
- Les composants Quasar sont accessibles par défaut ; ne pas les
  désactiver sans raison.
- Vérifier le **focus management** sur les dialogs et les tableaux.

## Conventions de travail

- Lis les fichiers **avant** de les modifier.
- Propose, j'accepte ou je refuse, puis tu appliques.
- Si la demande est floue, **pose une question** avant de coder.
- Ne committe **jamais** sans demande explicite.
- Ne supprime pas de fichiers sans confirmation.
- Ne crée pas de dépendance sans avertir et justifier.
- Pas de refactoring « en passant » : si la demande est « fixer un
  bug », ne restructure pas le fichier entier.
- Ne modifie pas les règles métier pour faire fonctionner le code.
  Si une règle métier pose problème, avertis-moi.

## Commandes utiles

```sh
pnpm install        # installation des dépendances
pnpm dev            # dev server (Vite + Quasar)
pnpm build:prod     # type-check + build production
pnpm test:unit      # tests unitaires (Vitest)
pnpm test:e2e       # tests E2E (Playwright)
pnpm lint           # lint
```

## Commits

> [!warning]
> **Ne commiter QUE si l'utilisateur le demande expressément.**
> Pas de commit « par opportunité », pas de commit en fin de tâche
> sans demande. L'autorisation doit être claire (« committe ça »,
> « fais le commit »…). En cas de doute, demander avant.

### Format (gitmoji)

```
<emoji> (scope): commit message
```

- `<emoji>` → un seul emoji Unicode gitmoji (pas de shortcode `:tada:`)
- `(scope)` → la partie concernée (`ui`, `auth`, `e2e`, `api`…)
- `commit message` → impératif, minuscule, < 72 caractères, pas
  de point final
- Body (ligne vide + texte) → seulement si le « pourquoi » n'est pas
  évident
- Les messages de commit doivent TOUJOURS être en anglais