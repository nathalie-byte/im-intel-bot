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

IMPORTANT: Only include content published between ${weekAgoStr} and ${today} (2026 only). Ignore anything older.

Search the web for recent 2026 activity from ALL FIVE schools:
1. Istituto Marangoni Miami (IMM) - @istitutomarangoni_miami on Instagram, istitutomarangonimiami.com
2. Miami Fashion Institute MDC - @miamifashioninstitute
3. FIT New York - Fashion Institute of Technology
4. SCAD - Savannah College of Art and Design
5. Parsons School of Design New York

For Instagram specifically, try to count and distinguish between:
- Regular posts (photos/carousels)
- Reels (video content)
- Stories (if visible)

For each school also search: LinkedIn, TikTok, press coverage, blogs, newsletters, website updates from 2026 only.

YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO TEXT BEFORE OR AFTER. NO MARKDOWN. JUST RAW JSON.

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "instagram_breakdown": {
    "imm":     { "posts": 0, "reels": 0, "stories": 0, "total": 0 },
    "mdc":     { "posts": 0, "reels": 0, "stories": 0, "total": 0 },
    "fit":     { "posts": 0, "reels": 0, "stories": 0, "total": 0 },
    "scad":    { "posts": 0, "reels": 0, "stories": 0, "total": 0 },
    "parsons": { "posts": 0, "reels": 0, "stories": 0, "total": 0 }
  },
  "birds_eye_view": {
    "summary": "2-3 sentence overview of what all schools are focusing on this week in 2026",
    "programming_overview": [
      { "school": "IMM",     "focus": "main theme this week", "activity_count": 3 },
      { "school": "MDC",     "focus": "main theme this week", "activity_count": 3 },
      { "school": "FIT",     "focus": "main theme this week", "activity_count": 3 },
      { "school": "SCAD",    "focus": "main theme this week", "activity_count": 3 },
      { "school": "Parsons", "focus": "main theme this week", "activity_count": 3 }
    ]
  },
  "differentials": [
    {
      "metric": "Instagram Reels this week",
      "imm_value": "X reels",
      "competitor": "SCAD",
      "competitor_value": "X reels",
      "gap": "behind",
      "note": "short observation"
    }
  ],
  "opportunities": [
    {
      "opportunity": "Specific action IMM could take this week",
      "based_on": "What competitor is doing well",
      "competitor": "FIT",
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
        "detail": "2-3 sentences why this matters for IMM",
        "urgency": "high"
      }
    ],
    "recommended_action": "One specific action IMM should take this week"
  },
  "schools": [
    {
      "key": "imm",
      "name": "Istituto Marangoni Miami (IMM)",
      "total_activities": 3,
      "items": [
        {
          "platform": "instagram",
          "title": "title",
          "snippet": "what was posted and its impact — 2026 content only",
          "url": "https://full-url.com",
          "time": "X days ago",
          "engagement": "N/A"
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
- ONLY include 2026 content from the last 7 days
- URLs must always start with https://
- Platform values: instagram, linkedin, tiktok, press, blog, newsletter, website
- Be specific with Instagram post/reel/story counts
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

  // Fix URLs missing https://
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
