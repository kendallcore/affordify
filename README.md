# Affordify 🛍️✨

> **Curated Fashion, Home Decor & Lifestyle Deals** — Powered by Pinterest & Amazon India.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](./LICENSE)

---

## 🌟 Overview

**Affordify** helps online shoppers find trending, high-quality, and budget-friendly products without endless searching. The web application automatically synchronizes curated pins from [Pinterest](https://in.pinterest.com/kendallcore01/) and connects them with verified Amazon India affiliate deals.

---

## ✨ Key Features

- **⚡ Automated Pinterest Synchronization**:
  Features an automated background scheduler that polls your Pinterest feed every 15 minutes. Newly uploaded Pinterest pins instantly appear on the website without manual intervention.

- **🛡️ Zero-Downtime RSS Fallback**:
  Built with a dual-layer data pipeline. If an OAuth API token expires or rate-limits, the engine seamlessly switches to live profile RSS parsing (`https://in.pinterest.com/kendallcore01/feed.rss`), ensuring the platform remains 100% online.

- **🧹 Intelligent Deal Deduplication**:
  Employs multi-tier deduplication filtering across product links, image URLs, and title strings—preventing duplicate deal cards from cluttering the UI.

- **📱 Fluid & Premium Design**:
  Crafted with Next.js 16 App Router, React 19, Framer Motion animations, Lucide icons, and TailwindCSS for a responsive, fast, and accessible shopping experience across all device sizes.

- **🔍 Dynamic SEO & Rich Metadata**:
  Includes custom OpenGraph preview cards, canonical URLs, and structured JSON-LD schema markup (`schema.org/Product`) for every deal page (`/deals/[slug]`).

- **📜 Legal & Affiliate Compliance**:
  Integrated dedicated Privacy Policy page (`/privacy`) meeting Pinterest Developers and Amazon Associates policy standards.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19
- **Styling**: TailwindCSS, PostCSS, Autoprefixer
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript & Modern JavaScript (Node.js ES Modules)
- **Alternative Backend**: Python / Flask (`app.py`) with SQLite database support

---

## 📂 Project Structure

```text
AFFORDIFY/
├── project-docs/                 # Architecture, Automation & API documentation
│   ├── ARCHITECTURE.md
│   ├── AUTOMATION_PLAN.md
│   ├── CMS_GUIDE.md
│   └── PINTEREST_INTEGRATION.md
├── services/                     # Core services & RSS/API integration
│   ├── pinterestService.js       # Pinterest API & RSS fetcher
│   └── pinterestService.d.ts     # TypeScript type definitions
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── pinterest/
│   │   │       ├── pins/         # API endpoint for client-side fetching
│   │   │       └── sync/         # Manual/Cron trigger endpoint
│   │   ├── deals/                # Dynamic deal pages (/deals/[slug])
│   │   ├── privacy/              # Privacy Policy page
│   │   ├── layout.tsx            # Global App Layout
│   │   └── page.tsx              # Main Landing Page
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── sections/             # Hero, FeaturedDeals, Newsletter
│   │   └── ui/                   # PinterestDealCard & UI elements
│   ├── data/
│   │   └── pinterest-deals.json  # Persisted deal records & cache
│   └── lib/
│       ├── pinterestDeals.ts     # File I/O & deal mapping utilities
│       └── pinterestScheduler.ts # Automated 15-minute background sync
├── app.py                        # Optional Python/Flask SQLite backend
├── package.json
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kendallcore/affordify.git
   cd affordify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
   PINTEREST_BOARD_ID=your_pinterest_board_id
   PORT=3000
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔄 How Pinterest Auto-Sync Works

1. **Upload**: You upload a new pin on your Pinterest profile ([`@kendallcore01`](https://in.pinterest.com/kendallcore01/)).
2. **Fetch**: The internal background scheduler (`startPinterestSyncScheduler`) polls for updates every 15 minutes via Pinterest API v5 or high-speed profile RSS feeds.
3. **Process**: Images are extracted in high resolution, deal data is normalized, and duplicate links are removed.
4. **Render**: The new deal automatically appears in the **Explore Top Deals** section on the website.

---

## 📄 License

This project is licensed under the [ISC License](./LICENSE).

---

## 🔗 Links

- **GitHub Repository**: [github.com/kendallcore/affordify](https://github.com/kendallcore/affordify)
- **Pinterest Board**: [pinterest.com/kendallcore01](https://in.pinterest.com/kendallcore01/)
