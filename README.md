# Clairlia

Clairlia est un site éditorial francophone consacré aux avis, comparatifs et guides autour des compagnons IA, des services de rencontre et d'autres services en ligne destinés à un public adulte.

Site officiel : https://clairlia.com

---

## Présentation

Clairlia aide les lecteurs à comprendre et comparer des services en ligne avant de s'inscrire, de souscrire à un abonnement ou d'effectuer un achat.

Les contenus peuvent notamment analyser :

- les fonctionnalités ;
- la tarification ;
- les abonnements ;
- les systèmes de crédits ;
- les limitations ;
- la confidentialité ;
- les conditions d'utilisation ;
- les modalités d'annulation ;
- les avantages et inconvénients ;
- les différences entre plusieurs services.

Clairlia cherche à distinguer clairement :

- les informations vérifiées ;
- les éléments observés directement ;
- les déclarations provenant des éditeurs ;
- les analyses documentaires ;
- les fonctionnalités réellement testées.

Un service n'est pas présenté comme ayant été testé lorsqu'il a uniquement fait l'objet d'une analyse documentaire.

---

## Stack technique

Le projet utilise principalement :

- Astro
- TypeScript
- Markdown
- MDX
- Astro Content Collections
- Sharp
- Git
- GitHub
- GitHub Actions
- GitHub Pages
- Cloudflare DNS
- Google Search Console

Clairlia privilégie la génération statique et cherche à limiter autant que possible le JavaScript envoyé au navigateur.

---

## Prérequis

Le projet nécessite :

```text
Node.js >= 22.12.0
```

Vérification :

```bash
node --version
npm --version
```

---

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/biroue10/affiliate-site.git
cd affiliate-site
```

Installer les dépendances :

```bash
npm install
```

---

## Développement local

Démarrer le serveur de développement :

```bash
npm run dev
```

Pour rendre Astro accessible depuis le réseau local :

```bash
npm run dev -- --host 0.0.0.0
```

L'adresse locale par défaut est généralement :

```text
http://localhost:4321/
```

---

## Build de production

Créer le build avec le domaine de production :

```bash
SITE_URL=https://clairlia.com npm run build
```

Les fichiers statiques sont générés dans :

```text
dist/
```

---

## Validation complète

Avant tout commit ou déploiement important :

```bash
SITE_URL=https://clairlia.com npm run validate
```

La validation complète exécute :

```text
Astro check
→ build
→ validation du contenu publié
→ audit SEO
→ contrôle du budget performance
```

Les validations peuvent également être exécutées séparément.

### Astro / TypeScript

```bash
npm run check
```

### Contenu publié

```bash
npm run validate:content
```

### SEO

```bash
npm run validate:seo
```

### Performance

```bash
npm run validate:performance
```

---

## Budget de performance

Clairlia possède un budget JavaScript explicite.

La limite actuelle est :

```text
260000 octets gzip
```

Le contrôle est effectué par :

```text
scripts/check-performance.mjs
```

Une modification faisant dépasser cette limite doit être corrigée avant d'être commit et push.

Toujours exécuter :

```bash
SITE_URL=https://clairlia.com npm run validate
npm run validate:performance
```

avant de publier des modifications importantes.

L'objectif reste de conserver le JavaScript client très largement en dessous de cette limite lorsque cela est possible.

---

## Architecture du projet

Structure simplifiée :

```text
affiliate-site/
├── public/
├── scripts/
│   ├── check-performance.mjs
│   ├── check-published-content.mjs
│   ├── check-seo.mjs
│   └── get-noindex-paths.mjs
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── blog/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## Architecture éditoriale

Les principales catégories publiques sont :

```text
/ai/
/avis/
/comparatifs/
/guides/
/rencontres/
```

Les pages institutionnelles et éditoriales comprennent notamment :

```text
/a-propos/
/methodologie/
/equipe-editoriale/
/politique-editoriale/
/corrections/
/affiliation/
/confidentialite/
/contact/
```

