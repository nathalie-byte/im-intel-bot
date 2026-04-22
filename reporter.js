import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  console.log('[reporter] Generating report for', today);

  const prompt = `Today is ${today}. You are a competitive intelligence analyst for Istituto Marangoni Miami (IMM).

Search the web thoroughly for the most recent 2026 content from these 5 fashion schools:
1. Istituto Marangoni Miami IMM - just do a light search of istitutomarangonimiami.com for any recent news or announcements. 2-3 items maximum.
2. Miami Fashion Institute MDC - mdc.edu/fashion
3. FIT New York - fitnyc.edu
4. SCAD - scad.edu
5. Parsons School of Design - newschool.edu/parsons

For IMM (school 1): Only search istitutomarangonimiami.com for content published in ${month}. Include ONLY what you can verify with a real URL from their website dated this month. If you cannot find anything from ${month}, return an empty items array. Do NOT invent, guess, or recycle old news. Do NOT include anything you cannot verify with a real current URL.

For competitor schools (2-5) search ALL of these source types:
- Their official website news and blog
- YouTube videos posted in ${month}
- Press coverage of their social media campaigns (search: "[school name] Instagram 2026", "[school name] TikTok 2026")
- Fashion industry press: WWD, Business of Fashion, Fashionista, Vogue Business covering this school
- LinkedIn company page posts
- Any newsletter or email campaigns mentioned in press
- Student project features and alumni news in 2026
- New program announcements or curriculum changes in 2026
- Events, shows, competitions, collaborations in 2026

STRICT DATE RULE: Only include content published in ${month}. If you cannot confirm the content is from ${month}, do not include it. Never include content from previous months or years.
For each item note: what platform/source it came from, what was being promoted, and why it matters for IMM competitively.

IMPORTANT: Your entire response must be a single JSON object starting with { and ending with }. No text outside the JSON.

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "birds_eye_view": {
    "summary": "2-3 sentence overview of the competitive landscape this week",
    "programming_overview": [
      {"school": "IMM", "focus": "what IMM is promoting", "activity_count": 4},
      {"school": "MDC", "focus": "what MDC is promoting", "activity_count": 4},
      {"school": "FIT", "focus": "what FIT is promoting", "activity_count": 4},
      {"school": "SCAD", "focus": "what SCAD is promoting", "activity_count": 4},
      {"school": "Parsons", "focus": "what Parsons is promoting", "activity_count": 4}
    ]
  },
  "differentials": [
    {"metric": "specific metric", "imm_value": "IMM data", "competitor": "school", "competitor_value": "their data", "gap": "behind", "note": "observation"}
  ],
  "opportunities": [
    {"opportunity": "specific action IMM could take", "based_on": "what competitor does well", "competitor": "school", "priority": "high"}
  ],
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {"type": "event", "school": "school", "headline": "headline", "detail": "why this matters for IMM", "urgency": "medium"}
    ],
    "recommended_action": "one specific action for IMM this week"
  },
  "schools": [
    {
      "key": "imm",
      "name": "Istituto Marangoni Miami (IMM)",
      "total_activities": 4,
      "items": [
        {"platform": "instagram", "title": "content title", "snippet": "what was posted, what it promoted, press coverage if any", "url": "https://istitutomarangonimiami.com", "time": "X days ago", "engagement": "N/A"}
      ]
    },
    {"key": "mdc", "name": "Miami Fashion Institute (MDC)", "total_activities": 4, "items": [
      {"platform": "press", "title": "title", "snippet": "description", "url": "https://mdc.edu", "time": "X days ago", "engagement": "N/A"}
    ]},
    {"key": "fit", "name": "FIT New York", "total_activities": 4, "items": [
      {"platform": "youtube", "title": "title", "snippet": "description", "url": "https://fitnyc.edu", "time": "X days ago", "engagement": "N/A"}
    ]},
    {"key": "scad", "name": "SCAD", "total_activities": 4, "items": [
      {"platform": "press", "title": "title", "snippet": "description", "url": "https://scad.edu", "time": "X days ago", "engagement": "N/A"}
    ]},
    {"key": "parsons", "name": "Parsons School of Design", "total_activities": 4, "items": [
      {"platform": "blog", "title": "title", "snippet": "description", "url": "https://newschool.edu", "time": "X days ago", "engagement": "N/A"}
    ]}
  ]
}

Replace ALL placeholder values with real data. All URLs must start with https://. Only include ${month} content.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
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

  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities');
  return report;
}
