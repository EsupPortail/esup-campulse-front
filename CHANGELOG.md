# Changelog

## 1.3.3 (avril 2026)

- Correction du titre des objectifs d'un projet
- Correction des labels de composantes et domaines d'activité dans la signature des chartes
- Ajout d'un fallback en cas de projet non possédé dans la liste côté étudiant

## 1.3.2 (avril 2026)

- Correction du responsable de projet dans un projet d'association manquant
- Les étudiants peuvent uniquement voir les projets des associations dont ils sont membres et validés
- Ajout d'un Dockerfile pour lancer le front avec Docker

## 1.3.1 (avril 2026)

- Correction d'un problème de réactivité dans l'affichage des contenus de la page d'accueil

## 1.3.0-cleanup (avril 2026)

- Supprimer le processType CHARTER_ASSOCIATION_INSTITUTION
- Ajouter la désinfection DOM pour v-html
- L'identifiant de l'association devient l'identifiant utilisateur dans les routes userAssociations
- Correction : amountAllAudience doit être supérieur à 0
- Corriger le problème de flexbox sur la vue contact
- Refactoriser les règles des dates de mise à jour des commissions dans les propriétés calculées
- Refactoriser la mise à jour réactive du modèle en ligne dans la modification des commissions
- Un seul document sur deux est désormais nécessaire pour la gestion et l'inscription des utilisateurs
- Corriger updateUserAssociations
- CharterDate devient maintenant la date d'expiration de la charte
- Corriger la condition loadCasUser pour déclencher le POST
- Changer le statut du projet "archivé" en "terminé"
- Corriger l'affichage des champs d'adresse dans l'édition de l'association
- Utiliser l'acronyme de l'association ou le nom tronqué dans la gestion des utilisateurs
- La route de téléchargement de documents prend désormais l'ID utilisateur et est privée
- La propriété isMultiple des documents devient maxUploads
- Refactoriser l'ajout d'un utilisateur en tant que gestionnaire
- Optimiser les composables
- Nettoyer la logique du code
- Corriger la redirection vers la connexion après la déconnexion via l'intercepteur axios
- Ajouter une condition sur le téléchargement du fichier budget
- Refactoriser la récupération de l'association (suppression des sous-informations)
- Refactoriser user / userManagement / userAssociations
- Supprimer les requêtes publiques pour l'association d'utilisateur et l'inscription de groupe
- Refactoriser la route /users/associations
- Mettre à jour les types des liens d'association utilisateur
- Refactoriser l'inscription CAS
- Refactoriser le GET userAssociations
- Refactoriser l'inscription locale de l'utilisateur
- Supprimer les statistiques de la page d'accueil
- Supprimer le code de pagination inutile ou défectueux
- Ajouter l'attribut data-test au tableau de gestion des chartes
- Ajouter des attributs data-test pour la gestion des chartes
- Affichage conditionnel des noms de fonds et d'associations sur la vue d'inscription
- Ajouter des attributs data-test pour les tests E2E
- Configurer Sonarqube pour le projet
- Refactoriser la fonction getContents et ajouter des conditions pour les contenus manquants

## 1.2.8 (mai 2025)

- Inverser l'ordre des onglets de commission dans la gestion des projets

## 1.2.7 (mai 2025)

- Le coût individuel dans un projet peut être inférieur à 10

## 1.2.6 (avril 2025)

- Vérifier si socialNetworks est un array

## 1.2.5 (avril 2025)

- Retrait d'une commande obsolète et dernières références à Opaline

## 1.2.4 (avril 2025)

- Retrait du copyright des images en dur dans le thème

## 1.2.3 (novembre 2024)

- Ajout de Sentry sur démo
- Ajout de Matomo sur démo
- Mise à jour majeure des dépendances avec npm
- Correction de bug sur la vérification de la longueur du nom des documents soumis
- Renommer la recherche LDAP
- Correction de bug sur la variable d'environnement "open_ldap"

## 1.2.2 (octobre 2024)

### Fonctionnalités

- Débrayage de la fonctionnalité de création de compte par un gestionnaire depuis le LDAP
- Page de maintenance automatique

### Evolutions

- Renommage de CHARTE_SITE_ALSACE en CHARTE_SITE

### Corrections de bugs

- *Navigation* guard et intercepteur Axios vérifiant l'expiration des tokens
- Refactorisation de FormDocumentUploads pour clarifier les règles

### Configuration

- Correction des hosts de démo (ajout de root@)

## 1.2.1 (juillet 2024)

### Evolutions

- Mise à jour de la configuration des URL CAS pour permettre de l'étendre aux établissements du SaaS
- Mise à jour des textes liés au RGPD

## 1.2.0 (Q3 2024)

### Evolutions

- Déplacement des variables CSS personnalisables dans un fichier dédié
- Configuration pour le déploiement de l'instance démo (Apache)
- Lissage des locales pour les rendre plus neutres en vue des futurs déploiements

### Corrections de bugs

- Correction de l'affichage du statut de la charte Site Alsace
- Limite de caractères sur le nom des fichiers pouvant être soumis avec un projet

## 1.1.0 (Q2 2024)

### Fonctionnalités

- Possibilité de modifier les paragraphes de contenu du site par un MANAGER_GENERAL.

### Corrections de bugs

- Correction de la redirection automatique Logout > Login après expiration des tokens
- Placement du bouton "Revenir en haut" corrigé sur mobile.
- Statut de la charte Site Alsace corrigé dans l'interface de gestion des chartes.

### Autres changements

- Changement du terme "Validé, en attente de commission" par "En attente d'attribution".
- Changement du type de validation de la charte Site Alsace.

## 1.0.0 (16 Novembre 2023)

- Stabilisation initiale de l'application.