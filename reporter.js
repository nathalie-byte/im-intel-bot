import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating program-level report for', today);

  const prompt = `You are a fashion industry competitive intelligence analyst for Istituto Marangoni Miami. Today is ${today}.

Istituto Marangoni Miami offers: Fashion Design, Fashion Business & Merchandising, Fashion Styling, Interior Design, and Beauty & Fragrances programs.

Search the web and find the most recent activity (last 7 days) from these competitor schools:
1. Miami Fashion Institute at Miami Dade College (MDC)
2. Fashion Institute of Technology (FIT) New York
3. Savannah College of Art and Design (SCAD)
4. Parsons School of Design

Search across ALL these platforms for each school:
Instagram, LinkedIn, TikTok, Press coverage, Blog posts, Newsletter, Website updates

For each activity found, tag which IMM program it relates to:
- fashion_design: garment construction, collections, runway, atelier, sketching
- fashion_business: merchandising, retail, marketing, branding, entrepreneurship, luxury management
- fashion_styling: editorial styling, creative direction, image consulting, trend forecasting, visual merchandising
- interior_design: spatial design, home design, architecture, decor, kitchen and bath
- beauty_fragrances: cosmetics, skincare, fragrance, wellness, beauty business
- general: school news, events, admissions, scholarships not specific to one program

Key Insights to include:
- Most active school this week
- Notable moves: new programs, viral content, scholarships, collaborations, events
- Competitive threats to IMM specifically (schools targeting Miami students or launching similar programs)
- Which program areas competitors are NOT covering (opportunity gaps for IMM)
- One specific recommended action for IMM this week

Return ONLY valid JSON with no markdown, no code fences:

{
  "report_date": "${today}",
  "generated_at": "ISO timestamp",
  "key_insights": {
    "most_active_school": "school name",
    "most_active_count": 5,
    "highlights": [
      {
        "type": "new_program|viral_post|event|collaboration|threat|opportunity|gap",
        "school": "school name",
        "program": "fashion_design|fashion_business|fashion_styling|interior_design|beauty_fragrances|general",
        "headline": "short punchy headline",
        "detail": "2-3 sentences on why this matters for IMM",
        "urgency": "high|medium|low"
      }
    ],
    "program_activity": {
      "fashion_design": "most active school in this area",
      "fashion_business": "most active school in this area",
      "fashion_styling": "most active school in this area",
      "interior_design": "most active school in this area",
      "beauty_fragrances": "most active school in this area or none detected"
    },
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
          "program": "fashion_design",
          "title": "Short descriptive headline",
          "snippet": "1-2 sentence summary and why it matters for IMM",
          "url": "real URL or empty string",
          "time": "e.g. 2 days ago",
          "engagement": "e.g. 892 likes or N/A"
        }
      ]
    },
    { "key": "fit",     "name": "FIT New York",             "total_activities": 4, "items": [] },
    { "key": "scad",    "name": "SCAD",                     "total_activities": 4, "items": [] },
    { "key": "parsons", "name": "Parsons School of Design", "total_activities": 4, "items": [] }
  ]
}

Platform values: instagram, linkedin, tiktok, press, blog, newsletter, website
Program values: fashion_design, fashion_business, fashion_styling, interior_design, beauty_fragrances, general
Find 4-6 real verifiable items per school.`;

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
  console.log(`[reporter] Done: ${report.schools?.reduce((a, s) => a + (s.items?.length || 0), 0)} activities found`);
  return report;
}
