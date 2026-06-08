# P2P Support Platform
A community and support platform built with React and Firebase.

## Tech Stack
- React 
- Firebase - Auth, Firestore
- React Router v6
- shadcn/ui + Tailwind CSS
- npm

## Prerequisites
- Node.js v18+
- npm v9+
- A Firebase project

------------------------------------------

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/EmaFE/P2P.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with the following (never commit this file):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

You can find all of these in your Firebase project settings under **Settings -> General -> Your apps**

### 4. Run locally

```bash
npm run dev
```
App runs at `http://localhost:5173`.


------------------------------------------

## Firebase Setup

### Authentication

In the Firebase Console, go to **Authentication -> Sign-in method** and enable:

- Email/Password
- Google

### Firestore

Go to **Firestore Database** and create a database. Make sure your security rules are configured.

### Admin Access

Admin functionality is shielded via a custom `role` field on user documents in Firestore. To grant admin access, manually set `role: "admin"` on a user's document in the `users` collection.

------------------------------------------

## Encountered Gotchas

- Firestore's channel can be blocked by intense ad/tracker blocking. If you're seeing silent auth or data failures, try disabling them or switching browsers to debug.

------------------------------------------

## License

[MIT](LICENSE)
