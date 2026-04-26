# Portfolio IA/Cyber - React + Vite + Vercel

Portfolio professionnel avec:
- landing premium animée (GSAP + canvas fond global),
- pages projet détaillées,
- route admin pour gérer les photos projets,
- déploiement optimisé sur Vercel.

## Stack Technique
- `React 19` + `TypeScript`
- `Vite 7`
- `Tailwind CSS`
- `GSAP` + `ScrollTrigger`
- `Vercel Blob` (upload/suppression photos)
- API serverless Vercel (`/api/admin/*`, `/api/public/*`)

## Lancer Le Projet En Local
1. Installer les dépendances:

```bash
npm install
```

2. Créer le fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

3. Remplir les variables:
- `ADMIN_PASSWORD=...`
- `BLOB_READ_WRITE_TOKEN=...`

4. Démarrer en mode dev:

```bash
npm run dev
```

5. Build production:

```bash
npm run build
```

## Routes Principales
- `#/` : page principale portfolio
- `#/projets/<slug>` : page détaillée d’un projet
- `#/admin` : interface admin photos (protégée par mot de passe)

## Admin Photos (Vercel Blob)
La page admin permet:
- upload d’image par projet (remplacement),
- suppression d’image existante,
- listing des images déjà stockées.

APIs utilisées:
- `GET /api/admin/list-images`
- `POST /api/admin/upload-image`
- `POST /api/admin/delete-image`
- `GET /api/public/project-images`

Conventions:
- dossier logique Blob: `projects/`
- nommage recommandé: `<slug>.jpg` (ou png/webp)
- taille max configurée: `2MB`

## Où Placer Les Images (Fallback Local)
Pour un fallback local (sans Blob), déposer les images dans:
- `public/projects/`

Exemple:
- `public/projects/youposh.jpg`
- `public/projects/deeptrue.jpg`

## Variables D’Environnement
Voir `.env.example`:
- `ADMIN_PASSWORD`: mot de passe admin pour sécuriser les endpoints
- `BLOB_READ_WRITE_TOKEN`: token Vercel Blob read/write

Ne jamais commit le fichier `.env` réel.

## Structure Projet (Résumé)
- `src/sections/` : sections landing (hero, skills, timeline, projects...)
- `src/pages/` : pages dédiées (`ProjectDetailsPage`, `AdminPhotosPage`)
- `src/data/projects.ts` : source des métadonnées projets
- `api/admin/` : endpoints protégés (upload/delete/list)
- `api/public/` : endpoint public pour résolution d’images

## Déploiement Vercel
1. Push sur GitHub.
2. Import du repo sur Vercel.
3. Ajouter les env vars:
- `ADMIN_PASSWORD`
- `BLOB_READ_WRITE_TOKEN`
4. Deploy.

## Sécurité Et Bonnes Pratiques
- Protéger `#/admin` avec mot de passe fort.
- Changer régulièrement `ADMIN_PASSWORD`.
- Limiter la taille des uploads (déjà fait côté API).
- Ne pas exposer les secrets dans le front.

## Auteur
- Mohammed GICUIDSI
- GitHub: [https://github.com/guissii](https://github.com/guissii)
