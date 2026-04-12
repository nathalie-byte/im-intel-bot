const SCHOOL_CONFIG = {
  mdc:     { name: 'Miami Fashion Institute', short: 'MDC', accent: '#C0392B', light: '#FDF3F2', unsplash: 'fashion+miami+design' },
  fit:     { name: 'FIT New York',            short: 'FIT', accent: '#1A3A5C', light: '#EBF2FA', unsplash: 'fashion+new+york+runway' },
  scad:    { name: 'SCAD',                    short: 'SCAD',accent: '#1A4731', light: '#E8F5EE', unsplash: 'fashion+design+savannah' },
  parsons: { name: 'Parsons School of Design',short: 'PAR', accent: '#2C2C2C', light: '#F0F0F0', unsplash: 'parsons+fashion+design' },
};

const PLATFORM_CONFIG = {
  instagram:  { label: 'Instagram',  color: '#C13584' },
  linkedin:   { label: 'LinkedIn',   color: '#0A66C2' },
  tiktok:     { label: 'TikTok',     color: '#000000' },
  press:      { label: 'Press',      color: '#333333' },
  blog:       { label: 'Blog',       color: '#555555' },
  newsletter: { label: 'Newsletter', color: '#4A4A4A' },
  website:    { label: 'Website',    color: '#222222' },
};

const URGENCY_CONFIG = {
  high:   { label: 'HIGH PRIORITY', color: '#C0392B', bg: '#FDF3F2', border: '#C0392B' },
  medium: { label: 'WATCH',         color: '#D35400', bg: '#FDF6EC', border: '#D35400' },
  low:    { label: 'NOTE',          color: '#27AE60', bg: '#EAFAF1', border: '#27AE60' },
};

function coverPhotoGrid(schools) {
  const queries = [
    'fashion+editorial+student', 'fashion+design+school', 'runway+fashion+show',
    'fashion+styling+editorial', 'fashion+business+miami', 'design+student+workshop',
    'fashion+photography+editorial', 'fashion+collection+runway', 'textile+design+fashion',
    'fashion+show+backstage', 'fashion+week+street+style', 'luxury+fashion+editorial',
    'fashion+illustration+design', 'fashion+marketing+digital', 'fashion+accessories+editorial',
    'fashion+portfolio+design', 'fashion+trend+editorial', 'fashion+model+editorial'
  ];
  return queries.map((q, i) =>
    `<div style="background:#f0f0f0;overflow:hidden;aspect-ratio:1;">
      <img src="https://source.unsplash.com/200x200/?${q}&sig=${i}" 
           style="width:100%;height:100%;object-fit:cover;" 
           onerror="this.parentElement.style.background='#e0e0e0'" />
    </div>`
  ).join('');
}

function activityCard(item) {
  const p = PLATFORM_CONFIG[item.platform] || { color: '#555', label: item.platform };
  return `
  <div style="border:1px solid #e8e8e8;border-left:3px solid ${p.color};padding:18px;margin-bottom:12px;background:#fff;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${p.color};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${p.label}</span>
      <span style="font-size:10px;color:#aaa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${item.time || 'Recent'}</span>
    </div>
    <div style="font-size:13px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${item.title || ''}</div>
    <div style="font-size:12px;color:#666;line-height:1.7;margin-bottom:10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${item.snippet || ''}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:10px;color:#bbb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${item.engagement && item.engagement !== 'N/A' ? '↑ ' + item.engagement : ''}</span>
      ${item.url ? `<a href="${item.url}" style="font-size:10px;font-weight:700;color:${p.color};text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">VIEW →</a>` : ''}
    </div>
  </div>`;
}

