# Changelog

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