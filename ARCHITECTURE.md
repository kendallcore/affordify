# Affordify System Architecture

> Last updated: 2026-02-13

---

## Overview

Affordify is an Amazon affiliate showcase website built with Next.js. Products are displayed from JSON data files, and users are redirected to Amazon affiliate links when they click on products.

**Current State:** Manual product management  
**Future State:** Automated sync from Pinterest

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         PINTEREST                           │
│                    (Source of Truth)                        │
│                                                             │
│  • Product pins with images                                │
│  • Structured descriptions                                 │
│  • Amazon affiliate links                                  │
│  • Organized in boards                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Pinterest API v5
                   │ (Polling every 15 min)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTOMATION PLATFORM                            │
│              (Make.com or n8n)                              │
│                                                             │
│  Workflow:                                                  │
│  1. Detect new/updated pins                                │
│  2. Parse description for structured data                  │
│  3. Validate all required fields                           │
│  4. Check for duplicates                                   │
│  5. Transform to JSON format                               │
│  6. Commit to GitHub repository                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ GitHub API
                   │ (Automatic commits)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
│                                                             │
│  src/data/                                                  │
│  ├── featured-deals.json                                   │
│  ├── expert-picks.json                                     │
│  └── comparison.json                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Git push triggers deployment
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL / NETLIFY                         │
│                  (Auto-deployment)                          │
│                                                             │
│  • Detects JSON file changes                               │
│  • Rebuilds Next.js app                                    │
│  • Deploys to production                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   AFFORDIFY WEBSITE                         │
│                   (affordify.com)                           │
│                                                             │
│  • Displays products from JSON                             │
│  • Users click product cards                               │
│  • Redirects to Amazon affiliate links                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Frontend (Next.js)

**Location:** `/src/app` and `/src/components`

**Purpose:** Display products and handle user interactions

**Key Files:**

| File | Purpose | Priority |
|------|---------|----------|
| `src/app/page.tsx` | Homepage layout | High |
| `src/components/sections/FeaturedDeals.tsx` | Featured products grid | High |
| `src/components/sections/ExpertPicks.tsx` | Hero featured product | High |
| `src/components/ui/ComparisonTable.tsx` | Product comparison | Medium |
| `src/components/ui/ProductCard.tsx` | Reusable product card | High |

**Pattern:** Server-side rendering (SSR) with static JSON imports

---

### 2. Data Layer (JSON Files)

**Location:** `/src/data`

**Purpose:** Store product information in a structured format

**Files:**

```
src/data/
├── featured-deals.json      # Grid of 4-8 featured products
├── expert-picks.json        # Single hero product
└── comparison.json          # Comparison table items
```

**Schema Example (featured-deals.json):**

```json
[
  {
    "id": "pinterest-pin-id-123",
    "name": "Apple Watch Ultra 2",
    "brand": "Apple",
    "description": "The most rugged and capable Apple Watch ever...",
    "price": "$799",
    "originalPrice": "$849",
    "rating": 4.9,
    "reviews": 1240,
    "image": "https://images.unsplash.com/...",
    "isEditorChoice": true,
    "affiliateLink": "https://amazon.com/..."
  }
]
```

**Validation Rules:**
- `id`: Required, unique (Pinterest Pin ID)
- `name`: Required, string
- `brand`: Required, string
- `price`: Required, must start with `$`
- `rating`: Required, 0-5 range
- `affiliateLink`: Required, must be Amazon URL
- `image`: Required, valid URL

---

### 3. Automation Layer (Make.com/n8n)

**Purpose:** Bridge between Pinterest and website

**Responsibilities:**
1. **Monitor Pinterest boards** for new/updated pins
2. **Extract data** from pin descriptions using regex
3. **Validate data** against schema requirements
4. **Prevent duplicates** using Pin ID as primary key
5. **Update JSON files** via GitHub API
6. **Send notifications** on success/failure

**Execution Frequency:** Every 15 minutes (configurable)

**Error Handling:**
- Invalid data → Skip and notify
- API failure → Retry 3 times with exponential backoff
- Duplicate detected → Update existing entry

---

### 4. Deployment Pipeline (Vercel)

**Purpose:** Automatically deploy website when JSON files change

**Workflow:**
1. Automation commits to GitHub
2. GitHub webhook triggers Vercel
3. Vercel rebuilds Next.js app
4. New version deployed to production
5. Users see updated products

**Build Time:** ~1-2 minutes  
**Deployment:** Automatic, zero-downtime

---

## Data Flow

### Adding a New Product

