const SCHOOL_CONFIG = {
  mdc:     { name: 'Miami Fashion Institute', short: 'MDC', accent: '#C0392B', light: '#FDF3F2', dark: '#7B241C', unsplash: 'fashion+miami' },
  fit:     { name: 'FIT New York',            short: 'FIT', accent: '#1A3A5C', light: '#EBF2FA', dark: '#0D1F33', unsplash: 'fashion+new+york' },
  scad:    { name: 'SCAD',                    short: 'SCAD',accent: '#1A4731', light: '#E8F5EE', dark: '#0D2619', unsplash: 'fashion+design+school' },
  parsons: { name: 'Parsons School of Design',short: 'PAR', accent: '#2C2C2C', light: '#F0F0F0', dark: '#111111', unsplash: 'fashion+runway' },
};

const PLATFORM_CONFIG = {
  instagram:  { label: 'Instagram',  icon: '📸', color: '#C13584' },
  linkedin:   { label: 'LinkedIn',   icon: '💼', color: '#0A66C2' },
  tiktok:     { label: 'TikTok',     icon: '🎵', color: '#000000' },
  press:      { label: 'Press',      icon: '📰', color: '#333333' },
  blog:       { label: 'Blog',       icon: '✍️',  color: '#555555' },
  newsletter: { label: 'Newsletter', icon: '📧', color: '#4A4A4A' },
  website:    { label: 'Website',    icon: '🌐', color: '#222222' },
};

const URGENCY_CONFIG = {
  high:   { label: 'HIGH PRIORITY', color: '#C0392B', bg: '#FDF3F2' },
  medium: { label: 'WATCH',         color: '#D35400', bg: '#FDF6EC' },
  low:    { label: 'NOTE',          color: '#27AE60', bg: '#EAFAF1' },
};

function unsplashImg(query, w, h) {
  return `https://source.unsplash.com/${w}x${h}/?${query}&auto=format&fit=crop`;
}

function platformBadge(platform) {
  const p = PLATFORM_CONFIG[platform] || { label: platform, icon: '•', color: '#555' };
  return `<span style="display:inline-flex;align-items:center;gap:4px;background:#f5f5f3;color:${p.color};font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;border-radius:2px;font-family:'DM Sans',sans-serif;">${p.icon} ${p.label}</span>`;
}

function activityCard(item, schoolAccent) {
  const p = PLATFORM_CONFIG[item.platform] || { color: '#555' };
  const imgQuery = `fashion+${item.platform === 'instagram' ? 'editorial' : item.platform === 'tiktok' ? 'viral' : 'design'}`;
  return `
  <div style="background:#fff;border:1px solid #ebebeb;border-top:3px solid ${p.color};padding:20px;break-inside:avoid;margin-bottom:16px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      ${platformBadge(item.platform)}
      <span style="font-size:10px;color:#aaa;font-family:'DM Sans',sans-serif;">${item.time || 'Recent'}</span>
    </div>
    <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:8px;">${item.title || ''}</div>
    <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:#666;line-height:1.7;margin-bottom:12px;">${item.snippet || ''}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:11px;color:#bbb;font-family:'DM Sans',sans-serif;">${item.engagement && item.engagement !== 'N/A' ? '↑ ' + item.engagement : ''}</span>
      ${item.url ? `<a href="${item.url}" style="font-size:11px;font-weight:700;color:${p.color};text-decoration:none;letter-spacing:0.5px;font-family:'DM Sans',sans-serif;">VIEW →</a>` : ''}
    </div>
  </div>`;
}

function insightBlock(h, index) {
  const u = URGENCY_CONFIG[h.urgency] || URGENCY_CONFIG.low;
  const icons = ['01', '02', '03', '04', '05'];
  return `
  <div style="display:flex;gap:20px;padding:24px;background:${u.bg};border-left:4px solid ${u.color};margin-bottom:12px;">
    <div style="font-family:'Playfair Display',serif;font-size:32px;color:${u.color};opacity:0.3;font-weight:700;line-height:1;flex-shrink:0;">${icons[index] || '0' + (index+1)}</div>
    <div>
      <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${u.color};font-family:'DM Sans',sans-serif;margin-bottom:6px;">${u.label} · ${h.school}</div>
      <div style="font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1a1a1a;line-height:1.3;margin-bottom:8px;">${h.headline}</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:#555;line-height:1.7;">${h.detail}</div>
    </div>
  </div>`;
}

