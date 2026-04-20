import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating report for', today);

  const prompt = `Today is ${today}. You are a competitive intelligence analyst for Istituto Marangoni Miami (IMM).

Search the web for recent activity this week from these 5 fashion schools:
1. Istituto Marangoni Miami IMM - @istitutomarangoni_miami
2. Miami Fashion Institute MDC
3. FIT New York Fashion Institute of Technology  
4. SCAD Savannah College of Art and Design
5. Parsons School of Design

Search Instagram, LinkedIn, TikTok, press, blogs, newsletters, websites. Only include 2026 content.

IMPORTANT: Your entire response must be a single JSON object. Start your response with { and end with }. Do not write any text outside the JSON.

Use this structure:

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "birds_eye_view": {
    "summary": "2-3 sentence overview of what all schools are doing this week",
    "programming_overview": [
      {"school": "IMM", "focus": "what IMM is promoting this week", "activity_count": 3},
      {"school": "MDC", "focus": "what MDC is promoting", "activity_count": 3},
      {"school": "FIT", "focus": "what FIT is promoting", "activity_count": 3},
      {"school": "SCAD", "focus": "what SCAD is promoting", "activity_count": 3},
      {"school": "Parsons", "focus": "what Parsons is promoting", "activity_count": 3}
    ]
  },
  "differentials": [
    {"metric": "metric name", "imm_value": "IMM value", "competitor": "school", "competitor_value": "their value", "gap": "behind", "note": "observation"}
  ],
  "opportunities": [
    {"opportunity": "action IMM could take", "based_on": "what competitor does well", "competitor": "school", "priority": "high"}
  ],
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {"type": "event", "school": "school", "headline": "headline", "detail": "detail", "urgency": "medium"}
    ],
    "recommended_action": "action for IMM this week"
  },
  "schools": [
    {
      "key": "imm",
      "name": "Istituto Marangoni Miami (IMM)",
      "total_activities": 3,
      "items": [
        {"platform": "instagram", "title": "post title", "snippet": "description", "url": "https://instagram.com/istitutomarangoni_miami", "time": "2 days ago", "engagement": "N/A"}
      ]
    },
    {"key": "mdc", "name": "Miami Fashion Institute (MDC)", "total_activities": 3, "items": [
      {"platform": "instagram", "title": "title", "snippet": "description", "url": "https://instagram.com", "time": "3 days ago", "engagement": "N/A"}
    ]},
    {"key": "fit", "name": "FIT New York", "total_activities": 3, "items": [
      {"platform": "instagram", "title": "title", "snippet": "description", "url": "https://fitnyc.edu", "time": "3 days ago", "engagement": "N/A"}
    ]},
    {"key": "scad", "name": "SCAD", "total_activities": 3, "items": [
      {"platform": "instagram", "title": "title", "snippet": "description", "url": "https://scad.edu", "time": "3 days ago", "engagement": "N/A"}
    ]},
    {"key": "parsons", "name": "Parsons School of Design", "total_activities": 3, "items": [
      {"platform": "instagram", "title": "title", "snippet": "description", "url": "https://newschool.edu", "time": "3 days ago", "engagement": "N/A"}
    ]}
  ]
}

Replace all placeholder values with real data from your web searches. Keep all URLs starting with https://`;

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

  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities');
  return report;
}
