# Contributing to AI Marketing Operating System

Thank you for your interest in contributing! Here is how you can get started.

## Code of Conduct

Please review and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all community interactions.

## How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/ai-marketing-os.git
   cd ai-marketing-os
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Copy `.env.example` to `.env`** and populate your environment variables:
   ```bash
   cp .env.example .env
   ```
5. **Start the local dev server**:
   ```bash
   npm run dev
   ```
6. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```
7. **Verify linting and build**:
   ```bash
   npm run lint
   npm run build
   ```
8. **Commit your changes and push**:
   ```bash
   git commit -m "feat: add support for new AI agent workspace"
   git push origin feature/my-new-feature
   ```
9. **Open a Pull Request** against `main`.

## Pull Request Guidelines
- Ensure `npm run lint` and `npm run build` pass without warnings or errors.
- Keep commits clear and atomic.
- Describe changes thoroughly in the PR template.
