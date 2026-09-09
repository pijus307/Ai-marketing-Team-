# Security Policy

## Supported Versions

Only the latest main branch release of the AI Marketing Operating System receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a potential security vulnerability, please do **NOT** open a public issue.

Instead, please report it via private security advisory or email the maintainers directly.

### Guidelines
1. Describe the potential vulnerability and steps to reproduce.
2. Provide proof of concept if available.
3. Allow up to 48 hours for an initial response from maintainers.
4. Do not disclose the issue publicly until a patch has been released.

## Security Best Practices
- **API Keys**: Secrets such as `GEMINI_API_KEY` are executed server-side only in proxy handlers (`server.ts`). Never commit raw keys to client-side bundles or repository commits.
- **Credential Storage**: Saved AI provider keys are encrypted using AES-256-CBC with `DB_ENCRYPTION_KEY` before writing to disk.
- **Environment Exclusions**: Ensure `.env` is never committed. `.gitignore` is configured to exclude all `.env` variants except `.env.example`.
