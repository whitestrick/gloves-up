# Gloves Up

![CI](https://github.com/whitestrick/gloves-up/actions/workflows/ci.yml/badge.svg)

Plan boxing routines, run them with a round timer, and track every session.

**Live app:** LIVE_URL-https://gloves-up-2u.vercel.app/routines

## Features

- **Accounts:** sign up and log in with email and password, or with Google. Pages for logged-in users are protected.
- **Drill library:** browse boxing drills, search by name, filter by category.
- **Routines:** build a routine (name, rounds, round length, rest, drills), then edit or delete it. Input is validated.
- **Round timer:** work and rest phases, pause, resume, skip, and "End and save". A finished workout saves itself.
- **Training history:** every saved session, weekly totals, and a motivational quote from an external API.
- **Responsive and accessible:** works from phone to desktop; skip link, visible focus ring, labelled inputs, screen reader announcements, reduced-motion support.

## Tech stack

Vite, React 19, React Router 7, Tailwind CSS 4, Firebase Authentication, Cloud Firestore, Vitest and React Testing Library, GitHub Actions, Vercel.

## APIs and data

- **Firebase Authentication:** email/password and Google sign-in.
- **Cloud Firestore:** routines and sessions are stored per user, so data persists after a refresh. Security rules (see `firestore.rules`) let a user read and write only documents where `userId` equals their own uid.
- **DummyJSON Quotes API (external API):** the History page loads a random quote from `https://dummyjson.com/quotes/random`. All API details live in `src/services/quoteService.js`, which checks the response status and the shape of the data.
  *Quotes powered by [DummyJSON](https://dummyjson.com).*

> The quote service first used QuoteSlate. It started answering browser requests with a bot check (HTTP 429), so I switched provider. Because the API code is in one service file, only the URL had to change.

## Getting started

```bash
git clone https://github.com/whitestrick/gloves-up.git
cd gloves-up
npm install
cp .env.example .env   
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

npm run dev
```

You need a Firebase project with Email/Password and Google sign-in enabled and a Firestore database. Publish the rules from `firestore.rules`. Never commit `.env`; it is in `.gitignore`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Check code with ESLint |
| `npm test` | Run the tests once |
| `npm run test:watch` | Re-run tests when files change |
| `npm run coverage` | Tests plus a coverage report |

## Testing

Tests use Vitest and React Testing Library and sit next to the code they test (`*.test.js`). They cover the timer rules, routine and session maths, form validators, the auth service, and the quote service (with a mocked `fetch`, including error statuses). Firebase and the network are always replaced by fakes, so tests are fast and repeatable. Coverage goal: 65% (`npm run coverage`).

## CI/CD and deployment

- **GitHub Actions** (`.github/workflows/ci.yml`) runs lint, tests and a production build on every pull request and on every push to `main`.
- **Vercel** deploys `main` automatically. The Firebase values are set as environment variables in the Vercel dashboard, not in the repository. `vercel.json` sends all paths to `index.html` so React Router works on refresh.
- Work was done one feature per pull request.

## Project structure

```
src/
  components/   reusable UI (Button, FormInput, RoutineCard, WorkoutTimer, ...)
  context/      Auth, Toast and RoutineDraft providers (Context API)
  hooks/        useAuth, useRoutines, useTimer, useSaveSession, useQuote, ...
  pages/        Login, Drills, Routines, RoutineForm, Workout, History
  services/     firebase, authService, routineService, sessionService, quoteService
  utils/        pure functions: timer rules, helpers, validators
  data/         drills.js (static drill list)
```

## Planning

- Wireframes (Figma): https://www.figma.com/design/Bqli9B9B4IaxUw80IXtTB5/Untitled?node-id=4-20&t=cHtX3dd9KtK5Xstk-1
- Project board (GitHub Projects): https://github.com/users/whitestrick/projects/12/views/1
- Colours: brand red `#B3001B` and its complement, teal `#0F766E`, on a cream and ink base.

## Credits

Quotes powered by [DummyJSON](https://dummyjson.com). Built as a school project.
