# PlanA / Opaline

## Health

### develop

[![pipeline status](https://git.unistra.fr/di/plan_a/front/badges/develop/pipeline.svg)](https://git.unistra.fr/di/plan_a/front/-/commits/develop/)
[![coverage report](https://git.unistra.fr/di/plan_a/front/badges/develop/coverage.svg)](https://git.unistra.fr/di/plan_a/front/-/commits/develop/)

## Description

Création d'une application web pour la gestion des associations étudiantes et de leurs projets.

## Installation

### Installer les dépendances

```sh
npm install
```

### Lancer le serveur local

```sh
npm run dev
```

### Installer le back

[Consulter le wiki dédié](https://git.unistra.fr/di/plan_a/plana)

## Commandes utiles

### Vérifier le typage

```sh
npm run typecheck
```

### Vérifier le lint

```sh
npm run lint
```

### Lancer les tests avec Vitest

```sh
npm run test:unit
```

### Consulter le coverage des tests avec Vitest

```sh
npm run test:unit:coverage
```

## Développement

Consulter le [wiki d'aide au développement](https://git.unistra.fr/di/plan_a/front/-/wikis/home).

### Avant un commit

- Vérifier que les tests passent bien.
- Vérifier le typage.

```sh
npm run test:unit
npm run typecheck
```

### Déployer sur le serveur de test

- Avant de déployer, tester si le build s'effectue correctement en local : `npm run build`
- Actualiser le numéro de version dans le fichier package.json : `0.1.YYYYMMDD`
- Mettre à jour le changelog en listant les dernières mises à jour :
  soit manuellement, soit avec la
  commande `git log <dernier commit de tag, exemple :  cb7d928b>..HEAD --pretty="- %s" > CHANGELOG.md`
- Commiter avec le numéro de version en nom du commit : `0.1.YYYYMMDD`
- Déclarer le tag au dépôt Git avec `git tag 0.1.YYYYMMDD`
- Exécuter `git push origin 0.1.YYYYMMDD`
- Déployer la branche avec le
  tag : `./deploy.sh 0.1.YYYYMMDD test (--update-nginx-conf si besoin de mettre à jour la conf)`
