import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const PLATFORM_STYLES = {
  instagram:  { label: 'Instagram',   color: '#C13584', bg: '#FDF0F7' },
  linkedin:   { label: 'LinkedIn',     color: '#0A66C2', bg: '#EEF5FC' },
  tiktok:     { label: 'TikTok',       color: '#000000', bg: '#F2F2F2' },
  press:      { label: 'Press',        color: '#1A1A1A', bg: '#F5F5F3' },
  blog:       { label: 'Blog',         color: '#555555', bg: '#F5F5F3' },
  newsletter: { label: 'Newsletter',   color: '#4A4A4A', bg: '#F0F0EE' },
  website:    { label: 'Website',      color: '#222222', bg: '#EBEBEB' },
};

const SCHOOL_STYLES = {
  mdc:     { label: 'MDC',  color: '#C0392B', initial: 'M' },
  fit:     { label: 'FIT',  color: '#1A3A5C', initial: 'F' },
  scad:    { label: 'SCAD', color: '#1A4731', initial: 'S' },
  parsons: { label: 'PAR',  color: '#2D2D2D', initial: 'P' },
};

const URGENCY_STYLES = {
  high:   { label: 'Priority', bar: '#C0392B', bg: '#FDF3F2' },
  medium: { label: 'Watch',    bar: '#E67E22', bg: '#FDF7F0' },
  low:    { label: 'Note',     bar: '#27AE60', bg: '#F2FAF5' },
};

function schoolCircle(key) {
  const s = SCHOOL_STYLES[key] || { initial: '?', color: '#999' };
  return `<div style="width:36px;height:36px;border-radius:50%;background:${s.color};display:inline-flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:14px;font-weight:700;color:#ffffff;">${s.initial}</div>`;
}

function platformBadge(platform) {
  const p = PLATFORM_STYLES[platform] || { label: platform, color: '#555', bg: '#eee' };
  return `<span style="display:inline-block;background:${p.bg};color:${p.color};font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;font-family:Georgia,serif;">${p.label}</span>`;
}

function activityCard(item) {
  const p = PLATFORM_STYLES[item.platform] || { color: '#555', bg: '#eee' };
  return `<tr><td style="padding:0 0 10px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e4;border-left:3px solid ${p.color};">
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>${platformBadge(item.platform)}</td>
          <td align="right" style="font-size:10px;color:#999;font-family:Georgia,serif;font-style:italic;">${item.time || 'Recent'}</td>
        </tr></table>
        <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin:8px 0 5px;font-family:Georgia,serif;line-height:1.4;">${item.title || ''}</div>
        <div style="font-size:12px;color:#666;line-height:1.65;margin-bottom:8px;font-family:Georgia,serif;">${item.snippet || ''}</div>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:10px;color:#bbb;font-family:Georgia,serif;">${item.engagement && item.engagement !== 'N/A' ? item.engagement : ''}</td>
          <td align="right">${item.url ? `<a href="${item.url}" style="font-size:10px;color:#1a1a1a;font-family:Georgia,serif;text-decoration:underline;">View →</a>` : ''}</td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>`;
}

function insightCard(h) {
  const u = URGENCY_STYLES[h.urgency] || URGENCY_STYLES.low;
  return `<tr><td style="padding:0 0 10px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${u.bg};border-left:3px solid ${u.bar};">
      <tr><td style="padding:14px 18px;">
        <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${u.bar};font-family:Georgia,serif;font-weight:700;margin-bottom:5px;">${u.label} · ${h.school}</div>
        <div style="font-size:14px;font-weight:700;color:#1a1a1a;font-family:Georgia,serif;margin-bottom:6px;line-height:1.3;">${h.headline}</div>
        <div style="font-size:12px;color:#555;font-family:Georgia,serif;line-height:1.65;">${h.detail}</div>
      </td></tr>
    </table>
  </td></tr>`;
}

