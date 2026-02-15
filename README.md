# Expo Boilerplate

Production-ready Expo mobile boilerplate — zero external account dependencies (except free Expo account for EAS Build). Cross-platform app with auth, state management, and modern UI.

## Features

- **Expo SDK 54** with New Architecture enabled
- **Expo Router v6** — file-based routing (auth + tabs)
- **NativeWind** — Tailwind CSS for React Native
- **Zustand + expo-secure-store** — state management with secure token storage
- **React Hook Form + Zod** — form handling with validation
- **Axios** — HTTP client with JWT interceptor
- **Lucide React Native** — icon library
- **TypeScript** — full type safety

## Quick Start

```bash
# 1. Create project from template
gh repo create my-app --template faizkhairi/expo-boilerplate --private --clone
cd my-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_URL to your backend API

# 4. Start development
npm start
```

**Run on device/simulator:**
- iOS: Press `i` in terminal or scan QR code with Expo Go
- Android: Press `a` in terminal or scan QR code with Expo Go
- Web: Press `w` in terminal

## Architecture

```
app/
├── (auth)/           # Auth routes (login, register)
├── (tabs)/           # Tab navigation (home, profile, settings)
├── _layout.tsx       # Root layout
├── index.tsx         # Entry point (auth check + redirect)
└── +not-found.tsx    # 404 page

src/
├── stores/           # Zustand stores (auth)
├── services/         # API services (axios + interceptor)
├── components/       # Reusable components
├── types/            # TypeScript types
└── constants/        # App constants
```

## Tech Stack

| Concern | Technology | External Account? |
|---------|-----------|-------------------|
| Framework | Expo SDK 54 (React Native 0.81) | No |
| Routing | Expo Router v6 | No |
| Styling | NativeWind (Tailwind CSS) | No |
| State | Zustand | No |
| Auth Storage | expo-secure-store | No |
| HTTP Client | Axios | No |
| Forms | React Hook Form + Zod | No |
| Icons | Lucide React Native | No |
| Build | EAS Build | Free Expo account |

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator (macOS only) |
| `npm run web` | Run on web |

## Authentication

**Built-in auth flow:**
- JWT-based authentication with secure token storage
- Login/Register screens with form validation
- Axios interceptor for automatic token injection
- Auto-logout on 401 responses
- Protected routes via auth state check

**Auth Flow:**
1. User logs in → API returns JWT token + user data
2. Token stored in expo-secure-store (encrypted)
3. Zustand updates global auth state
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. On 401 response → auto-logout → redirect to login

**Setup:**
1. Set `EXPO_PUBLIC_API_URL` in `.env` to point to your backend
2. Backend must return `{ token: string, user: { id, email, name } }` on login
3. Backend auth endpoints:
   - `POST /api/auth/login` — login with email/password
   - `POST /api/auth/register` — register new user

## EAS Build (Optional)

To build native binaries with EAS:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo (free account)
eas login

# Configure project
eas build:configure

# Build for development
eas build --profile development --platform all

# Build for production
eas build --profile production --platform all
```

**EAS Build Profiles:**
- `development` — development build with Expo Go
- `preview` — internal testing build
- `production` — production build for app stores

## Deployment

**Development:**
- Use Expo Go app (no build required)
- Scan QR code from `npm start`

**Internal Testing:**
```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

**App Stores:**
```bash
# iOS App Store
eas build --profile production --platform ios
eas submit -p ios

# Google Play Store
eas build --profile production --platform android
eas submit -p android
```

## Project Structure

**Expo Router** uses file-based routing:
- `app/_layout.tsx` — root layout
- `app/index.tsx` — entry point (redirects based on auth)
- `app/(auth)/` — auth group (login, register)
- `app/(tabs)/` — tab navigation group (home, profile, settings)

**State Management:**
- Zustand for global state (auth, user)
- expo-secure-store for persistent token storage
- React Hook Form for local form state

**Styling:**
- NativeWind (Tailwind CSS classes in React Native)
- Use `className` prop like regular Tailwind
- Example: `<View className="flex-1 bg-white px-6" />`

## License

[MIT](LICENSE)

## Author

**Faiz Khairi** — [faizkhairi.my](https://faizkhairi.my) — [@faizkhairi](https://github.com/faizkhairi)
