# 🚀 AI Marketing Operating System

[![CI Pipeline](https://github.com/your-org/ai-marketing-os/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/ai-marketing-os/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF)](https://vitejs.dev/)

An enterprise-grade, full-scale digital marketing agency operating system powered by specialized AI agent workforces. The system automatically analyzes website domain targets, runs deep SEO crawlers, and generates tailored content strategies, social media campaigns, ad variations, lead funnels, and automated email sequences.

---

## ✨ Features

- **🌐 Live Site Discovery & Audit Engine**: Paste any domain or URL to trigger live site crawling, technical SEO scoring, positioning analysis, and audience persona profiling.
- **🤖 Specialized AI Agent Workforce**: Collaborate with expert sub-agents including SEO Analysts, Content Strategists, Paid Ads Managers, Funnel Architects, and Social Media Directors.
- **⚡ GenAI Orchestration Gateway**: High-speed, server-side integration powered by Google's `@google/genai` SDK and Gemini 2.5 models.
- **🔒 Encrypted Credential Vault**: Local custom provider keys (OpenAI, Anthropic, OpenRouter, Ollama) are encrypted on disk using AES-256-CBC.
- **📊 Real-time Analytics & Campaigns**: Track campaign performance, lead funnel conversion projections, keyword positions, and multi-channel marketing calendars.
- **📱 Responsive & Accessibility-Focused**: Modern Tailwind CSS v4 layout with dark/light visual design, fluid touch targets, and high-contrast typography.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion | Responsive single-page interface with dynamic animations |
| **Backend** | Express 4, Node.js 20, `tsx` | Secure proxy gateway and API router |
| **GenAI Engine** | `@google/genai` (Gemini 2.5 Flash) | High-speed server-side model orchestration |
| **Build Tooling** | Vite 6, `esbuild` | Bundles server into a single CommonJS `dist/server.cjs` file |
| **Security** | Node `crypto` AES-256-CBC, `.env` isolation | Credential masking and encrypted storage |

---

## 📁 Repository Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/       # GitHub bug & feature request forms
│   └── workflows/ci.yml      # GitHub Actions CI pipeline
├── data/                      # Local encrypted JSON persistence (git-ignored)
├── src/
│   ├── components/           # Modular UI components (Dashboard, AI Providers, Crawl Engine)
│   ├── data/                 # Agent workforce definitions & static presets
│   ├── lib/
│   │   ├── ai/               # Multi-provider AI manager & Gemini client
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Primary application view manager
│   ├── main.tsx              # React client entry point
│   └── types.ts              # Global TypeScript interfaces
├── .dockerignore              # Docker build exclusions
├── .env.example              # Blueprint for required environment variables
├── .gitignore                # Git tracked exclusions
├── CHANGELOG.md              # Project version history
├── CODE_OF_CONDUCT.md        # Community guidelines
├── CONTRIBUTING.md           # Contribution instructions
├── Dockerfile                # Production container deployment definition
├── LICENSE                   # MIT License
├── README.md                 # Project documentation
├── SECURITY.md               # Vulnerability reporting & security specs
├── server.ts                 # Express proxy server & API endpoints
├── server_db.ts              # AES-256 encrypted storage helper
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite & Tailwind compiler settings
```

---

## 🔑 Environment Variables

To run this application locally or in production, configure the environment variables as described in `.env.example`:

| Variable | Required | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | Required for server-side GenAI orchestrations | `AIzaSy...` |
| `DB_ENCRYPTION_KEY` | **Yes** | 32-character key for AES-256 credential encryption | `marketing_os_secure_key_32bytes` |
| `APP_URL` | No | Base application host URL | `http://localhost:3000` |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/ai-marketing-os.git
   cd ai-marketing-os
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `GEMINI_API_KEY`.

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

Build and run the container locally:

```bash
# Build Docker image
docker build -t ai-marketing-os .

# Run Docker container
docker run -d -p 3000:3000 \
  -e GEMINI_API_KEY="your_gemini_api_key_here" \
  -e DB_ENCRYPTION_KEY="your_custom_32_byte_encryption_key" \
  --name ai-marketing-os \
  ai-marketing-os
```

Access the application at `http://localhost:3000`.

---

## ☁️ Production Deployment Options

### Cloud Run / Container Platforms (Railway, Render, Fly.io)

1. Connect your GitHub repository to Railway or Render.
2. Select **Dockerfile** as the build source.
3. Add `GEMINI_API_KEY` and `DB_ENCRYPTION_KEY` under Environment Variables.
4. Set container target port to `3000`.

### Vercel / Serverless

For serverless deployments, compile the application using `npm run build` and run `npm run start` as your start command.

---

## 🛡️ Security & Privacy

- **Zero Client Key Exposure**: API secrets are executed strictly on the Node.js Express server (`server.ts`) and never sent to the browser bundle.
- **AES-256-CBC Storage Encryption**: User-configured credentials (e.g. custom OpenRouter/OpenAI keys) are encrypted before persisting to local storage files (`data/ai_providers_db.json`).
- **Key Masking**: Server responses mask API keys (e.g., `************ABCD`) to prevent key exposure in HTTP payloads or logs.

---

## 🧪 Testing & Quality Checks

Run local linting and production build verification:

```bash
# Run TypeScript compilation & lint check
npm run lint

# Build full production assets & esbuild server bundle
npm run build

# Preview production build locally
npm run start
```

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>1. Do I need a paid Gemini API key?</b></summary>
<p>No, you can obtain a free Gemini API key from <a href="https://aistudio.google.com/">Google AI Studio</a> to get started immediately.</p>
</details>

<details>
<summary><b>2. How are custom AI provider credentials stored?</b></summary>
<p>Keys are encrypted on disk using AES-256-CBC with the key defined in <code>DB_ENCRYPTION_KEY</code>. They are decrypted in memory only when proxying requests to third-party endpoints.</p>
</details>

<details>
<summary><b>3. Can I run local models like Ollama?</b></summary>
<p>Yes! Navigate to the <b>AI Providers</b> tab in the settings menu and configure your local Ollama connection endpoint (e.g., <code>http://localhost:11434</code>).</p>
</details>

---

## 📄 License

Distributed under the [MIT License](./LICENSE). See `LICENSE` for more information.
