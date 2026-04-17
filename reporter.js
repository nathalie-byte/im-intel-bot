import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating report for', today);

  const prompt = `Today is ${today}. You are tracking competitor fashion schools for Istituto Marangoni Miami.

Search the web for recent activity (last 7 days) from these schools:
1. Miami Fashion Institute MDC
2. FIT New York
3. SCAD
4. Parsons School of Design

Look across Instagram, LinkedIn, TikTok, press, blogs, newsletters, websites.

YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO TEXT BEFORE OR AFTER. NO MARKDOWN. NO EXPLANATION. JUST THE RAW JSON.

{
  "report_date": "${today}",
  "generated_at": "${new Date().toISOString()}",
  "key_insights": {
    "most_active_school": "school name here",
    "most_active_count": 4,
    "highlights": [
      {
        "type": "event",
        "school": "school name",
        "headline": "headline here",
        "detail": "detail here",
        "urgency": "medium"
      }
    ],
    "recommended_action": "action here"
  },
  "schools": [
    {
      "key": "mdc",
      "name": "Miami Fashion Institute (MDC)",
      "total_activities": 3,
      "items": [
        {
          "platform": "instagram",
          "title": "title here",
          "snippet": "snippet here",
          "url": "",
          "time": "2 days ago",
          "engagement": "N/A"
        }
      ]
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

Fill in real data from your web searches. Platform values: instagram, linkedin, tiktok, press, blog, newsletter, website. Return ONLY the JSON.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 6000,
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

  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities found');
  return report;
}