function buildEmailHTML(report) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  const insightRows = (key_insights?.highlights || []).map(insightCard).join('');

  const schoolRows = schools.map(school => {
    const cards = (school.items || []).map(activityCard).join('');
    return `<tr><td style="padding:0 0 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:0 0 12px 0;border-bottom:2px solid #1a1a1a;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px;vertical-align:middle;">${schoolCircle(school.key)}</td>
            <td style="vertical-align:middle;">
              <div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#1a1a1a;">${school.name}</div>
              <div style="font-size:10px;color:#999;font-family:Georgia,serif;letter-spacing:0.5px;">${school.items?.length || 0} ACTIVITIES THIS WEEK</div>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-top:12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${cards || '<tr><td style="font-size:12px;color:#bbb;font-family:Georgia,serif;padding:12px 0;">No activity found this period.</td></tr>'}
          </table>
        </td></tr>
      </table>
    </td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0efe9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0efe9;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- MASTHEAD -->
  <tr><td style="background:#1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="height:4px;background:#ffffff;"></td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 36px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <div style="font-family:Georgia,serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#666;margin-bottom:10px;">Istituto Marangoni Miami · Intelligence Unit</div>
            <div style="font-family:Georgia,serif;font-size:28px;color:#ffffff;font-weight:400;line-height:1.15;letter-spacing:-0.5px;">Competitor<br><em>Intelligence Report</em></div>
          </td>
          <td align="right" valign="top">
            <div style="font-family:Georgia,serif;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#666;text-align:right;line-height:2.2;">${dayName}<br><span style="font-size:12px;color:#fff;letter-spacing:0;">${report_date}</span><br>${totalActivities} activities · 4 schools</div>
          </td>
        </tr></table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2e2e2e;">
      <tr>
        <td style="padding:10px 36px;">
          <span style="font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#C0392B;font-family:Georgia,serif;">MDC</span>
          <span style="color:#444;font-family:Georgia,serif;font-size:9px;padding:0 6px;">·</span>
          <span style="font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#1A3A5C;font-family:Georgia,serif;">FIT</span>
          <span style="color:#444;font-family:Georgia,serif;font-size:9px;padding:0 6px;">·</span>
          <span style="font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#1A4731;font-family:Georgia,serif;">SCAD</span>
          <span style="color:#444;font-family:Georgia,serif;font-size:9px;padding:0 6px;">·</span>
          <span style="font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#888;font-family:Georgia,serif;">PARSONS</span>
        </td>
        <td align="right" style="padding:10px 36px;">
          <span style="font-size:9px;color:#555;font-family:Georgia,serif;letter-spacing:0.5px;text-transform:uppercase;">IG · LI · TT · Press · Blog · NL · Web</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:36px 36px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0">

      <!-- KEY INSIGHTS -->
      <tr><td style="padding-bottom:32px;">
        <div style="font-family:Georgia,serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#999;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:16px;">Key Insights</div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;margin-bottom:14px;">
          <tr><td style="padding:16px 20px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:20px;">
                <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#666;font-family:Georgia,serif;margin-bottom:4px;">Most Active</div>
                <div style="font-size:20px;font-family:Georgia,serif;color:#ffffff;font-weight:700;">${key_insights?.most_active_school || '—'}</div>
              </td>
              <td style="border-left:1px solid #2e2e2e;padding-left:20px;">
                <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#666;font-family:Georgia,serif;margin-bottom:4px;">Activities</div>
                <div style="font-size:20px;font-family:Georgia,serif;color:#ffffff;font-weight:700;">${key_insights?.most_active_count || 0}</div>
              </td>
            </tr></table>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">${insightRows}</table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #1a1a1a;margin-top:4px;">
          <tr><td style="padding:18px 20px;">
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;font-family:Georgia,serif;font-weight:700;margin-bottom:8px;">Recommended Action for IMM</div>
            <div style="font-size:13px;color:#333;font-family:Georgia,serif;line-height:1.7;">${key_insights?.recommended_action || ''}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="border-top:2px solid #1a1a1a;padding-bottom:28px;"></td></tr>
      <tr><td style="padding-bottom:20px;">
        <div style="font-family:Georgia,serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#999;">Full Activity Log</div>
      </td></tr>

      <!-- SCHOOLS -->
      ${schoolRows}

      <!-- FOOTER -->
      <tr><td style="border-top:2px solid #1a1a1a;padding:20px 0 8px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <div style="font-family:Georgia,serif;font-size:11px;color:#1a1a1a;font-weight:700;">Istituto Marangoni Miami</div>
            <div style="font-family:Georgia,serif;font-size:10px;color:#999;font-style:italic;">The Miami School of Fashion & Design</div>
          </td>
          <td align="right">
            <div style="font-size:9px;color:#bbb;font-family:Georgia,serif;letter-spacing:0.5px;">Auto-generated · Confidential</div>
          </td>
        </tr></table>
      </td></tr>

    </table>
  </td></tr>

  <tr><td style="background:#1a1a1a;height:4px;"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendEmail(report) {
  const recipients = (process.env.RECIPIENT_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
  if (!recipients.length) throw new Error('No RECIPIENT_EMAILS configured');

  const html = buildEmailHTML(report);
  const subject = `Intelligence Report · ${report.report_date} · ${report.key_insights?.most_active_school || ''} leads`;

  const msg = {
    to: recipients,
    from: { email: process.env.FROM_EMAIL || 'nathalie@tessier.biz', name: 'IMM Intelligence' },
    subject,
    html,
    text: `Competitor Intelligence · ${report.report_date}\n\nMost active: ${report.key_insights?.most_active_school}\n\nAction: ${report.key_insights?.recommended_action}`,
  };

  await sgMail.sendMultiple(msg);
  console.log(`[mailer] Sent to ${recipients.join(', ')}`);
}
