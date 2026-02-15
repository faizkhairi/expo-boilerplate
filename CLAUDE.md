# expo-boilerplate — AI Development Guide

## Project Overview
Production-ready Expo mobile boilerplate with zero external account dependencies (except free Expo account for builds). Cross-platform React Native app with auth, state management, and NativeWind UI.

## Quick Start
```bash
npm install
cp .env.example .env    # Set EXPO_PUBLIC_API_URL
npm start               # Start Expo dev server
```
- Scan QR with Expo Go (iOS/Android) or press `i`/`a`/`w` for simulator/web

## Architecture
```
app/
├── (auth)/         # Auth routes — login.tsx, register.tsx
├── (tabs)/         # Tab navigation — index.tsx, profile.tsx, settings.tsx
├── _layout.tsx     # Root layout with Expo Router Stack
├── index.tsx       # Entry point — auth check + redirect
└── +not-found.tsx  # 404 page

src/
├── stores/auth.ts      # Zustand auth store + expo-secure-store
├── services/api.ts     # Axios client + JWT interceptor
├── components/         # Reusable components
├── types/              # TypeScript types
└── constants/          # App constants
```

## Key Commands
| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS (macOS only) |
| `npm run web` | Run on web |
| `eas build --profile development --platform all` | Build with EAS |

## Conventions
- **Routing**: Expo Router file-based routing — `app/(group)/file.tsx` creates `/group/file` route
- **Styling**: NativeWind (Tailwind classes) — use `className` prop: `<View className="flex-1 bg-white px-6" />`
- **Auth**: Zustand store + expo-secure-store for token. Use `useAuthStore()` hook to access auth state.
- **API**: Axios client at `src/services/api.ts`. Automatically adds `Authorization: Bearer <token>` header.
- **Forms**: React Hook Form + Zod for validation. See `app/(auth)/login.tsx` for pattern.
- **State**: Zustand for global state. expo-secure-store for persistent encrypted storage.
- **Navigation**: `useRouter()` for programmatic navigation. `Link` component for declarative links.
- **Env vars**: Prefix with `EXPO_PUBLIC_` to expose to client. Access via `process.env.EXPO_PUBLIC_*`.

## File Patterns
- **Routes**: `app/(group)/screen.tsx` — Expo Router routes
- **Layouts**: `app/(group)/_layout.tsx` — group layouts (Stack, Tabs, etc.)
- **Stores**: `src/stores/{name}.ts` — Zustand stores
- **Services**: `src/services/{name}.ts` — API clients, utilities
- **Components**: `src/components/{name}.tsx` — reusable UI components

## Auth Flow
1. User logs in → API returns `{ token, user }`
2. `useAuthStore().login(token, user)` stores token in expo-secure-store
3. Axios interceptor adds `Authorization: Bearer <token>` to all requests
4. On 401 response → auto-logout → redirect to login

**Backend Requirements:**
- `POST /api/auth/login` — returns `{ token, user: { id, email, name } }`
- `POST /api/auth/register` — creates user, returns success message

## Testing
- **Unit Tests**: Jest + React Native Testing Library — `npm test`
- **E2E Tests**: Maestro — `.maestro/` flow files

## Pre-Push Build Verification

**Always run type checking and expo-doctor locally before pushing to CI:**
```bash
npx tsc --noEmit && npx expo-doctor
```

**Important constraints:**
- **NativeWind only supports Tailwind CSS v3** — do NOT upgrade to Tailwind v4
- **Pin Expo SDK peer dependencies** — use exact versions (no `^` prefix) for packages like `react-dom`, `react-native-svg` that Expo SDK expects specific versions of. Run `npx expo-doctor` to check.
- **Jest must match Expo SDK** — use `~29.7.0` (Expo SDK 54 expects Jest 29, not 30+)

## Deployment
- **Development**: Expo Go app (scan QR code)
- **Internal Testing**: `eas build --profile preview`
- **Production**: `eas build --profile production` → `eas submit`
- **OTA Updates**: `eas update` for JS-only updates without app store review

## EAS Build
Free Expo account required. Cloud-based native builds.
```bash
eas login
eas build:configure           # Create eas.json
eas build -p all              # Build for all platforms
```

## Troubleshooting
- **Metro bundler cache**: `npx expo start --clear`
- **Node modules**: `rm -rf node_modules && npm install`
- **iOS pod install**: `cd ios && pod install && cd ..` (if using bare workflow)
- **Tailwind not working**: Check `tailwind.config.js` content paths, restart Metro

## Common Tasks
- **Add new screen**: Create `app/(group)/screen.tsx`
- **Add new tab**: Add to `app/(tabs)/_layout.tsx` and create screen file
- **Add API endpoint**: Add method to `src/services/api.ts`
- **Add global state**: Create new Zustand store in `src/stores/`
- **Style component**: Use NativeWind classes: `className="bg-blue-600 rounded-lg px-4 py-3"`
