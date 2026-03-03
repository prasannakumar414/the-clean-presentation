# Clean Presentation

Clean Presentation is a Next.js app for creating page-based presentations using:
- title slides
- content slides (title + image URL + markdown text)

Data is stored in Firebase Firestore (no authentication).

## Local setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill Firebase values in `.env.local`.

3. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main routes

- `/` - Projects page
- `/project/[id]` - View/present slideshow
- `/project/[id]/edit` - Edit project settings and page list
- `/project/[id]/page/[pageId]` - Edit a specific page

## Firebase Hosting deployment (GitHub Actions)

This repo includes `.github/workflows/firebase-deploy.yml`, which deploys on push to `main`.

Required GitHub secrets:
- `FIREBASE_SERVICE_ACCOUNT`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Also update `.firebaserc` with your Firebase project id before deploying.
