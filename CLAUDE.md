# expo-boilerplate: AI Development Guide

## Project Overview

Expo (React Native) starter template with no third party SaaS accounts required, except a free Expo account for EAS Build. Cross platform app (iOS, Android, web) with auth, state management, forms, and an offline banner.

## Quick Start

```bash
npm install
cp .env.example .env    # set EXPO_PUBLIC_API_URL
npx expo start
```

Press `i`/`a`/`w` for iOS/Android/web. `expo-dev-client` is installed, so `expo start` targets a development build; press `s` to switch to Expo Go.

## Structure

```
app/
├── (auth)/          # login.tsx, register.tsx
├── (tabs)/          # index.tsx, profile.tsx, settings.tsx
├── _layout.tsx      # ErrorBoundary + GluestackUIProvider + NetworkStatus + Stack
├── index.tsx         # Entry point, auth check + redirect
└── +not-found.tsx

src/
├── components/
│   ├── ui/           # Button, Card, Input (gluestack-ui v1 based)
│   ├── ErrorBoundary.tsx
│   └── NetworkStatus.tsx
├── hooks/useNetworkStatus.ts
├── services/api.ts   # Axios client + auth interceptors
├── stores/auth.ts    # Zustand auth store
└── utils/
    ├── secureStorage.ts  # expo-secure-store wrapper (see Conventions)
    ├── offlineQueue.ts   # opt-in retry queue, not wired into api.ts
    ├── logger.ts
    └── validation.ts     # Zod schemas
```

There is no `src/types/` or `src/constants/` folder yet. Add one only when a real need shows up, do not pre-create empty folders.

## Key Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` / `ios` / `web` | Start the dev server for a platform |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` / `test:coverage` | Jest, with or without the coverage floor |
| `npm run doctor` | `expo-doctor`, checks Expo config and dependency versions |
| `npm run build:web` | Static web export to `dist/` |

## Conventions

- **Auth storage**: always go through `secureStorage` (`src/utils/secureStorage.ts`), never call `expo-secure-store` directly in a component or store. It handles the web fallback to `localStorage`, a direct `SecureStore` call breaks on web.
- **Dependency versions**: this is an Expo managed project. To add or upgrade an Expo aware package, run `npx expo install <package>` (or `npx expo install expo@^58 --fix` for an SDK bump), not `npm install <package>`. Expo pins these packages to versions tested against the current SDK, a caret-range `npm install` can pull an incompatible one. Run `npm run doctor` after any dependency change.
- **NativeWind only supports Tailwind CSS 3.** Do not add `tailwindcss@4` or its CSS-first config, NativeWind 4 does not support it.
- **Styling**: NativeWind classes via the `className` prop, e.g. `<View className="flex-1 bg-white px-6" />`.
- **UI primitives**: prefer the components in `src/components/ui` (`Button`, `Card`, `Input`) over raw `GluestackUIProvider` primitives when one already exists for the pattern you need.
- **State**: Zustand for global state (`src/stores/`). React Hook Form for local form state, resolved with Zod schemas from `src/utils/validation.ts`.
- **API calls**: add new endpoints to `src/services/api.ts` (or a new file in `src/services/`), reuse the shared `api` axios instance so the auth interceptor and the 401 handling apply.
- **Tests**: `@testing-library/react-native` 14, `render` and `renderHook` are async in this version. `await render(...)`, not a bare call, or the assertion runs before the component mounts.
- **Typecheck covers tests**: `tsconfig.json` only excludes `node_modules`, `dist`, and `coverage`, test files are typechecked too. Keep them passing `tsc --noEmit`.
- **Lint**: `eslint.config.js` is a flat config (`eslint-config-expo/flat`). `npm run lint` runs with `--max-warnings=0`, a warning fails CI same as an error.
- **No em dash (U+2014) or ` -- ` as a dash** anywhere in this repo, including commit messages and PR text. CI's `check-dashes.sh` fails the lint job on either.

## Auth Flow

1. User submits the login form, `authAPI.login` posts to `/auth/login`.
2. On success, the caller stores the token via the auth store, which persists it with `secureStorage`.
3. The Axios request interceptor in `src/services/api.ts` reads the token from `useAuthStore` and adds `Authorization: Bearer <token>` to every request.
4. On a 401 response, the response interceptor logs the user out, except when the request was `/auth/login` or `/auth/register` (a 401 there means wrong credentials, not an expired session).

Expected backend endpoints (`src/services/api.ts`, `authAPI`): `POST /auth/login`, `POST /auth/register`, `GET /auth/me`. The boilerplate does not assume a specific response shape beyond what `authAPI` reads, check the backend contract before writing new screens against it.

## Offline Handling

- `NetworkStatus` (mounted in `app/_layout.tsx`) shows a banner automatically when `useNetworkStatus` reports no connection or limited connectivity. No wiring needed for the banner itself.
- `OfflineQueue` (`src/utils/offlineQueue.ts`) is opt-in and not called from `api.ts`. To use it, `enqueue` on a failed request and `processQueue` with a retry function once connectivity returns, see the example in the README's Project Structure section.

## Pre-Push Verification

Run the same checks CI runs before pushing:

```bash
npm run lint
npm run typecheck
npm run test:coverage -- --ci
npm run build:web
npx expo-doctor
```

## Testing

- **Unit**: Jest (`jest-expo` preset) + React Native Testing Library, `npm test`. Coverage floor in `jest.config.js`: statements 50%, branches 35%, functions 35%, lines 55%.
- **E2E**: Maestro flows in `.maestro/` (`login.yaml`, `register.yaml`). They need an emulator or simulator and run locally only, they are not part of CI.

## Deployment

- **Native**: `eas build --profile <development|preview|production> --platform <ios|android|all>`, then `eas submit` for a store build. Profiles are defined in `eas.json`.
- **Web**: `npm run build:web` exports a static site to `dist/`, deploy it to any static host.

## Troubleshooting

- **Metro cache**: `npx expo start --clear`
- **Stale node_modules**: `rm -rf node_modules && npm install`
- **iOS pods** (only if you eject to a bare workflow): `cd ios && pod install && cd ..`
- **NativeWind classes not applying**: check `tailwind.config.js` content paths, restart Metro

## Common Tasks

- **Add a screen**: create `app/(group)/screen.tsx`.
- **Add a tab**: add an entry to `app/(tabs)/_layout.tsx` and create the screen file.
- **Add an API call**: add a method to `src/services/api.ts`, reuse the shared `api` instance.
- **Add global state**: create a new Zustand store in `src/stores/`.
- **Add a UI primitive**: add it to `src/components/ui/` and export it from `src/components/ui/index.ts`.
