import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  console.log('[reporter] Generating report for', today);

  const prompt = `Today is ${today}. You are a competitive intelligence analyst for Istituto Marangoni Miami (IMM).

ONLY include content published between ${weekAgoStr} and ${today} (2026 only). Ignore anything older.

STEP 1 - Track IMM's own social media activity by searching these public accounts:
- Instagram: https://www.instagram.com/istitutomarangonimiami/
- LinkedIn: https://www.linkedin.com/school/istituto-marangoni-miami/
- TikTok: https://www.tiktok.com/@istitutomarangonimiami
- Facebook: https://www.facebook.com/IstitutoMarangoniMiami

For each IMM platform track:
- Most recent posts (title or description)
- Type of content: reel, carousel, photo, article, event, story
- What is being promoted: admissions, events, student work, faculty, campus life, programs
- Posting frequency this week

STEP 2 - Track these competitor schools (last 7 days, 2026 only):
- Miami Fashion Institute MDC @miamifashioninstitute
- FIT New York Fashion Institute of Technology
- SCAD Savannah College of Art and Design
- Parsons School of Design New York

Search Instagram, LinkedIn, TikTok, press, blogs, newsletters, websites for each competitor.

STEP 3 - Compare IMM to competitors and identify:
- Where IMM is behind (posting less, missing platforms)
- Where IMM is ahead
- Opportunities based on what competitors do well

YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO TEXT BEFORE OR AFTER. NO MARKDOWN. JUST RAW JSON.

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "imm_win": {
    "exists": true,
    "headline": "This Week's Win for IMM",
    "detail": "Describe the strongest IMM social media moment this week"
  },
  "birds_eye_view": {
    "summary": "2-3 sentence overview of what all schools are focusing on this week",
    "programming_overview": [
      { "school": "IMM",     "focus": "main theme or campaign this week", "activity_count": 3 },
      { "school": "MDC",     "focus": "main theme this week", "activity_count": 3 },
      { "school": "FIT",     "focus": "main theme this week", "activity_count": 3 },
      { "school": "SCAD",    "focus": "main theme this week", "activity_count": 3 },
      { "school": "Parsons", "focus": "main theme this week", "activity_count": 3 }
    ]
  },
  "differentials": [
    {
      "metric": "specific metric e.g. Instagram Reels posted this week",
      "imm_value": "X",
      "competitor": "school name",
      "competitor_value": "X",
      "gap": "behind",
      "note": "short observation"
    }
  ],
  "opportunities": [
    {
      "opportunity": "Specific action IMM could take",
      "based_on": "What competitor does well",
      "competitor": "school name",
      "priority": "high"
    }
  ],
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {
        "type": "event",
        "school": "school name",
        "headline": "headline",
        "detail": "why this matters for IMM",
        "urgency": "medium"
      }
    ],
    "recommended_action": "One specific action IMM should take this week"
  },
  "schools": [
    {
      "key": "imm",
      "name": "Istituto Marangoni Miami (IMM)",
      "total_activities": 4,
      "items": [
        {
          "platform": "instagram",
          "title": "Content title or description",
          "snippet": "Type: reel/photo/carousel. Promoting: admissions/events/student work. Description of content.",
          "url": "https://www.instagram.com/istitutomarangonimiami/",
          "time": "X days ago",
          "engagement": "X likes or N/A"
        }
      ]
    },
    { "key": "mdc",     "name": "Miami Fashion Institute (MDC)",  "total_activities": 3, "items": [] },
    { "key": "fit",     "name": "FIT New York",                   "total_activities": 3, "items": [] },
    { "key": "scad",    "name": "SCAD",                           "total_activities": 3, "items": [] },
    { "key": "parsons", "name": "Parsons School of Design",       "total_activities": 3, "items": [] }
  ]
}

Rules:
- 2026 content only from the last 7 days
- URLs must start with https://
- Platform values: instagram, linkedin, tiktok, facebook, press, blog, newsletter, website
- Find 4-6 real items for IMM, 3-5 for each competitor
- Return ONLY the JSON`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: prompt }]
  });

  let jsonText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  jsonText = jsonText.replace(/```json|```/g, '').trim();
  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in Claude response');
  jsonText = jsonText.slice(start, end + 1);

  const report = JSON.parse(jsonText);

  report.schools.forEach(school => {
    (school.items || []).forEach(item => {
      if (item.url && item.url.length > 0) {
        if (!item.url.startsWith('http://') && !item.url.startsWith('https://')) {
          item.url = 'https://' + item.url;
        }
      }
    });
  });

  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities across 5 schools');
  return report;
}
