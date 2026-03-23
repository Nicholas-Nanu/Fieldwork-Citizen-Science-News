# Fieldwork — Citizen Science News

> Science by everyone, for everyone.

Fieldwork is a citizen science news platform that aggregates, curates, and transparently labels science news. Every story carries a credibility label — like a nutritional label for science news.

---

## Quick Start (5 minutes)

### What you need first

1. **A GitHub account** — free at [github.com](https://github.com)
2. **A Vercel account** — free at [vercel.com](https://vercel.com) (sign up with your GitHub account)
3. **Node.js installed** — download from [nodejs.org](https://nodejs.org) (choose the LTS version)

### Step-by-step deployment

#### Step 1: Get the code on GitHub

1. Go to [github.com](https://github.com) and log in
2. Click the green **"New"** button (top left) to create a new repository
3. Name it `fieldwork`
4. Keep it **Public** (required for free Vercel hosting)
5. Click **"Create repository"**
6. You'll see a page with instructions — keep this tab open

#### Step 2: Upload the code

**Option A — Using GitHub's web interface (easiest):**
1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL the files and folders from this project
3. Click **"Commit changes"**

**Option B — Using the command line:**
Open a terminal in this project folder and run:
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fieldwork.git
git push -u origin main
```

#### Step 3: Deploy on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Find your `fieldwork` repository and click **"Import"**
4. Leave all settings as default
5. Click **"Deploy"**
6. Wait 1–2 minutes. Done! Your site is live at `fieldwork-xxxxx.vercel.app`

#### Step 4: Custom domain (optional, ~£10/year)

1. Buy a domain from [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Type your domain and click **"Add"**
4. Follow Vercel's instructions to update your DNS settings
5. Vercel handles HTTPS automatically

---

## Managing Content

### Adding a new story

1. Open the file `data/articles.js` on GitHub
2. Click the pencil icon (✏️) to edit
3. Copy the template from the top of the file
4. Paste it at the TOP of the articles list
5. Fill in the details
6. Click **"Commit changes"**
7. Your site rebuilds automatically in ~60 seconds!

### The credibility label numbers

When adding a story, you set four numbers for the credibility label:

**Evidence** (`evidence`):
- `0` = Peer-Reviewed
- `1` = Preprint
- `2` = Observational
- `3` = Anecdotal

**Source** (`source`):
- `0` = Academic
- `1` = Government
- `2` = NGO/Nonprofit
- `3` = Independent

**Replication** (`replication`):
- `0` = Replicated
- `1` = Awaiting
- `2` = First Observation
- `3` = Unverified

**Funding** (`funding`):
- `0` = Fully Disclosed
- `1` = Partially Known
- `2` = Undisclosed

### Categories

Use one of these exact values for the `category` field:
- `"ecology"` — Ecology & Environment
- `"space"` — Space & Astronomy
- `"marine"` — Marine & Ocean
- `"archaeology"` — Archaeology & History
- `"health"` — Health & Biomedical
- `"biodiversity"` — Biodiversity & Wildlife
- `"climate"` — Weather & Climate
- `"tech"` — Tech & AI in Science

### Content types

Use one of these for the `type` field:
- `"discovery"` — New findings
- `"project"` — Ongoing projects
- `"organization"` — Organizations
- `"award"` — Awards & recognition
- `"individual"` — People profiles

---

## Getting Help

You can use Claude (claude.ai) as your developer on call. When you need to make changes:

1. Describe what you want to change
2. If Claude needs to see a file, copy-paste its contents
3. Claude will give you the exact changes to make
4. Make the edit on GitHub, commit, and your site updates

Common things to ask Claude:
- "Help me add a new story to Fieldwork"
- "I want to change the tagline on my Fieldwork site"
- "Can you help me update the About page text?"
- "I want to add a new category for geology"

---

## Project Structure

```
fieldwork/
├── app/
│   ├── layout.jsx      ← Site-wide settings (title, meta tags, fonts)
│   ├── page.jsx         ← The main app (all pages and components)
│   └── globals.css      ← Basic CSS reset
├── data/
│   └── articles.js      ← YOUR STORIES — edit this file to manage content
├── public/              ← Static files (favicon, images)
├── package.json         ← Dependencies
├── next.config.js       ← Next.js settings
└── .gitignore           ← Files to exclude from GitHub
```

**The only file you need to edit regularly is `data/articles.js`**

---

## Costs

| Item | Cost | Notes |
|------|------|-------|
| Vercel hosting | Free | Free tier covers ~100K page views/month |
| Domain name | ~£10/year | Optional — you get a free .vercel.app URL |
| GitHub | Free | Public repositories are free |
| **Total** | **£0–10/year** | |

---

## Next Steps

Once your site is live:
1. Set up Plausible analytics (plausible.io, ~£7/month) or Umami (free self-hosted)
2. Create social media accounts and share your first stories
3. Set up a Buttondown newsletter (free for under 100 subscribers)
4. Start reaching out to citizen science organizations

---

Built with love for citizen science. 🌱
