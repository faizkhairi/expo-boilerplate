# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email **ifaizkhairi@gmail.com** with:

1. A description of the vulnerability
2. Steps to reproduce the issue
3. Any potential impact

You will receive acknowledgment within 48 hours and a detailed response within 5 business days.

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Security Best Practices

When using this boilerplate, ensure you:

- Never commit `.env` files or secrets to version control
- Use `expo-secure-store` for sensitive data (tokens, credentials)
- Use HTTPS for all API communication
- Keep dependencies updated (`npm audit`)
- Validate all user inputs with Zod schemas
- Use certificate pinning for production API connections
