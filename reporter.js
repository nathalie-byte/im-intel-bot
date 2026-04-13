import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating report for', today);

  const prompt = `You are a fashion industry competitive intelligence analyst for Istituto Marangoni Miami. Today is ${today}.

Istituto Marangoni Miami offers these programs: Fashion Design, Fashion Business and Merchandising, Fashion Styling, Interior Design, and Beauty and Fragrances.

Search the web and find the most recent activity from the last 7 days from these competitor schools:
1. Miami Fashion Institute at Miami Dade College (MDC)
2. Fashion Institute of Technology FIT New York
3. Savannah College of Art and Design SCAD
4. Parsons School of Design New York

For each school search across: Instagram, LinkedIn, TikTok, press coverage, blog posts, newsletters, website updates.

For each activity found, note which program area it relates to: Fashion Design, Fashion Business, Fashion Styling, Interior Design, or Beauty and Fragrances.

Key Insights to include:
- Which school was most active this week
- Notable moves like new programs, viral posts, scholarships, collaborations, events
- Any competitive threats to IMM like schools targeting Miami students or launching similar programs
- One specific recommended action for IMM this week

Return ONLY valid JSON with no markdown and no code fences:

{
  "report_date": "${today}",
  "generated_at": "2026-04-13T00:00:00Z",
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {
        "type": "new_program",
        "school": "school name",
        "headline": "short headline",
        "detail": "2-3 sentences on why this matters for IMM",
        "urgency": "high"
      }
    ],
    "recommended_action": "One clear specific action IMM should take this week"
  },
  "schools": [
    {
      "key": "mdc",
      "name": "Miami Fashion Institute (MDC)",
      "total_activities": 4,
      "items": [
        {
          "platform": "instagram",
          "title": "Short descriptive headline",
          "snippet": "1-2 sentence summary and why it matters for IMM",
          "url": "",
          "time": "2 days ago",
          "engagement": "N/A"
        }
      ]
    },
    { "key": "fit", "name": "FIT New York", "total_activities": 4, "items": [] },
    { "key": "scad", "name": "SCAD", "total_activities": 4, "items": [] },
    { "key": "parsons", "name": "Parsons School of Design", "total_activities": 4, "items": [] }
  ]
}

Platform values: instagram, linkedin, tiktok, press, blog, newsletter, website
Find 4-6 real verifiable items per school. Use actual web search results.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
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
  console.log('[reporter] Done: ' + report.schools.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) + ' activities found');
  return report;
}
