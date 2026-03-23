# Fieldwork — RSS Automation Setup Guide

## What this does

A robot runs twice a day (8am and 4pm UK time), scans 20 citizen science RSS feeds, picks 3 relevant stories per run (≈6/day), assigns credibility labels based on the source, and updates your site automatically. Vercel detects the change and rebuilds. Zero effort from you.

## How it works

```
RSS Feeds (20 sources)
       ↓
GitHub Actions (runs twice daily, free)
       ↓
Python script filters for citizen science keywords
       ↓
Assigns credibility labels based on source rules
       ↓
Commits new stories to your repo
       ↓
Vercel auto-rebuilds your site (free)
       ↓
Stories appear on fieldwork 🎉
```

---

## Setup Steps (15 minutes)

### Step 1: Add the automation files to your repo

You need to add these files to your existing GitHub repository:

```
your-repo/
├── .github/
│   └── workflows/
│       └── fetch-feeds.yml       ← THE SCHEDULER
├── scripts/
│   ├── fetch_feeds.py            ← THE BRAIN
│   └── sources.json              ← YOUR FEED SOURCES
├── data/
│   ├── articles.js               ← YOUR SITE READS THIS (already exists)
│   ├── articles.json             ← THE SCRIPT MANAGES THIS
│   └── seen.json                 ← TRACKS WHAT'S BEEN PROCESSED
└── ... (your existing files)
```

**On GitHub:**

1. Go to your `fieldwork` repository
2. Click **"Add file" → "Create new file"**
3. For each file below, type the path (e.g. `.github/workflows/fetch-feeds.yml`) and paste the contents
4. Or upload them using **"Add file" → "Upload files"**

The files you need are in the zip I've provided.

### Step 2: Update your page.jsx to read from the data file

Your current `page.jsx` has articles hardcoded. You need to change it to import from the data file that the bot updates.

At the TOP of your `app/page.jsx`, add this line:
```javascript
import articlesData from '../data/articles.js';
```

Then find the line `const ARTICLES = [` and replace the entire hardcoded array with:
```javascript
const ARTICLES = articlesData;
```

Delete all the old hardcoded article objects between the `[` and `]`.

### Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click the **"Actions"** tab at the top
3. If you see a message about enabling workflows, click **"I understand my workflows, go ahead and enable them"**
4. You should see "Fetch RSS Feeds" listed as a workflow

### Step 4: Run it manually to test

1. In the Actions tab, click **"Fetch RSS Feeds"** in the left sidebar
2. Click **"Run workflow"** (dropdown on the right)
3. Click the green **"Run workflow"** button
4. Wait 1–2 minutes
5. Check your `data/articles.js` file — it should now have real stories!
6. Check your live site — new stories should appear within a minute

### Step 5: Verify it's scheduled

Once the manual run works, the automation is set up. It will now run automatically at:
- **7:00 UTC (8:00 AM UK time)** — morning batch
- **15:00 UTC (4:00 PM UK time)** — afternoon batch

You can check the Actions tab anytime to see run history and logs.

---

## Customisation

### Change how many stories per day

Edit `scripts/sources.json`:
```json
"settings": {
    "stories_per_run": 3,    ← Change this (3 per run × 2 runs = 6/day)
    "runs_per_day": 2,
    ...
}
```

### Change the schedule

Edit `.github/workflows/fetch-feeds.yml`:
```yaml
schedule:
    - cron: '0 7 * * *'     ← First run (UTC time)
    - cron: '0 15 * * *'    ← Second run (UTC time)
```

Cron format: `minute hour day month weekday`
Example: `'0 9 * * 1-5'` = 9am UTC, weekdays only

### Add a new RSS source

Edit `scripts/sources.json` and add an entry to the `sources` array:
```json
{
    "name": "Your New Source",
    "url": "https://example.com/feed.xml",
    "category": "ecology",
    "credibility": { "evidence": 1, "source": 0, "replication": 1, "funding": 0 },
    "type": "discovery",
    "needs_keyword_filter": true
}
```

Set `needs_keyword_filter` to:
- `true` — for general science sources (only citizen science stories get through)
- `false` — for dedicated citizen science sources (every story is relevant)

### Remove or disable a source

Delete its entry from `sources.json`, or add `"enabled": false` (you'd need to update the script to check for this).

### Add new keywords

Edit the `keywords` section in `sources.json`. Primary keywords are instant matches. Secondary keywords need 2+ matches to qualify.

---

## Monitoring

### Check what's been published
- Look at your live site
- Check `data/articles.json` on GitHub for the raw data

### Check if the bot ran
- Go to your repo → **Actions** tab → see run history
- Green ✅ = success, Red ❌ = something failed

### If a run fails
- Click the failed run to see logs
- Common issues: a feed URL changed, a feed is temporarily down
- The bot skips failed feeds and continues with the rest
- Come to Claude and paste the error log — I'll help fix it

### Override a credibility label
- Edit `data/articles.json` on GitHub
- Find the story, change its `credibility` values
- Commit — the JS file will be regenerated on the next bot run
- Or edit `data/articles.js` directly for immediate changes

---

## Costs

| Item | Cost |
|------|------|
| GitHub Actions | Free (2,000 mins/month for public repos) |
| Each run | ~30 seconds (uses < 1 minute of quota) |
| Monthly usage | ~30 runs × 0.5 min = 15 minutes (0.75% of free quota) |
| **Total** | **£0** |

---

## FAQ

**Q: What if a feed goes down?**
A: The script skips it and tries the other feeds. No stories from that source until it's back.

**Q: Will it post duplicate stories?**
A: No. Every story is hashed by title + source. The `seen.json` file tracks all processed articles.

**Q: Can I still add stories manually?**
A: Yes! Edit `data/articles.json` directly on GitHub. The bot will not overwrite your manual additions.

**Q: What if I want to remove a story?**
A: Delete it from `data/articles.json` on GitHub. It will also be removed from `articles.js` on the next bot run.

**Q: Will the site break if the bot fails?**
A: No. If the bot fails, your site just keeps showing the last successful batch of stories. Nothing is deleted on failure.
