# Contributing

Thanks for considering a contribution to expo-boilerplate.

## Setup

```bash
npm install
cp .env.example .env    # set EXPO_PUBLIC_API_URL
npx expo start
```

Press `i`/`a`/`w` in the terminal. `expo start` targets a development build (`expo-dev-client` is installed); press `s` to switch to Expo Go.

## Branching and commits

- Branch off `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, ...) for commit messages and PR titles.
- Keep PRs focused on one change.

## Before opening a PR

Run the same checks CI runs, in the same order it runs them:

```bash
npm run lint
npx expo-doctor
npm run typecheck
npm run test:coverage -- --ci
npm run build:web
npm audit --audit-level=high
```

- Coverage floor (`jest.config.js`, currently statements 50% / branches 35% / functions 35% / lines 55%) is a floor: it may only go up. Do not lower it to make a failing suite pass, add tests instead.
- Do not use an em dash (U+2014) or ` -- ` as a dash in any file, including commit messages and PR text. CI's `check-dashes.sh` fails the `lint` job on either. Use a period, colon, comma, or parentheses instead.
- Tests use `@testing-library/react-native` 14, where `render` and `renderHook` are async, `await` them.
- If you add or upgrade an Expo managed package, use `npx expo install <package>`, not a plain `npm install`, then run `npx expo-doctor` to confirm the version matches the current SDK.
- If you touched `.maestro/`, run the affected flow locally against an emulator or simulator, Maestro is not part of CI.
- If you changed a dependency, commit the updated `package-lock.json`.
- If you added a new API call, route it through the shared `api` instance in `src/services/api.ts` so the auth interceptor and 401 handling apply.

## Reporting a security issue

Do not open a public issue for a vulnerability. Follow the private reporting process in [SECURITY.md](SECURITY.md) instead.