Les articles sont stockés dans :

```text
src/content/blog/
```

---

## Modèle de contenu

Les articles utilisent Astro Content Collections.

Le frontmatter peut notamment contenir :

```text
title
description
pubDate
updatedDate
author
category
tags
heroImage
draft
affiliate
adultContent
noindex
canonical
verdict
pros
cons
faq
sources
```

Cette structure centralise les informations nécessaires au contenu éditorial, au SEO, aux données structurées et à la gestion de l'affiliation.

---

## SEO technique

Clairlia possède un système automatisé de validation SEO.

Les contrôles portent notamment sur :

- les balises title ;
- les meta descriptions ;
- l’unicité des titles et descriptions ;
- les URL canonical ;
- le caractère auto-référent des canonicals ;
- les directives robots ;
- la présence d'un H1 ;
- la hiérarchie des headings ;
- les données structurées JSON-LD ;
- les liens internes ;
- les liens éditoriaux dans la bonne langue ;
- les attributs obligatoires des liens affiliés OurDream ;
- le texte alternatif des images principales ;
- robots.txt ;
- le sitemap ;
- la cohérence entre les pages noindex et le sitemap.

Le site prend également en charge :

- Open Graph ;
- Twitter Cards ;
- sitemap XML ;
- flux RSS ;
- données structurées Article ;
- données structurées FAQ lorsque pertinentes ;
- breadcrumbs ;
- dates de publication ;
- dates de mise à jour.

---

## Domaine et indexation

Le domaine de production est :

```text
https://clairlia.com
```

Le sitemap est disponible à :

```text
https://clairlia.com/sitemap-index.xml
```

Le domaine est configuré dans Google Search Console.

Une page destinée à être indexée doit notamment :

- être publiée ;
- ne pas être un brouillon ;
- ne pas avoir `noindex: true` ;
- posséder une canonical correcte ;
- être incluse dans le maillage interne lorsque cela est pertinent ;
- fournir une réelle valeur éditoriale.

---

## Méthodologie éditoriale

Clairlia privilégie les sources primaires lorsque cela est possible, notamment :

- les sites officiels ;
- les pages tarifaires ;
- les centres d'aide ;
- les conditions d'utilisation ;
- les politiques de confidentialité ;
- la documentation officielle.

Nous cherchons à distinguer plusieurs niveaux d'information.

### Testé

Une fonctionnalité ou un service utilisé directement.

### Observé

Une information directement visible sur le site ou l'interface d'un service.

### Selon l'éditeur

Une information provenant de la documentation officielle mais qui n'a pas été vérifiée indépendamment.

### Analyse documentaire

Une conclusion obtenue par comparaison et analyse des informations disponibles sans prétendre avoir effectué un test pratique complet.

La méthodologie publique est disponible à :

https://clairlia.com/methodologie/

---

## Mise à jour des contenus

Les services analysés peuvent modifier :

- leurs prix ;
- leurs fonctionnalités ;
- leurs politiques ;
- leurs crédits ;
- leurs abonnements ;
- leurs conditions d'utilisation.

Les informations importantes doivent donc être revérifiées lorsque cela est nécessaire.

Une date de mise à jour ne doit pas être modifiée uniquement pour donner artificiellement l'impression qu'un contenu est récent.

---

## Politique de corrections

Lorsqu'une erreur factuelle vérifiable est identifiée, l'objectif est de la corriger.

Cela peut notamment concerner :

- un prix incorrect ;
- une fonctionnalité supprimée ;
- une information obsolète ;
- une mauvaise attribution de source ;
- un lien devenu invalide ;
- une modification importante des conditions d'un service.

Politique complète :

https://clairlia.com/corrections/

---

## Utilisation de l'intelligence artificielle

Des outils d'intelligence artificielle peuvent être utilisés pour assister certaines tâches telles que :

- la recherche ;
- la structuration ;
- la reformulation ;
- l'analyse ;
- la préparation éditoriale ;
- certaines tâches techniques.