export function generateReportHTML(report) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);
  const weekNum = Math.ceil(new Date().getDate() / 7);

  const insightBlocks = (key_insights?.highlights || []).map((h, i) => insightBlock(h, i)).join('');

  const schoolSections = schools.map(school => {
    const sc = SCHOOL_CONFIG[school.key] || { accent: '#333', light: '#f9f9f9', dark: '#111', name: school.name, short: school.key.toUpperCase(), unsplash: 'fashion' };
    const cards = (school.items || []).map(item => activityCard(item, sc.accent)).join('');
    const platformCounts = {};
    (school.items || []).forEach(i => { platformCounts[i.platform] = (platformCounts[i.platform] || 0) + 1; });
    const topPlatform = Object.entries(platformCounts).sort((a,b)=>b[1]-a[1])[0];

    return `
    <!-- SCHOOL SECTION -->
    <section style="margin-bottom:60px;">
      <!-- School hero header -->
      <div style="background:${sc.accent};padding:40px 48px;position:relative;overflow:hidden;">
        <div style="position:absolute;right:0;top:0;bottom:0;width:200px;background:${sc.dark};opacity:0.4;clip-path:polygon(30% 0, 100% 0, 100% 100%, 0% 100%);"></div>
        <div style="position:relative;">
          <div style="font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:8px;">Competitor Analysis</div>
          <div style="font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:#fff;line-height:1;margin-bottom:4px;">${sc.name}</div>
          <div style="display:flex;gap:24px;margin-top:20px;">
            <div>
              <div style="font-family:'DM Sans',sans-serif;font-size:28px;font-weight:700;color:#fff;line-height:1;">${school.items?.length || 0}</div>
              <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);font-family:'DM Sans',sans-serif;">Activities</div>
            </div>
            ${topPlatform ? `<div>
              <div style="font-family:'DM Sans',sans-serif;font-size:28px;font-weight:700;color:#fff;line-height:1;">${topPlatform[0].toUpperCase()}</div>
              <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);font-family:'DM Sans',sans-serif;">Top Channel</div>
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Activity cards grid -->
      <div style="background:#fafaf8;padding:32px 48px;">
        <div style="columns:2;column-gap:20px;">
          ${cards || '<p style="font-family:\'DM Sans\',sans-serif;font-size:13px;color:#bbb;padding:20px 0;">No activity found this period.</p>'}
        </div>
      </div>
    </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IMM Intelligence Report · ${report_date}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f0efe9; font-family: 'DM Sans', sans-serif; -webkit-print-color-adjust: exact; }
    @media (max-width: 768px) {
      .two-col { columns: 1 !important; }
      .hero-grid { grid-template-columns: 1fr !important; }
      .stat-grid { grid-template-columns: 1fr 1fr !important; }
      .school-header { padding: 28px 24px !important; }
      .school-cards { padding: 24px !important; }
      .main-wrap { padding: 0 !important; }
    }
  </style>
</head>
<body>

