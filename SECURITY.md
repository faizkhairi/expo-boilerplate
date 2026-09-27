# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email **ifaizkhairi@gmail.com** with:

1. A description of the vulnerability
2. Steps to reproduce the issue
3. Any potential impact

You will receive acknowledgment within 48 hours and a detailed response within 5 business days.

## Supported Versions

Only the latest commit on `main` is supported. There are no maintained release branches.

## Built-in Protections

This boilerplate ships with, and CI enforces:

- **Secret scanning**: gitleaks runs in CI on every push and pull request.
- **Dependency auditing**: `npm audit --audit-level=high` runs in CI.
- **Zero-warning lint**: `npm run lint` (`--max-warnings=0`) plus `expo-doctor`, which checks Expo config and dependency version mismatches.
- **Coverage-floored tests**: `npm run test:coverage` enforces the floor in `jest.config.js` (statements 50%, branches 35%, functions 35%, lines 55%) on every push.
- **No em dash check**: `.github/scripts/check-dashes.sh` fails the lint job if an em dash (U+2014) or ` -- ` used as a dash appears anywhere in the repo.

## What This Template Does Not Provide

- **No CSP or security headers.** Native apps (iOS/Android) have no concept of response headers. The web export (`npm run build:web`) is a static site, response headers are the responsibility of whatever host serves `dist/`, configure them there.
- **No certificate pinning.** Add it in your fork if your threat model requires it.
- **No rate limiting or CORS configuration.** Those live on your backend API, not in this client template.

## Token Storage

- **iOS and Android**: `src/utils/secureStorage.ts` stores tokens with `expo-secure-store`, backed by Keychain (iOS) and Keystore (Android).
- **Web**: `expo-secure-store` has no web implementation, so `secureStorage` falls back to `localStorage`, which any script running on the page can read. If your app has a real web deployment, consider httpOnly cookies set by your API instead of a bearer token in `localStorage`.

## Security Best Practices

When using this boilerplate, ensure you:

- Never commit `.env` files or secrets to version control
- Use HTTPS for all API communication (`EXPO_PUBLIC_API_URL`)
- Keep dependencies updated (`npm audit`, `npx expo install --check`)
- Validate all user input with the Zod schemas in `src/utils/validation.ts`
- Set security headers at the host serving the web export, this template does not set any
- If you rely on the web build, treat `localStorage` token storage as the trade-off it is, see [Token Storage](#token-storage)
