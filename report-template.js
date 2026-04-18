const SCHOOL_CONFIG = {
  mdc:     { name: 'Miami Fashion Institute', short: 'MDC', accent: '#C0392B', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Miami_Dade_College_logo.svg/320px-Miami_Dade_College_logo.svg.png' },
  fit:     { name: 'FIT New York',            short: 'FIT', accent: '#1A3A5C', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/FIT_NYC_logo.svg/320px-FIT_NYC_logo.svg.png' },
  scad:    { name: 'SCAD',                    short: 'SCAD',accent: '#1A4731', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/SCAD_logo.svg/320px-SCAD_logo.svg.png' },
  imm:     { name: 'Istituto Marangoni Miami', short: 'IMM', accent: '#000000', logo: 'https://www.istitutomarangonimiami.com/wp-content/uploads/2024/05/IMM-Logo.png' },
  parsons: { name: 'Parsons School of Design',short: 'PAR', accent: '#2C2C2C', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/New_School_logo.svg/320px-New_School_logo.svg.png' },
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

const PROGRAM_CONFIG = {
  fashion_design:    { label: 'Fashion Design',        color: '#8B1A1A', bg: '#FDF0F0' },
  fashion_business:  { label: 'Fashion Business',      color: '#1A3A6B', bg: '#EEF3FB' },
  fashion_styling:   { label: 'Fashion Styling',       color: '#6B3A1A', bg: '#FDF5EE' },
  interior_design:   { label: 'Interior Design',       color: '#1A4A2E', bg: '#EEF8F2' },
  beauty_fragrances: { label: 'Beauty & Fragrances',   color: '#6B1A5A', bg: '#FAF0F8' },
  general:           { label: 'General',               color: '#555555', bg: '#F5F5F5' },
};

const URGENCY_CONFIG = {
  high:   { label: 'HIGH PRIORITY', color: '#C0392B', bg: '#FDF3F2', border: '#C0392B' },
  medium: { label: 'WATCH',         color: '#D35400', bg: '#FDF6EC', border: '#D35400' },
  low:    { label: 'NOTE',          color: '#27AE60', bg: '#EAFAF1', border: '#27AE60' },
};

function coverPhotoGrid() {
  const photos = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop',
  ];
  return photos.map(url =>
    '<div style="background:#f0f0f0;overflow:hidden;aspect-ratio:1;">' +
    '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.background=\'#e8e8e8\'" />' +
    '</div>'
  ).join('');
}

function activityCard(item) {
  const p = PLATFORM_CONFIG[item.platform] || { color: '#555', label: item.platform };
  const prog = PROGRAM_CONFIG[item.program] || PROGRAM_CONFIG.general;
  return '<div style="border:1px solid #e8e8e8;border-left:3px solid ' + p.color + ';padding:18px;margin-bottom:12px;background:#fff;">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
        '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:' + p.color + ';font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + p.label + '</span>' +
        '<span style="font-size:8px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;background:' + prog.bg + ';color:' + prog.color + ';padding:2px 7px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + prog.label + '</span>' +
      '</div>' +
      '<span style="font-size:10px;color:#aaa;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;flex-shrink:0;margin-left:8px;">' + (item.time || 'Recent') + '</span>' +
    '</div>' +
    '<div style="font-size:13px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:6px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + (item.title || '') + '</div>' +
    '<div style="font-size:12px;color:#666;line-height:1.7;margin-bottom:10px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + (item.snippet || '') + '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<span style="font-size:10px;color:#bbb;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + (item.engagement && item.engagement !== 'N/A' ? '↑ ' + item.engagement : '') + '</span>' +
      (item.url ? '<a href="' + item.url + '" style="font-size:10px;font-weight:700;color:' + p.color + ';text-decoration:none;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">VIEW →</a>' : '') +
    '</div>' +
  '</div>';
}

function insightCard(h, index) {
  const u = URGENCY_CONFIG[h.urgency] || URGENCY_CONFIG.low;
  const num = String(index + 1).padStart(2, '0');
  return '<div style="display:flex;gap:16px;padding:20px;background:' + u.bg + ';border-left:3px solid ' + u.border + ';margin-bottom:10px;">' +
    '<div style="font-size:28px;font-weight:700;color:' + u.color + ';opacity:0.25;line-height:1;flex-shrink:0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + num + '</div>' +
    '<div style="flex:1;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + u.color + ';margin-bottom:5px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + u.label + ' · ' + h.school + '</div>' +
      '<div style="font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.3;margin-bottom:6px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + h.headline + '</div>' +
      '<div style="font-size:12px;color:#555;line-height:1.7;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + h.detail + '</div>' +
    '</div>' +
  '</div>';
}

function programActivityGrid(program_activity) {
  if (!program_activity) return '';
  const programs = ['fashion_design', 'fashion_business', 'fashion_styling', 'interior_design', 'beauty_fragrances'];
  const cards = programs.map(key => {
    const pc = PROGRAM_CONFIG[key] || PROGRAM_CONFIG.general;
    const school = program_activity[key] || '—';
    return '<div style="border-top:2px solid ' + pc.color + ';padding:14px 12px;background:' + pc.bg + ';">' +
      '<div style="font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + pc.color + ';margin-bottom:6px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + pc.label + '</div>' +
      '<div style="font-size:11px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + school + '</div>' +
    '</div>';
  }).join('');
  return '<div style="margin-bottom:28px;">' +
    '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:14px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;border-bottom:1px solid #e8e8e8;padding-bottom:8px;">Most Active by Program This Week</div>' +
    '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">' + cards + '</div>' +
  '</div>';
}

function bubbleSVG(schools) {
  const positions = [
    { cx: 180, cy: 200 }, { cx: 420, cy: 150 },
    { cx: 560, cy: 230 }, { cx: 320, cy: 280 }
  ];
  const bubbles = schools.map((school, i) => {
    const sc = SCHOOL_CONFIG[school.key] || { accent: '#999', short: school.key };
    const pos = positions[i] || { cx: 200 + i * 120, cy: 200 };
    const count = school.items?.length || 0;
    const platforms = new Set((school.items || []).map(item => item.platform)).size;
    const r = Math.max(24, count * 8);
    return '<circle cx="' + pos.cx + '" cy="' + pos.cy + '" r="' + r + '" fill="' + sc.accent + '" opacity="0.12"/>' +
      '<circle cx="' + pos.cx + '" cy="' + pos.cy + '" r="' + (r * 0.55) + '" fill="' + sc.accent + '" opacity="0.35"/>' +
      '<text x="' + pos.cx + '" y="' + (pos.cy - 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + sc.accent + '" font-family="Helvetica Neue,Helvetica,Arial,sans-serif">' + sc.short + '</text>' +
      '<text x="' + pos.cx + '" y="' + (pos.cy + 11) + '" text-anchor="middle" font-size="9" fill="' + sc.accent + '" font-family="Helvetica Neue,Helvetica,Arial,sans-serif">' + count + ' activities</text>';
  }).join('');

  return '<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">' +
    '<rect width="760" height="380" fill="#fff"/>' +
    '<line x1="60" y1="20" x2="60" y2="340" stroke="#f0f0f0" stroke-width="1"/>' +
    '<line x1="60" y1="340" x2="740" y2="340" stroke="#f0f0f0" stroke-width="1"/>' +
    '<line x1="60" y1="280" x2="740" y2="280" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>' +
    '<line x1="60" y1="220" x2="740" y2="220" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>' +
    '<line x1="60" y1="160" x2="740" y2="160" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>' +
    '<line x1="60" y1="100" x2="740" y2="100" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4,4"/>' +
    '<text x="400" y="370" text-anchor="middle" font-size="10" fill="#aaa" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" letter-spacing="1">ACTIVITY VOLUME</text>' +
    '<text x="20" y="190" text-anchor="middle" font-size="10" fill="#aaa" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" transform="rotate(-90,20,190)" letter-spacing="1">PLATFORM REACH</text>' +
    bubbles +
  '</svg>';
}

export function generateReportHTML(report) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);

  const insightCardsLeft = (key_insights?.highlights || []).filter((_, i) => i % 2 === 0).map((h, i) => insightCard(h, i * 2)).join('');
  const insightCardsRight = (key_insights?.highlights || []).filter((_, i) => i % 2 === 1).map((h, i) => insightCard(h, i * 2 + 1)).join('');

  const schoolSections = schools.map(school => {
    const sc = SCHOOL_CONFIG[school.key] || { accent: '#333', name: school.name, short: school.key.toUpperCase(), logo: '' };
    const items = school.items || [];
    const leftCards = items.filter((_, i) => i % 2 === 0).map(activityCard).join('');
    const rightCards = items.filter((_, i) => i % 2 === 1).map(activityCard).join('');
    const platformCounts = {};
    items.forEach(item => { platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1; });
    const topPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(p => p[0].toUpperCase()).join(' · ');

    return '<div style="margin-bottom:56px;">' +
      '<div style="background:#fff;border-top:4px solid ' + sc.accent + ';border-bottom:1px solid #e8e8e8;padding:24px 0 20px;margin-bottom:24px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<div style="display:flex;align-items:center;gap:16px;">' +
            (sc.logo ? '<img src="' + sc.logo + '" style="height:40px;width:auto;object-fit:contain;opacity:0.85;" onerror="this.style.display=\'none\'" />' : '') +
            '<div>' +
              '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:4px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">Competitor Analysis</div>' +
              '<div style="font-size:26px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + school.name + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:28px;text-align:right;">' +
            '<div><div style="font-size:32px;font-weight:700;color:' + sc.accent + ';line-height:1;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + items.length + '</div><div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">Activities</div></div>' +
            '<div><div style="font-size:32px;font-weight:700;color:' + sc.accent + ';line-height:1;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + new Set(items.map(i => i.platform)).size + '</div><div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">Platforms</div></div>' +
            (topPlatforms ? '<div><div style="font-size:12px;font-weight:700;color:' + sc.accent + ';line-height:1.5;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">' + topPlatforms + '</div><div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">Top Channels</div></div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
        '<div>' + (leftCards || '<p style="font-size:12px;color:#ccc;padding:12px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">No activity found.</p>') + '</div>' +
        '<div>' + rightCards + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>IMM Intelligence Report · ' + report_date + '</title>\n' +
  '<style>* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #fff; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #1a1a1a; } .page { max-width: 960px; margin: 0 auto; } .section { padding: 56px 64px; } @media (max-width: 768px) { .section { padding: 32px 24px; } .two-col { grid-template-columns: 1fr !important; } .stat-row { flex-wrap: wrap; } .prog-grid { grid-template-columns: 1fr 1fr !important; } }</style>\n' +
  '</head>\n<body>\n<div class="page">\n\n' +

  '<!-- COVER -->\n' +
  '<div style="position:relative;overflow:hidden;">' +
    '<div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,180px);gap:2px;">' + coverPhotoGrid() + '</div>' +
    '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">' +
      '<div style="background:#fff;border:1px solid #e8e8e8;padding:40px 52px;text-align:center;max-width:420px;width:90%;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:16px;">IMM INTELLIGENCE REPORT</div>' +
        '<div style="font-size:44px;font-weight:700;color:#1a1a1a;line-height:1.05;letter-spacing:-1px;margin-bottom:8px;">Competitor<br>Briefing</div>' +
        '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto;"></div>' +
        '<div style="font-size:12px;color:#aaa;letter-spacing:1px;margin-bottom:4px;">' + report_date + '</div>' +
        '<div style="font-size:11px;color:#ccc;">Istituto Marangoni Miami · Intelligence Unit</div>' +
        '<div style="margin-top:16px;padding-top:16px;border-top:1px solid #e8e8e8;">' +
          '<div style="font-size:18px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;letter-spacing:-0.3px;">Report created and published by Nathalie Tessier</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div style="background:#1a1a1a;padding:12px 64px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
    '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C0392B;border:1px solid rgba(192,57,43,0.5);padding:4px 12px;">MDC</span>' +
    '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4A90D9;border:1px solid rgba(74,144,217,0.4);padding:4px 12px;">FIT</span>' +
    '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#27AE60;border:1px solid rgba(39,174,96,0.4);padding:4px 12px;">SCAD</span>' +
    '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;border:1px solid rgba(170,170,170,0.3);padding:4px 12px;">PARSONS</span>' +
    '<span style="margin-left:auto;font-size:9px;color:#555;letter-spacing:1px;text-transform:uppercase;">IG · LinkedIn · TikTok · Press · Blog · Newsletter · Web</span>' +
  '</div>' +

  '<!-- INSTAGRAM BREAKDOWN -->\n' +
  '<div class="section" style="background:#fff;">' +
    '<div style="text-align:center;margin-bottom:32px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">This Week on Instagram</div>' +
      '<div style="font-size:32px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">Posts · Reels · Stories</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +
    (report.instagram_breakdown ? (
      '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
        '<tr style="border-bottom:2px solid #1a1a1a;">' +
          '<th style="text-align:left;padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;font-family:\'Helvetica Neue\',sans-serif;">School</th>' +
          '<th style="text-align:center;padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C13584;font-family:\'Helvetica Neue\',sans-serif;">Posts</th>' +
          '<th style="text-align:center;padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C13584;font-family:\'Helvetica Neue\',sans-serif;">Reels</th>' +
          '<th style="text-align:center;padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C13584;font-family:\'Helvetica Neue\',sans-serif;">Stories</th>' +
          '<th style="text-align:center;padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;font-family:\'Helvetica Neue\',sans-serif;">Total</th>' +
        '</tr>' +
        Object.entries(report.instagram_breakdown).map(([key, data]) => {
          const sc = SCHOOL_CONFIG[key] || { accent: '#333', name: key.toUpperCase() };
          const isIMM = key === 'imm';
          const bg = isIMM ? '#f5f3ee' : '#fff';
          return '<tr style="border-bottom:1px solid #e8e8e8;background:' + bg + ';">' +
            '<td style="padding:14px 16px;font-size:13px;font-weight:' + (isIMM ? '700' : '400') + ';color:' + sc.accent + ';font-family:\'Helvetica Neue\',sans-serif;">' + (isIMM ? '★ ' : '') + sc.name + '</td>' +
            '<td style="text-align:center;padding:14px 16px;font-size:16px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',sans-serif;">' + (data.posts || 0) + '</td>' +
            '<td style="text-align:center;padding:14px 16px;font-size:16px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',sans-serif;">' + (data.reels || 0) + '</td>' +
            '<td style="text-align:center;padding:14px 16px;font-size:16px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',sans-serif;">' + (data.stories || 0) + '</td>' +
            '<td style="text-align:center;padding:14px 16px;font-size:20px;font-weight:700;color:' + sc.accent + ';font-family:\'Helvetica Neue\',sans-serif;">' + (data.total || 0) + '</td>' +
          '</tr>';
        }).join('') +
      '</table>'
    ) : '<p style="color:#aaa;font-size:13px;">No Instagram data available.</p>') +
  '</div>' +

  '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 64px;">' +

  '<!-- BIRDS EYE VIEW -->\n' +
  '<div class="section" style="background:#f5f3ee;">' +
    '<div style="text-align:center;margin-bottom:32px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Birds Eye View</div>' +
      '<div style="font-size:32px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">All Schools This Week</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +
    (report.birds_eye_view ? (
      '<div style="font-size:14px;color:#555;line-height:1.8;margin-bottom:28px;font-style:italic;">' + (report.birds_eye_view.summary || '') + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">' +
      (report.birds_eye_view.programming_overview || []).map(p => {
        const sc = Object.values(SCHOOL_CONFIG).find(s => s.short === p.school) || { accent: '#333', short: p.school };
        return '<div style="border-top:3px solid ' + sc.accent + ';padding:16px;background:#fff;">' +
          '<div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + sc.accent + ';margin-bottom:8px;">' + p.school + '</div>' +
          '<div style="font-size:12px;color:#333;line-height:1.6;margin-bottom:8px;">' + (p.focus || '') + '</div>' +
          '<div style="font-size:20px;font-weight:700;color:' + sc.accent + ';">' + (p.activity_count || 0) + '</div>' +
          '<div style="font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">activities</div>' +
        '</div>';
      }).join('') +
      '</div>'
    ) : '') +
  '</div>' +

  '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 64px;">' +

  '<!-- DIFFERENTIALS -->\n' +
  '<div class="section">' +
    '<div style="text-align:center;margin-bottom:32px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">IMM vs Competitors</div>' +
      '<div style="font-size:32px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">Differentials & Gaps</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px;">' +
    (report.differentials || []).map(d => {
      const isAhead = d.gap === 'ahead';
      const color = isAhead ? '#27AE60' : '#C0392B';
      const bg = isAhead ? '#EAFAF1' : '#FDF3F2';
      return '<div style="border-left:3px solid ' + color + ';padding:16px 20px;background:' + bg + ';">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + color + ';margin-bottom:8px;">' + (isAhead ? '▲ IMM AHEAD' : '▼ IMM BEHIND') + ' · vs ' + d.competitor + '</div>' +
        '<div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:6px;">' + (d.metric || '') + '</div>' +
        '<div style="display:flex;gap:16px;margin-bottom:8px;">' +
          '<div style="font-size:12px;color:#333;"><strong>IMM:</strong> ' + (d.imm_value || '') + '</div>' +
          '<div style="font-size:12px;color:#555;"><strong>' + d.competitor + ':</strong> ' + (d.competitor_value || '') + '</div>' +
        '</div>' +
        '<div style="font-size:11px;color:#666;">' + (d.note || '') + '</div>' +
      '</div>';
    }).join('') +
    '</div>' +

    '<div style="text-align:center;margin-bottom:32px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Based on Competitor Activity</div>' +
      '<div style="font-size:32px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">Opportunities for IMM</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
    (report.opportunities || []).map((o, i) => {
      const num = String(i + 1).padStart(2, '0');
      const priorityColor = o.priority === 'high' ? '#C0392B' : o.priority === 'medium' ? '#D35400' : '#27AE60';
      return '<div style="border:1px solid #e8e8e8;border-top:3px solid ' + priorityColor + ';padding:20px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
          '<span style="font-size:24px;font-weight:700;color:#e8e8e8;">' + num + '</span>' +
          '<span style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + priorityColor + ';background:#fff;padding:2px 8px;border:1px solid ' + priorityColor + ';">' + (o.priority || 'medium').toUpperCase() + '</span>' +
        '</div>' +
        '<div style="font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:8px;">' + (o.opportunity || '') + '</div>' +
        '<div style="font-size:12px;color:#666;line-height:1.6;"><strong>' + o.competitor + ':</strong> ' + (o.based_on || '') + '</div>' +
      '</div>';
    }).join('') +
    '</div>' +
  '</div>' +

  '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 64px;">' +

  '<!-- EXECUTIVE SUMMARY -->\n' +
  '<div class="section">' +
    '<div style="text-align:center;margin-bottom:40px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Executive Summary</div>' +
      '<div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">This Week in Numbers</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +

    '<div class="stat-row" style="display:flex;gap:0;border:1px solid #e8e8e8;margin-bottom:32px;">' +
      '<div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;"><div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">' + totalActivities + '</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Total Activities</div></div>' +
      '<div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;"><div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">4</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Schools Tracked</div></div>' +
      '<div style="flex:1;padding:28px 24px;border-right:1px solid #e8e8e8;text-align:center;"><div style="font-size:48px;font-weight:700;color:#1a1a1a;line-height:1;">7</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Platforms Scanned</div></div>' +
      '<div style="flex:1;padding:28px 24px;text-align:center;"><div style="font-size:48px;font-weight:700;color:#C0392B;line-height:1;">' + (key_insights?.highlights?.length || 0) + '</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-top:6px;">Alerts This Week</div></div>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px;">' +
    schools.map(school => {
      const sc = SCHOOL_CONFIG[school.key] || { accent: '#333', short: school.key.toUpperCase() };
      return '<div style="border-top:3px solid ' + sc.accent + ';padding:16px;background:#fafafa;"><div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + sc.accent + ';margin-bottom:8px;">' + sc.short + '</div><div style="font-size:28px;font-weight:700;color:#1a1a1a;line-height:1;">' + (school.items?.length || 0) + '</div><div style="font-size:10px;color:#aaa;margin-top:4px;">activities</div></div>';
    }).join('') +
    '</div>' +

    '<div style="border:1px solid #e8e8e8;padding:24px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:16px;">Activity Volume vs Platform Reach</div>' +
      bubbleSVG(schools) +
    '</div>' +
  '</div>' +

  '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 64px;">' +

  '<!-- KEY INSIGHTS -->\n' +
  '<div class="section">' +
    '<div style="text-align:center;margin-bottom:40px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Key Insights</div>' +
      '<div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">What the Data Tells Us</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">' +
      '<div style="background:#1a1a1a;padding:28px 32px;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:8px;">Most Active This Week</div>' +
        '<div style="font-size:28px;font-weight:700;color:#fff;line-height:1.1;">' + (key_insights?.most_active_school || '—') + '</div>' +
        '<div style="font-size:13px;color:#555;margin-top:8px;">' + (key_insights?.most_active_count || 0) + ' activities detected</div>' +
      '</div>' +
      '<div style="border:2px solid #1a1a1a;padding:28px 32px;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:8px;">Recommended Action for IMM</div>' +
        '<div style="font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.6;">' + (key_insights?.recommended_action || '—') + '</div>' +
      '</div>' +
    '</div>' +

    programActivityGrid(key_insights?.program_activity) +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
      '<div>' + insightCardsLeft + '</div>' +
      '<div>' + insightCardsRight + '</div>' +
    '</div>' +
  '</div>' +

  '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 64px;">' +

  '<!-- ACTIVITY LOG -->\n' +
  '<div class="section">' +
    '<div style="text-align:center;margin-bottom:40px;">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Full Activity Log</div>' +
      '<div style="font-size:36px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">All Platforms · All Schools</div>' +
      '<div style="width:40px;height:2px;background:#1a1a1a;margin:16px auto 0;"></div>' +
    '</div>' +
    schoolSections +
  '</div>' +

  '<div style="background:#1a1a1a;padding:28px 64px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<div><div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.5px;">Istituto Marangoni Miami</div><div style="font-size:10px;color:#555;margin-top:3px;letter-spacing:0.5px;">The Miami School of Fashion & Design · Intelligence Unit</div></div>' +
      '<div style="text-align:right;"><div style="font-size:9px;color:#444;letter-spacing:1px;text-transform:uppercase;">' + report_date + '</div><div style="font-size:9px;color:#444;margin-top:3px;">Auto-generated · Confidential</div></div>' +
    '</div>' +
  '</div>' +

  '<div style="background:#f5f5f3;padding:16px 64px;border-top:1px solid #e8e8e8;">' +
    '<div style="font-size:18px;font-weight:700;color:#1a1a1a;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;letter-spacing:-0.3px;">Report created and published by Nathalie Tessier</div>' +
  '</div>' +

  '\n</div>\n</body>\n</html>';
}