```
Step 1: User creates pin on Pinterest
  ↓
Step 2: Automation detects new pin (within 15 min)
  ↓
Step 3: Parse description
  • Extract: name, brand, price, rating, reviews
  • Validate: all required fields present
  ↓
Step 4: Check for duplicates
  • Query: Does Pin ID exist in JSON?
  • If yes: Update mode
  • If no: Create mode
  ↓
Step 5: Transform to JSON object
  ↓
Step 6: Update JSON file in GitHub
  • Read current file
  • Append/update product
  • Commit with message
  ↓
Step 7: Vercel auto-deploys
  ↓
Step 8: Product appears on website (2-3 min total)
```

### Updating an Existing Product

```
Step 1: User edits pin description on Pinterest
  ↓
Step 2: Automation detects change
  ↓
Step 3: Parse updated data
  ↓
Step 4: Find existing product by Pin ID
  ↓
Step 5: Update only changed fields
  ↓
Step 6: Commit to GitHub
  ↓
Step 7: Website updates automatically
```

---

## Technical Stack

### Frontend
- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Data Storage
- **Format:** JSON files
- **Version Control:** Git/GitHub
- **Future:** PostgreSQL (when scaling beyond 500 products)

### Automation
- **Platform:** Make.com (recommended) or n8n
- **APIs:** Pinterest API v5, GitHub API
- **Scheduling:** Cron-based (every 15 min)

### Hosting
- **Platform:** Vercel (or Netlify)
- **Domain:** Custom domain
- **SSL:** Automatic (Let's Encrypt)

---

## Security Considerations

### API Keys
- **Pinterest API Secret:** Stored in Make.com/n8n environment variables
- **GitHub Token:** Stored in automation platform, scoped to repository
- **Never commit:** API keys to repository

### Data Validation
- **Input sanitization:** All Pinterest data validated before use
- **XSS prevention:** Next.js auto-escapes output
- **Affiliate link validation:** Must be Amazon domain

### Rate Limiting
- **Pinterest API:** 300 requests/hour (standard tier)
- **GitHub API:** 5,000 requests/hour
- **Automation:** Respects rate limits with backoff

---

## Scalability Plan

### Current Capacity
- **Products:** Up to 100 per JSON file
- **Automation:** 1,000 operations/month (free tier)
- **Website:** Unlimited traffic (Vercel free tier)

### Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| Products per file | >100 | Split into multiple files |
| Automation operations | >1,000/month | Upgrade Make.com or switch to n8n |
| Website traffic | >100GB/month | Upgrade Vercel plan |
| JSON file size | >1MB | Migrate to database |

### Database Migration Path

When ready to scale beyond JSON:

```
Current: JSON files
  ↓
Step 1: Set up PostgreSQL (Supabase/Neon)
  ↓
Step 2: Create products table with same schema
  ↓
Step 3: Migrate existing JSON data
  ↓
Step 4: Update automation to write to DB
  ↓
Step 5: Update Next.js to read from DB
  ↓
Future: Full database-driven CMS
```

---

## Monitoring & Observability

### What to Monitor

1. **Automation Health**
   - Execution success rate
   - Failed operations count
   - Average execution time

2. **Data Quality**
   - Products with missing fields
   - Invalid affiliate links
   - Broken image URLs

3. **Website Performance**
   - Page load time
   - Core Web Vitals
   - Deployment success rate

### Tools

- **Make.com Dashboard:** Execution history, error logs
- **Vercel Analytics:** Traffic, performance metrics
- **GitHub Actions:** Build/deployment status
- **Custom:** Google Sheets audit log (optional)

---

## Conventions

### Naming

**Files:**
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Data files: kebab-case (e.g., `featured-deals.json`)
- Utilities: camelCase (e.g., `validateProduct.ts`)

**Variables:**
- camelCase for JavaScript/TypeScript
- SCREAMING_SNAKE_CASE for constants

**Git Commits:**
- Manual: `feat: add new product section`
- Automated: `[AUTO] Add product: Apple Watch Ultra 2`

### Code Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── layout/      # Header, footer, nav
│   ├── sections/    # Page sections
│   └── ui/          # Reusable UI components
├── data/            # JSON data files
└── utils/           # Helper functions
```

---

## Technical Debt

Current known issues to address:

- [ ] No data validation on JSON files (being added in automation phase)
- [ ] Hardcoded "See all 142 deals" text should be dynamic
- [ ] No error boundaries for component failures
- [ ] No loading states for images
- [ ] No analytics tracking for affiliate link clicks
- [ ] No A/B testing framework
- [ ] No image optimization (using external URLs)

---

*This architecture is designed to be simple now, but easy to scale later. Start with JSON files, migrate to database when needed.*
