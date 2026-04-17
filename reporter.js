import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating full competitive report for', today);

  const prompt = `Today is ${today}. You are a competitive intelligence analyst for Istituto Marangoni Miami (IMM).

Search the web for recent activity (last 7 days) from ALL FIVE schools including IMM itself:
1. Istituto Marangoni Miami (IMM) - Instagram: @istitutomarangoni_miami, Website: istitutomarangonimiami.com
2. Miami Fashion Institute MDC - Instagram: @miamifashioninstitute
3. FIT New York - Fashion Institute of Technology
4. SCAD - Savannah College of Art and Design
5. Parsons School of Design New York

For each school search: Instagram, LinkedIn, TikTok, press, blogs, newsletters, website updates.

YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO TEXT BEFORE OR AFTER. NO MARKDOWN. JUST RAW JSON.

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "birds_eye_view": {
    "summary": "2-3 sentence overview of what all schools are focusing on this week",
    "programming_overview": [
      {
        "school": "IMM",
        "focus": "main theme or campaign this week e.g. enrollment push, event, new program",
        "activity_count": 3
      },
      { "school": "MDC", "focus": "...", "activity_count": 3 },
      { "school": "FIT", "focus": "...", "activity_count": 3 },
      { "school": "SCAD", "focus": "...", "activity_count": 3 },
      { "school": "Parsons", "focus": "...", "activity_count": 3 }
    ]
  },
  "differentials": [
    {
      "metric": "e.g. Instagram Reels this week",
      "imm_value": "1 reel",
      "competitor": "SCAD",
      "competitor_value": "5 reels",
      "gap": "behind",
      "note": "short observation"
    }
  ],
  "opportunities": [
    {
      "opportunity": "Short action IMM could take",
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
        "headline": "headline here",
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
          "title": "title here",
          "snippet": "what IMM posted and its impact",
          "url": "https://full-url-here.com",
          "time": "2 days ago",
          "engagement": "N/A"
        }
      ]
    },
    {
      "key": "mdc",
      "name": "Miami Fashion Institute (MDC)",
      "total_activities": 3,
      "items": []
    },
    {
      "key": "fit",
      "name": "FIT New York",
      "total_activities": 3,
      "items": []
    },
    {
      "key": "scad",
      "name": "SCAD",
      "total_activities": 3,
      "items": []
    },
    {
      "key": "parsons",
      "name": "Parsons School of Design",
      "total_activities": 3,
      "items": []
    }
  ]
}

Rules:
- URLs must always start with https://
- Platform values: instagram, linkedin, tiktok, press, blog, newsletter, website
- Find 3-5 real items per school
- Be specific with numbers when comparing IMM to competitors
- Opportunities should be actionable and specific
- Return ONLY the JSON, nothing else`;

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

  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities found across 5 schools');
  return report;
}