function insightCard(h, index) {
  const u = URGENCY_CONFIG[h.urgency] || URGENCY_CONFIG.low;
  const num = String(index + 1).padStart(2, '0');
  return `
  <div style="display:flex;gap:16px;padding:20px;background:${u.bg};border-left:3px solid ${u.border};margin-bottom:10px;">
    <div style="font-size:28px;font-weight:700;color:${u.color};opacity:0.25;line-height:1;flex-shrink:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${num}</div>
    <div style="flex:1;">
      <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${u.color};margin-bottom:5px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${u.label} · ${h.school}</div>
      <div style="font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.3;margin-bottom:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${h.headline}</div>
      <div style="font-size:12px;color:#555;line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${h.detail}</div>
    </div>
  </div>`;
}

function bubbleChartData(schools) {
  return schools.map((school, i) => {
    const sc = SCHOOL_CONFIG[school.key] || { accent: '#999', short: school.key };
    const platforms = new Set((school.items || []).map(item => item.platform));
    return {
      key: school.key,
      name: sc.short,
      accent: sc.accent,
      activities: school.items?.length || 0,
      platforms: platforms.size,
      radius: Math.max(20, (school.items?.length || 0) * 8),
    };
  });
}

export function generateReportHTML(report) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);
  const weekNum = Math.ceil(new Date().getDate() / 7);
  const chartData = bubbleChartData(schools);

  const insightRows = (key_insights?.highlights || []).map((h, i) => insightCard(h, i)).join('');

  const schoolSections = schools.map(school => {
    const sc = SCHOOL_CONFIG[school.key] || { accent: '#333', light: '#f9f9f9', name: school.name, short: school.key.toUpperCase() };
    const items = school.items || [];
    const left = items.filter((_, i) => i % 2 === 0).map(activityCard).join('');
    const right = items.filter((_, i) => i % 2 === 1).map(activityCard).join('');
    const platformCounts = {};
    items.forEach(i => { platformCounts[i.platform] = (platformCounts[i.platform] || 0) + 1; });
    const topPlatforms = Object.entries(platformCounts).sort((a,b) => b[1]-a[1]).slice(0, 3);

    return `
    <div style="margin-bottom:56px;">
      <!-- School header bar -->
      <div style="background:#fff;border-top:4px solid ${sc.accent};border-bottom:1px solid #e8e8e8;padding:24px 0 20px;margin-bottom:24px;">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;">
          <div>
            <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Competitor Analysis</div>
            <div style="font-size:28px;font-weight:700;color:#1a1a1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${school.name}</div>
          </div>
          <div style="display:flex;gap:32px;text-align:right;">
            <div>
              <div style="font-size:32px;font-weight:700;color:${sc.accent};line-height:1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${items.length}</div>
              <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Activities</div>
            </div>
            <div>
              <div style="font-size:32px;font-weight:700;color:${sc.accent};line-height:1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${new Set(items.map(i=>i.platform)).size}</div>
              <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Platforms</div>
            </div>
            ${topPlatforms.length ? `<div>
              <div style="font-size:13px;font-weight:700;color:${sc.accent};line-height:1.4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${topPlatforms.map(p=>p[0].toUpperCase()).join(' · ')}</div>
              <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Top Channels</div>
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Two column activity cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>${left || '<p style="font-size:12px;color:#ccc;padding:12px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">No activity found.</p>'}</div>
        <div>${right}</div>
      </div>
    </div>`;
  }).join('');

  // Build bubble chart positions
  const bubblePositions = chartData.map((d, i) => {
    const positions = [
      { cx: 180, cy: 200 }, { cx: 420, cy: 150 },
      { cx: 580, cy: 220 }, { cx: 300, cy: 280 }
    ];
    const pos = positions[i] || { cx: 200 + i*120, cy: 200 };
    return { ...d, ...pos };
  });

  const bubbleSVG = `
  <svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <rect width="760" height="380" fill="#fff"/>
    <!-- Grid lines -->
    <line x1="60" y1="20" x2="60" y2="340" stroke="#f0f0f0" stroke-width="1"/>
    <line x1="60" y1="340" x2="740" y2="340" stroke="#f0f0f0" stroke-width="1"/>
    ${[1,2,3,4,5].map(i => `<line x1="60" y1="${340 - i*60}" x2="740" y2="${340 - i*60}" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>`).join('')}
    ${[1,2,3,4,5,6].map(i => `<line x1="${60 + i*110}" y1="20" x2="${60 + i*110}" y2="340" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>`).join('')}
    <!-- Axis labels -->
    <text x="400" y="370" text-anchor="middle" font-size="10" fill="#aaa" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" letter-spacing="1">ACTIVITY VOLUME</text>
    <text x="20" y="190" text-anchor="middle" font-size="10" fill="#aaa" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" transform="rotate(-90,20,190)" letter-spacing="1">PLATFORM REACH</text>
    <!-- Bubbles -->
    ${bubblePositions.map(d => `
      <circle cx="${d.cx}" cy="${d.cy}" r="${d.radius}" fill="${d.accent}" opacity="0.15"/>
      <circle cx="${d.cx}" cy="${d.cy}" r="${d.radius * 0.6}" fill="${d.accent}" opacity="0.4"/>
      <text x="${d.cx}" y="${d.cy - 4}" text-anchor="middle" font-size="11" font-weight="700" fill="${d.accent}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">${d.name}</text>
      <text x="${d.cx}" y="${d.cy + 10}" text-anchor="middle" font-size="9" fill="${d.accent}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">${d.activities} activities</text>
    `).join('')}
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IMM Intelligence Report · ${report_date}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      background: #fff; 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      -webkit-print-color-adjust: exact;
    }
    .page { max-width: 960px; margin: 0 auto; background: #fff; }
    .section { padding: 56px 64px; }
    .section-divider { border: none; border-top: 1px solid #e8e8e8; margin: 0 64px; }
    .section-label { font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #aaa; margin-bottom: 24px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) {
      .section { padding: 32px 24px; }
      .two-col { grid-template-columns: 1fr; }
      .cover-title { font-size: 36px !important; }
      .stat-row { flex-wrap: wrap; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- ═══════════════════════════════
       COVER PAGE
  ═══════════════════════════════ -->
  <div style="position:relative;overflow:hidden;">
    <!-- Photo grid background -->
    <div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(3,160px);gap:2px;">
      ${coverPhotoGrid(schools)}
    </div>
    <!-- White centered title box -->
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;border:1px solid #e8e8e8;padding:40px 52px;text-align:center;max-width:420px;width:90%;">
        <div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:16px;">IMM INTELLIGENCE REPORT</div>
        <div class="cover-title" style="font-size:44px;font-weight:700;color:#1a1a1a;line-height:1.05;letter-spacing:-1px;margin-bottom:8px;">Competitor<br>Briefing</div>
        <div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto;"></div>
        <div style="font-size:12px;color:#aaa;letter-spacing:1px;margin-bottom:4px;">${report_date}</div>
        <div style="font-size:11px;color:#ccc;">Istituto Marangoni Miami · Intelligence Unit</div>
      </div>
    </div>
  </div>

  <!-- School pills bar -->
  <div style="background:#1a1a1a;padding:12px 64px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
    <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C0392B;border:1px solid rgba(192,57,43,0.5);padding:4px 12px;">MDC</span>
    <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4A90D9;border:1px solid rgba(74,144,217,0.4);padding:4px 12px;">FIT</span>
    <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#27AE60;border:1px solid rgba(39,174,96,0.4);padding:4px 12px;">SCAD</span>
    <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;border:1px solid rgba(170,170,170,0.3);padding:4px 12px;">PARSONS</span>
    <span style="margin-left:auto;font-size:9px;color:#555;letter-spacing:1px;text-transform:uppercase;">IG · LinkedIn · TikTok · Press · Blog · Newsletter · Web</span>
  </div>

  <!-- ═══════════════════════════════
       EXECUTIVE SUMMARY
  ═══════════════════════════════ -->
  <div class="section">
    <div style="text-align:center;margin-bottom:40px;">
      <div class="section-label" style="text-align:center;">Executive Summary</div>
      <div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">This Week in Numbers</div>
      <div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>
    </div>

    <!-- Big stats row -->
    <div class="stat-row" style="display:flex;gap:0;border:1px solid #e8e8e8;margin-bottom:32px;">
      <div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;">
        <div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">${totalActivities}</div>
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Total Activities</div>
      </div>
      <div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;">
        <div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">4</div>
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Schools Tracked</div>
      </div>
      <div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;">
        <div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">7</div>
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Platforms Scanned</div>
      </div>
      <div style="flex:1;padding:28px 24px;text-align:center;">
        <div style="font-size:48px;font-weight:700;color:#C0392B;line-height:1;">${key_insights?.highlights?.length || 0}</div>
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Alerts This Week</div>
      </div>
    </div>

    <!-- Per school stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px;">
      ${schools.map(school => {
        const sc = SCHOOL_CONFIG[school.key] || { accent: '#333', short: school.key.toUpperCase() };
        return `
        <div style="border-top:3px solid ${sc.accent};padding:16px;background:#fafafa;">
          <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${sc.accent};margin-bottom:8px;">${sc.short}</div>
          <div style="font-size:28px;font-weight:700;color:#1a1a1a;line-height:1;">${school.items?.length || 0}</div>
          <div style="font-size:10px;color:#aaa;margin-top:4px;">activities</div>
        </div>`;
      }).join('')}
    </div>

    <!-- Bubble chart -->
    <div style="border:1px solid #e8e8e8;padding:24px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:16px;">Activity Volume vs Platform Reach — All Schools</div>
      ${bubbleSVG}
    </div>
  </div>

  <hr class="section-divider">

  <!-- ═══════════════════════════════
       KEY INSIGHTS
  ═══════════════════════════════ -->
  <div class="section">
    <div style="text-align:center;margin-bottom:40px;">
      <div class="section-label" style="text-align:center;">Key Insights</div>
      <div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">What the Data Tells Us</div>
      <div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>
    </div>

    <!-- Most active + recommended action -->
    <div class="two-col" style="margin-bottom:24px;">
      <div style="background:#1a1a1a;padding:28px 32px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:8px;">Most Active This Week</div>
        <div style="font-size:28px;font-weight:700;color:#fff;line-height:1.1;">${key_insights?.most_active_school || '—'}</div>
        <div style="font-size:13px;color:#555;margin-top:8px;">${key_insights?.most_active_count || 0} activities detected</div>
      </div>
      <div style="border:2px solid #1a1a1a;padding:28px 32px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:8px;">Recommended Action for IMM</div>
        <div style="font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.6;">${key_insights?.recommended_action || '—'}</div>
      </div>
    </div>

    <!-- Insight cards two-column -->
    <div class="two-col">
      <div>${(key_insights?.highlights || []).filter((_,i)=>i%2===0).map((h,i)=>insightCard(h,i*2)).join('')}</div>
      <div>${(key_insights?.highlights || []).filter((_,i)=>i%2===1).map((h,i)=>insightCard(h,i*2+1)).join('')}</div>
    </div>
  </div>

  <hr class="section-divider">

  <!-- ═══════════════════════════════
       FULL ACTIVITY LOG
  ═══════════════════════════════ -->
  <div class="section">
    <div style="text-align:center;margin-bottom:40px;">
      <div class="section-label" style="text-align:center;">Full Activity Log</div>
      <div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">All Platforms · All Schools</div>
      <div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>
    </div>
    ${schoolSections}
  </div>

  <!-- ═══════════════════════════════
       FOOTER
  ═══════════════════════════════ -->
  <div style="background:#1a1a1a;padding:28px 64px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.5px;">Istituto Marangoni Miami</div>
        <div style="font-size:10px;color:#555;margin-top:3px;letter-spacing:0.5px;">The Miami School of Fashion & Design · Intelligence Unit</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:9px;color:#444;letter-spacing:1px;text-transform:uppercase;">${report_date}</div>
        <div style="font-size:9px;color:#444;margin-top:3px;letter-spacing:0.5px;">Auto-generated · Confidential · Not for external distribution</div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}