L'utilisation d'outils automatisés ne remplace pas la responsabilité éditoriale.

Les informations factuelles importantes doivent être vérifiées avant publication lorsque des sources fiables sont disponibles.

---

## Affiliation

Clairlia peut utiliser des liens d'affiliation.

Lorsqu'un lien commercial est utilisé :

- sa présence doit être divulguée clairement ;
- le lien doit utiliser les attributs appropriés ;
- la commission potentielle ne doit pas déterminer la conclusion éditoriale ;
- un produit peut recevoir une conclusion négative même s'il possède un programme d'affiliation.

Politique d'affiliation :

https://clairlia.com/affiliation/

---

## Sécurité des données d'affiliation

Ne jamais commit dans Git :

```text
mot de passe
clé API privée
token secret
cookie de session
identifiants de dashboard
certificat privé
credentials de base de données
```

Un lien public de tracking affilié n'est pas équivalent à un secret d'authentification.

Les véritables secrets doivent être stockés dans des variables d'environnement ou dans GitHub Actions Secrets lorsque nécessaire.

---

## Fichiers sensibles

Ne jamais commit volontairement :

```text
.env
.env.local
.env.production
*.key
*.pem
credentials.json
private tokens
passwords
```

Toujours vérifier :

```bash
git status
git diff --cached
```

avant un commit.

---

## Contenu réservé aux adultes

Clairlia peut couvrir certains services destinés aux adultes.

Le site n'a toutefois pas pour objectif d'héberger directement du contenu sexuellement explicite.

Les métadonnées appropriées doivent être utilisées lorsque nécessaire.

---

## Indépendance éditoriale

Les commissions d'affiliation ne doivent pas dicter :

- le classement d'un produit ;
- ses avantages ;
- ses inconvénients ;
- le verdict ;
- les conclusions d'un comparatif.

Un service peut être déconseillé même s'il possède un programme d'affiliation rémunérateur.

Politique éditoriale :

https://clairlia.com/politique-editoriale/

---

## Équipe éditoriale

Les contenus peuvent être publiés sous la responsabilité de :

```text
Équipe éditoriale Clairlia
```

Informations complémentaires :

https://clairlia.com/equipe-editoriale/

---

## Déploiement

Clairlia est déployé sur GitHub Pages.

Le domaine personnalisé est :

```text
clairlia.com
```

Le DNS est géré séparément.

Avant tout déploiement :

```bash
SITE_URL=https://clairlia.com npm run validate
npm run validate:performance
```

Une validation en échec ne doit pas être ignorée pour forcer un déploiement.

---

## Workflow Git recommandé

Mettre `main` à jour :

```bash
git switch main
git pull --ff-only origin main
```

Créer une branche :

```bash
git switch -c feat/nom-de-la-feature
```

Après modification :

```bash
git status
git diff
```

Valider :

```bash
SITE_URL=https://clairlia.com npm run validate
npm run validate:performance
```

Stage :

```bash
git add .
```

Contrôler précisément ce qui va être commit :

```bash
git diff --cached
```

Commit :

```bash
git commit -m "feat: describe the change"
```

Push :

```bash
git push -u origin "$(git branch --show-current)"
```

---

## Règle de performance avant commit

Aucune modification ne doit être commit et push si :

```bash
SITE_URL=https://clairlia.com npm run validate
```

ou :

```bash
npm run validate:performance
```

échoue.

En particulier, tout dépassement du budget de :

```text
260000 octets gzip
```

doit être corrigé avant publication.

---

## Site officiel

https://clairlia.com

---

## Repository

https://github.com/biroue10/affiliate-site

---

## Licence et droits

Sauf indication contraire, le code, le design et les contenus de Clairlia restent protégés par leurs droits respectifs.

La présence publique du dépôt GitHub ne signifie pas que son contenu est placé dans le domaine public.

Tous droits réservés.
