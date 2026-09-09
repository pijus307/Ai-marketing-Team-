# Changelog

All notable changes to the AI Marketing Operating System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-26

### Added
- Complete AI Marketing Operating System frontend and server orchestration architecture.
- Full multi-agent workforce orchestration (SEO Analyst, Content Writer, Ad Specialist, Lead Funnel Architect, Social Strategist).
- Server-side Gemini 2.5 Flash GenAI integration via `@google/genai` SDK with fallback model support.
- Encrypted local key storage via AES-256-CBC algorithm for saved custom provider keys.
- Comprehensive website crawler simulation and live audit engine.
- Production build setup bundled into a single CommonJS server (`dist/server.cjs`) via `esbuild`.
- Production Docker containerization (`Dockerfile`, `.dockerignore`).
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`) and issue templates.
- Complete repository security hardening (`.gitignore`, `.env.example`, `SECURITY.md`).
