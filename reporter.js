import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log('[reporter] Generating report for', today);

  const prompt = `Today is ${today}. Search the web for fashion school activity from the last 7 days in 2026 only.

Track these 5 schools:
1. Istituto Marangoni Miami IMM @istitutomarangoni_miami
2. Miami Fashion Institute MDC
3. FIT New York Fashion Institute of Technology
4. SCAD Savannah College of Art and Design
5. Parsons School of Design

Search Instagram, LinkedIn, TikTok, press, blogs, newsletters, websites.

Return a single valid JSON object with this exact structure. Replace all placeholder values with real data:

{"report_date":"${today}","generated_at":"${new Date().toISOString()}","instagram_breakdown":{"imm":{"posts":0,"reels":0,"stories":0,"total":0},"mdc":{"posts":0,"reels":0,"stories":0,"total":0},"fit":{"posts":0,"reels":0,"stories":0,"total":0},"scad":{"posts":0,"reels":0,"stories":0,"total":0},"parsons":{"posts":0,"reels":0,"stories":0,"total":0}},"birds_eye_view":{"summary":"Overview of what all schools are doing this week","programming_overview":[{"school":"IMM","focus":"main focus this week","activity_count":3},{"school":"MDC","focus":"main focus","activity_count":3},{"school":"FIT","focus":"main focus","activity_count":3},{"school":"SCAD","focus":"main focus","activity_count":3},{"school":"Parsons","focus":"main focus","activity_count":3}]},"differentials":[{"metric":"Instagram activity this week","imm_value":"X posts","competitor":"SCAD","competitor_value":"X posts","gap":"behind","note":"observation"}],"opportunities":[{"opportunity":"Specific action IMM could take","based_on":"What competitor does well","competitor":"FIT","priority":"high"}],"key_insights":{"most_active_school":"school name","most_active_count":5,"highlights":[{"type":"event","school":"school name","headline":"headline","detail":"why this matters for IMM","urgency":"medium"}],"recommended_action":"One action for IMM this week"},"schools":[{"key":"imm","name":"Istituto Marangoni Miami (IMM)","total_activities":3,"items":[{"platform":"instagram","title":"title","snippet":"description","url":"https://example.com","time":"2 days ago","engagement":"N/A"}]},{"key":"mdc","name":"Miami Fashion Institute (MDC)","total_activities":3,"items":[]},{"key":"fit","name":"FIT New York","total_activities":3,"items":[]},{"key":"scad","name":"SCAD","total_activities":3,"items":[]},{"key":"parsons","name":"Parsons School of Design","total_activities":3,"items":[]}]}

Important: Return ONLY the JSON. No text before or after. All URLs must start with https://. Only include 2026 content.`;

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
