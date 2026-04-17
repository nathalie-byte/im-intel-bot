# IM Miami · Competitor Intelligence Bot

Automated daily email briefing tracking competitor fashion schools across Instagram, LinkedIn, TikTok, press, blogs, newsletters, and websites.

**Tracks:** Miami Fashion Institute (MDC) · FIT · SCAD · Parsons  
**Sends:** Every weekday at 8:00 AM Eastern via SendGrid  
**Powered by:** Anthropic Claude + live web search

---

## What you get every morning

- 📊 **Key Insights** — most active school, unusual moves, viral posts, new programs
- 🔴 **Priority flags** — competitive threats, opportunities for IM Miami
- ✅ **Recommended Action** — one specific thing IM Miami should do this week
- 📱 **Full activity log** — color-coded cards per school per platform with links

---

## Setup (one time, ~20 minutes)

### Step 1 — Get your API keys

**Anthropic API Key**
1. Go to https://console.anthropic.com/settings/keys
2. Click "Create Key" → copy it

**SendGrid API Key**
1. Go to https://sendgrid.com → create free account (100 emails/day free)
2. Settings → API Keys → Create API Key → Full Access → copy it
3. Settings → Sender Authentication → verify your email or domain

---

### Step 2 — Deploy to Render (free tier)

1. **Push this folder to GitHub**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # create a new repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/im-intel-bot.git
   git push -u origin main
   ```

2. **Create a Render Web Service**
   - Go to https://render.com → New → Web Service
   - Connect your GitHub repo
   - Set these:
     - **Name:** `im-miami-intel`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

3. **Add Environment Variables** (in Render → Environment tab)

   | Key | Value |
   |-----|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `SENDGRID_API_KEY` | `SG....` |
   | `FROM_EMAIL` | your verified sender email |
   | `RECIPIENT_EMAILS` | n.tessier@immiami.com,h.baykam@immiami.com,m.allenjohnson@immiami.com,nathalie@tessier.biz|
   | `CRON_SCHEDULE` | `0 12 * * 1-5` (8 AM ET) |
   | `TZ` | `America/New_York` |

4. **Deploy** — Render builds and starts automatically

---

### Step 3 — Keep Render free tier awake (optional)

Render's free tier spins down after 15 minutes of inactivity. To keep it alive:
- Go to https://uptimerobot.com → create free account
- Add HTTP monitor → URL: `https://your-app.onrender.com/health`
- Interval: every 5 minutes
- Done — your service stays warm 24/7

---

## Usage

### Automatic
Reports send every weekday at 8:00 AM Eastern. No action needed.

### Manual trigger
- Visit your Render URL (e.g. `https://im-miami-intel.onrender.com`)
- Click "Generate & Send Report Now"
- Or call the API: `POST https://your-app.onrender.com/api/run-report`

### Change recipients
Update `RECIPIENT_EMAILS` in Render's Environment tab. Multiple emails separated by commas.

### Change schedule
Update `CRON_SCHEDULE` in Render's Environment tab.  
Use https://crontab.guru to build custom schedules.  
Examples:
- `0 12 * * 1-5` — weekdays 8 AM ET
- `0 13 * * 1,3,5` — Mon/Wed/Fri 9 AM ET
- `0 12 * * 1` — Mondays only

---

## Cost

| Service | Cost |
|---------|------|
| Render (free tier) | $0 |
| Anthropic API | ~$0.05–0.15 per report |
| SendGrid (free tier, 100/day) | $0 |
| **Total per month** | **~$1–3** |

---

## Project structure

```
competitor-intel/
├── src/
│   ├── server.js      # Express server + cron scheduler
│   ├── reporter.js    # Anthropic API + web search logic
│   └── mailer.js      # SendGrid HTML email builder
├── public/
│   └── index.html     # Status dashboard (your Render URL)
├── .env.example       # Copy to .env for local development
├── package.json
└── README.md
```

---

## Local development

```bash
cp .env.example .env
# fill in your keys in .env

npm install
npm run dev
# visit http://localhost:3000
# POST http://localhost:3000/api/run-report to test
```