<!-- OUTER WRAPPER -->
<div style="max-width:900px;margin:0 auto;background:#fff;">

  <!-- ═══════════════════════════════════════════
       COVER
  ═══════════════════════════════════════════ -->
  <div style="background:#111;padding:0;position:relative;overflow:hidden;min-height:320px;">
    <!-- Background texture lines -->
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.02) 60px,rgba(255,255,255,0.02) 61px);"></div>

    <div style="position:relative;padding:48px 56px 40px;">
      <!-- Top bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:20px;margin-bottom:36px;">
        <div style="font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Istituto Marangoni Miami · Intelligence Unit</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Week ${weekNum} · ${report_date}</div>
      </div>

      <!-- Main title -->
      <div style="font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:12px;">Competitive Intelligence</div>
      <div style="font-family:'Playfair Display',serif;font-size:56px;font-weight:900;color:#fff;line-height:0.95;letter-spacing:-1px;margin-bottom:8px;">Market<br><em style="color:rgba(255,255,255,0.4);">Briefing</em></div>

      <!-- Stats row -->
      <div style="display:flex;gap:40px;margin-top:36px;padding-top:28px;border-top:1px solid rgba(255,255,255,0.08);">
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:#fff;line-height:1;">${totalActivities}</div>
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;margin-top:4px;">Activities Tracked</div>
        </div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:#fff;line-height:1;">4</div>
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;margin-top:4px;">Schools Monitored</div>
        </div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:#fff;line-height:1;">7</div>
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;margin-top:4px;">Platforms Scanned</div>
        </div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:#fff;line-height:1;">${key_insights?.highlights?.length || 0}</div>
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;margin-top:4px;">Key Alerts</div>
        </div>
      </div>
    </div>

    <!-- School pills -->
    <div style="background:rgba(255,255,255,0.04);padding:14px 56px;display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.06);">
      <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C0392B;font-family:'DM Sans',sans-serif;padding:4px 12px;border:1px solid rgba(192,57,43,0.4);border-radius:2px;">MDC</span>
      <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4A90D9;font-family:'DM Sans',sans-serif;padding:4px 12px;border:1px solid rgba(74,144,217,0.4);border-radius:2px;">FIT</span>
      <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#27AE60;font-family:'DM Sans',sans-serif;padding:4px 12px;border:1px solid rgba(39,174,96,0.4);border-radius:2px;">SCAD</span>
      <span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:'DM Sans',sans-serif;padding:4px 12px;border:1px solid rgba(170,170,170,0.3);border-radius:2px;">PARSONS</span>
      <span style="margin-left:auto;font-size:9px;color:rgba(255,255,255,0.2);font-family:'DM Sans',sans-serif;padding:4px 0;letter-spacing:1px;text-transform:uppercase;">IG · LI · TT · Press · Blog · Newsletter · Web</span>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       KEY INSIGHTS
  ═══════════════════════════════════════════ -->
  <div style="padding:48px 56px;background:#fff;border-bottom:2px solid #111;">

    <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px;">
      <div style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#111;">Key Insights</div>
      <div style="flex:1;height:1px;background:#ebebeb;"></div>
      <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;font-family:'DM Sans',sans-serif;">${report_date}</div>
    </div>

    <!-- Most active callout -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      <div style="background:#111;padding:28px 32px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;margin-bottom:8px;">Most Active This Week</div>
        <div style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#fff;line-height:1.1;">${key_insights?.most_active_school || '—'}</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.4);margin-top:8px;">${key_insights?.most_active_count || 0} activities detected</div>
      </div>
      <div style="background:#f7f7f5;padding:28px 32px;border:1px solid #ebebeb;">
        <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;font-family:'DM Sans',sans-serif;margin-bottom:8px;">IMM Recommended Action</div>
        <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#111;line-height:1.5;">${key_insights?.recommended_action || '—'}</div>
      </div>
    </div>

    <!-- Insight cards -->
    ${insightBlocks}
  </div>

  <!-- ═══════════════════════════════════════════
       SCHOOL SECTIONS
  ═══════════════════════════════════════════ -->
  <div style="padding:0;">
    ${schoolSections}
  </div>

  <!-- ═══════════════════════════════════════════
       FOOTER
  ═══════════════════════════════════════════ -->
  <div style="background:#111;padding:32px 56px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#fff;">Istituto Marangoni Miami</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;letter-spacing:0.5px;">The Miami School of Fashion & Design · Intelligence Unit</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'DM Sans',sans-serif;font-size:9px;color:rgba(255,255,255,0.2);letter-spacing:1px;text-transform:uppercase;">Auto-generated · Confidential</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:9px;color:rgba(255,255,255,0.2);margin-top:4px;">${report_date}</div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}
