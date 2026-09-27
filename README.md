# Expo Boilerplate

Expo (React Native) starter template. No third party SaaS accounts required, except a free Expo account if you use EAS Build. Cross platform app (iOS, Android, web) with auth, state management, forms, and an offline banner already wired up.

Click "Use this template" on GitHub, or see Quick Start below, to create a new repository from this boilerplate.

## Features

- **Expo SDK 57**: Expo Router 57, React Native 0.86, React 19.2, TypeScript 6 (strict, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`).
- **Styling**: NativeWind 4 (Tailwind CSS classes via `className`). NativeWind 4 only supports Tailwind CSS 3, so this template pins `tailwindcss@^3.4`, not v4.
- **UI components**: a small set of gluestack-ui v1 based components in `src/components/ui` (`Button`, `Card`, `Input`), wrapped by `GluestackUIProvider` in the root layout.
- **State**: Zustand 5 for global state (`src/stores/auth.ts`).
- **Auth storage**: `src/utils/secureStorage.ts` uses `expo-secure-store` (Keychain on iOS, Keystore on Android). `expo-secure-store` has no web implementation, so the web build falls back to `localStorage`, which any script on the page can read. That is the usual trade-off for a web SPA; if the web build matters for your app, prefer httpOnly cookies set by your API instead.
- **Forms**: React Hook Form + Zod 4 for validation.
- **HTTP client**: Axios (`src/services/api.ts`) with a request interceptor that adds `Authorization: Bearer <token>`, and a response interceptor that logs the user out on a 401, except for `/auth/login` and `/auth/register` (a 401 there means wrong credentials, not an expired session).
- **Offline banner**: `src/components/NetworkStatus.tsx`, mounted in `app/_layout.tsx`, shows a banner when the device has no connection or limited connectivity. Backed by `@react-native-community/netinfo` 12.
- **Offline queue (opt-in)**: `src/utils/offlineQueue.ts` exports an `OfflineQueue` class (`enqueue`, `getQueue`, `dequeue`, `clear`, `processQueue`). It is not wired into `api.ts` automatically. See [Project Structure](#project-structure) for a usage example.
- **E2E flows**: Maestro flows in `.maestro/` (`login.yaml`, `register.yaml`). They run locally against an emulator or simulator and are not part of CI.
- **Build**: EAS Build with `development`, `preview`, and `production` profiles, plus a static web export.

## Quick Start

Create a new project from this template, either:

```bash
npx degit faizkhairi/expo-boilerplate my-app
```

or:

```bash
gh repo create my-app --template faizkhairi/expo-boilerplate --clone
```

Then:

```bash
cd my-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_URL to your backend

# Start the dev server
npx expo start
```

Run on a device or simulator: press `i` (iOS), `a` (Android), or `w` (web) in the terminal. Because `expo-dev-client` is installed, `expo start` targets a development build (`eas build --profile development`); press `s` to switch to Expo Go instead.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Base URL for the backend API, read by `src/services/api.ts` | `http://localhost:3000/api` |
Any variable prefixed with `EXPO_PUBLIC_` is exposed to client code via `process.env.EXPO_PUBLIC_*`. Never put a secret behind that prefix.

EAS Build needs no variable: `eas init` writes the project ID to `app.json` (`expo.extra.eas.projectId`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start the dev server for Android |
| `npm run ios` | Start the dev server for iOS (macOS only) |
| `npm run web` | Start the dev server for web |
| `npm test` | Run the Jest suite once |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Run Jest with the coverage floor enforced |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run doctor` | `expo-doctor`, checks the Expo config and dependency versions |
| `npm run build:web` | Static web export to `dist/` |

## Testing

- **Unit tests**: `jest-expo` + `@testing-library/react-native` 14. In v14, `render` and `renderHook` are async, `await` them in new tests.
- **Coverage floor** (`jest.config.js`): statements 50%, branches 35%, functions 35%, lines 55%. CI runs `npm run test:coverage -- --ci` and fails if any floor is missed.
- **E2E**: Maestro flows in `.maestro/login.yaml` and `.maestro/register.yaml`. These need an emulator or simulator and are run locally only, they are not part of CI.

## Project Structure

```
app/
├── (auth)/            # login.tsx, register.tsx, group _layout.tsx
├── (tabs)/             # index.tsx, profile.tsx, settings.tsx, group _layout.tsx
├── _layout.tsx         # Root layout: ErrorBoundary, GluestackUIProvider, NetworkStatus, Stack
├── index.tsx           # Entry point (auth check + redirect)
└── +not-found.tsx      # 404 page

src/
├── components/
│   ├── ui/              # Button, Card, Input (gluestack-ui v1 based)
│   ├── ErrorBoundary.tsx
│   └── NetworkStatus.tsx
├── hooks/useNetworkStatus.ts
├── services/api.ts      # Axios client + auth interceptors
├── stores/auth.ts       # Zustand auth store
└── utils/
    ├── secureStorage.ts # expo-secure-store wrapper, localStorage on web
    ├── offlineQueue.ts  # opt-in retry queue
    ├── logger.ts
    └── validation.ts    # Zod schemas
```

`OfflineQueue` is not called automatically. A typical wiring is to enqueue on a failed request and replay the queue once the network is back:

```ts
import { OfflineQueue } from '../utils/offlineQueue';
import { api } from '../services/api';

try {
  await api.post('/notes', payload);
} catch (error) {
  await OfflineQueue.enqueue('/notes', 'post', payload);
}

// later, e.g. when useNetworkStatus reports isConnected again
await OfflineQueue.processQueue((url, method, data) => api.request({ url, method, data }));
```

## Security

- Native apps have no CSP or security headers to set. The web export (`npm run build:web`) is a static site, so response headers belong to whatever host serves `dist/`.
- Tokens live in `expo-secure-store` on iOS and Android, and in `localStorage` on web (see the Features note above for the trade-off).
- CI runs a dependency audit (`npm audit --audit-level=high`) and a secret scan (gitleaks) on every push and pull request.
- See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Deployment

**Native builds (EAS)**:

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform all   # dev client build
eas build --profile preview --platform all        # internal testing
eas build --profile production --platform all     # store build
eas submit -p ios
eas submit -p android
```

`eas.json` profiles: `development` (uses `expo-dev-client`, internal distribution), `preview` (internal distribution), `production`.

**Static web export**:

```bash
npm run build:web
```

Outputs a static site to `dist/`, deploy it to any static host.

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | Expo SDK 57, React Native 0.86, React 19.2 |
| Routing | Expo Router 57 |
| Language | TypeScript 6 (strict) |
| Styling | NativeWind 4, Tailwind CSS 3.4 |
| UI components | gluestack-ui v1 |
| State | Zustand 5 |
| Auth storage | expo-secure-store, localStorage fallback on web |
| Forms | React Hook Form + Zod 4 |
| HTTP client | Axios |
| Offline | NetInfo 12, opt-in offline queue |
| Testing | jest-expo, @testing-library/react-native 14, Maestro (local) |
| Build | EAS Build |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, the checks CI runs, and commit conventions.

## License

[MIT](LICENSE)

## Author

**Faiz Khairi** ([faizkhairi.github.io](https://faizkhairi.github.io), [@faizkhairi](https://github.com/faizkhairi))
