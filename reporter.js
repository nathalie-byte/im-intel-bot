import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCHOOLS = [
  { key: 'mdc',     name: 'Miami Fashion Institute (MDC)',    fullName: 'Miami Fashion Institute at Miami Dade College' },
  { key: 'fit',     name: 'FIT',                              fullName: 'Fashion Institute of Technology FIT New York' },
  { key: 'scad',    name: 'SCAD',                             fullName: 'Savannah College of Art and Design SCAD' },
  { key: 'parsons', name: 'Parsons',                          fullName: 'Parsons School of Design New York' },
];

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating report for', today);

  const prompt = `You are a fashion industry competitive intelligence analyst for Istituto Marangoni Miami. Today is ${today}.

Search the web thoroughly and generate a competitive intelligence report tracking these schools:
1. Miami Fashion Institute at Miami Dade College (MDC)
2. Fashion Institute of Technology (FIT) New York
3. Savannah College of Art and Design (SCAD)
4. Parsons School of Design

For EACH school, find their most recent activity (last 7 days) across:
- Instagram posts (check their official accounts)
- LinkedIn posts and updates
- TikTok videos
- Press coverage / news articles
- Blog posts / editorial content
- Newsletter announcements
- New website pages or program announcements

ALSO generate a "Key Insights" section with:
- Which school had the MOST activity this week
- Any unusual or notable moves (new program launch, viral post, scholarship announcement, collaboration, event)
- Any direct competitive threats to Istituto Marangoni Miami (e.g. a school promoting fashion programs in Miami or targeting similar students)
- One recommended action for Istituto Marangoni Miami based on what competitors are doing

Return ONLY valid JSON, no markdown, no explanation, no code fences. Use this exact structure:

{
  "report_date": "${today}",
  "generated_at": "ISO timestamp",
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {
        "type": "new_program|viral_post|event|collaboration|threat|opportunity",
        "school": "school name",
        "headline": "short headline",
        "detail": "2-3 sentence explanation of why this matters for Istituto Marangoni Miami",
        "urgency": "high|medium|low"
      }
    ],
    "recommended_action": "One clear, specific action Istituto Marangoni Miami should take this week in response to competitor activity"
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
          "snippet": "1-2 sentence summary of the content and its significance",
          "url": "real URL or empty string",
          "time": "e.g. 2 days ago or April 9, 2025",
          "engagement": "e.g. 892 likes or N/A"
        }
      ]
    },
    { "key": "fit", "name": "FIT", "total_activities": 4, "items": [] },
    { "key": "scad", "name": "SCAD", "total_activities": 4, "items": [] },
    { "key": "parsons", "name": "Parsons", "total_activities": 4, "items": [] }
  ]
}

Platform values must be lowercase: instagram, linkedin, tiktok, press, blog, newsletter, website
Find 3-6 real, verifiable items per school. Use actual web search results.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: prompt }]
  });

  // Extract text from all content blocks
  let jsonText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  // Clean up any accidental markdown wrapping
  jsonText = jsonText.replace(/```json|```/g, '').trim();
  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in Claude response');
  jsonText = jsonText.slice(start, end + 1);

  const report = JSON.parse(jsonText);
  console.log(`[reporter] Report generated: ${report.schools?.reduce((a, s) => a + (s.items?.length || 0), 0)} total activities`);
  return report;
}
