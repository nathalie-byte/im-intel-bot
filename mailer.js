import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const PLATFORM_COLORS = {
  instagram:  { color: '#E4405F', bg: '#FFF0F3', label: 'Instagram' },
  linkedin:   { color: '#0A66C2', bg: '#EFF6FF', label: 'LinkedIn' },
  tiktok:     { color: '#333333', bg: '#F5F5F5', label: 'TikTok' },
  press:      { color: '#0284C7', bg: '#F0F9FF', label: 'Press' },
  blog:       { color: '#EA580C', bg: '#FFF7ED', label: 'Blog' },
  newsletter: { color: '#7C3AED', bg: '#F5F3FF', label: 'Newsletter' },
  website:    { color: '#16A34A', bg: '#F0FDF4', label: 'Website' },
};

const SCHOOL_COLORS = {
  mdc:     { accent: '#D97706', light: '#FFFBEB' },
  fit:     { accent: '#2563EB', light: '#EFF6FF' },
  scad:    { accent: '#059669', light: '#ECFDF5' },
  parsons: { accent: '#7C3AED', light: '#F5F3FF' },
};

const URGENCY_STYLES = {
  high:   { color: '#DC2626', bg: '#FEF2F2', label: '🔴 High Priority' },
  medium: { color: '#D97706', bg: '#FFFBEB', label: '🟡 Watch' },
  low:    { color: '#16A34A', bg: '#F0FDF4', label: '🟢 FYI' },
};

function buildEmailHTML(report) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);

  const insightCards = (key_insights.highlights || []).map(h => {
    const urgency = URGENCY_STYLES[h.urgency] || URGENCY_STYLES.low;
    return `
      <tr>
        <td style="padding: 0 0 12px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${urgency.bg}; border-radius:10px; border-left: 4px solid ${urgency.color};">
            <tr>
              <td style="padding: 16px 20px;">
                <div style="font-size:11px; font-weight:600; color:${urgency.color}; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${urgency.label} · ${h.school}</div>
                <div style="font-size:15px; font-weight:600; color:#1a1a1a; margin-bottom:6px;">${h.headline}</div>
                <div style="font-size:13px; color:#555; line-height:1.6;">${h.detail}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  const schoolSections = schools.map(school => {
    const sc = SCHOOL_COLORS[school.key] || { accent: '#666', light: '#f9f9f9' };
    const itemRows = (school.items || []).map(item => {
      const plat = PLATFORM_COLORS[item.platform] || { color: '#666', bg: '#f5f5f5', label: item.platform };
      return `
        <tr>
          <td style="padding: 0 0 10px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eeeeee; border-radius:8px; border-left: 3px solid ${plat.color};">
              <tr>
                <td style="padding: 14px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display:inline-block; background:${plat.bg}; color:${plat.color}; font-size:10px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; padding:3px 9px; border-radius:4px;">${plat.label}</span>
                      </td>
                      <td align="right" style="font-size:11px; color:#999;">${item.time || 'Recent'}</td>
                    </tr>
                  </table>
                  <div style="font-size:14px; font-weight:600; color:#1a1a1a; margin: 8px 0 4px;">${item.title}</div>
                  <div style="font-size:13px; color:#666; line-height:1.6; margin-bottom:8px;">${item.snippet}</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:11px; color:#aaa;">${item.engagement && item.engagement !== 'N/A' ? `📊 ${item.engagement}` : ''}</td>
                      <td align="right">${item.url ? `<a href="${item.url}" style="font-size:11px; color:${plat.color}; text-decoration:none; font-weight:600;">View →</a>` : ''}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    }).join('');

    return `
      <tr><td style="padding: 0 0 28px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 0 0 14px 0; border-bottom: 2px solid ${sc.accent};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block; background:${sc.accent}; color:#ffffff; font-size:12px; font-weight:700; padding:4px 12px; border-radius:20px; margin-right:8px;">${school.key.toUpperCase()}</span>
                    <span style="font-size:17px; font-weight:700; color:#1a1a1a;">${school.name}</span>
                  </td>
                  <td align="right" style="font-size:12px; color:#999;">${school.items?.length || 0} activities</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="padding-top:14px;">${itemRows || '<p style="color:#aaa;font-size:13px;">No recent activity found this week.</p>'}</td></tr>
        </table>
      </td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f4f4f0; font-family: Georgia, 'Times New Roman', serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0; padding: 40px 20px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px; width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:#0a0a0a; border-radius:12px 12px 0 0; padding: 32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-family: Georgia, serif; font-size:11px; color:#888; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">Istituto Marangoni Miami</div>
            <div style="font-family: Georgia, serif; font-size:26px; color:#ffffff; font-weight:400; font-style:italic; line-height:1.2;">Competitor Intelligence<br><span style="color:#d4a853;">Daily Briefing</span></div>
          </td>
          <td align="right" valign="top">
            <div style="font-size:11px; color:#666; text-align:right; line-height:1.8;">
              <span style="display:block; color:#ffffff; font-size:13px; font-weight:600;">${report_date}</span>
              ${totalActivities} activities tracked<br>
              4 schools monitored
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- SUMMARY PILLS -->
  <tr>
    <td style="background:#1a1a1a; padding: 16px 40px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;"><span style="background:#2a2a2a; color:#d4a853; font-size:11px; font-weight:600; padding:5px 14px; border-radius:20px; display:inline-block;">MDC · FIT · SCAD · PARSONS</span></td>
          <td><span style="background:#2a2a2a; color:#888; font-size:11px; padding:5px 14px; border-radius:20px; display:inline-block;">IG · LinkedIn · TikTok · Press · Blog · Newsletter · Web</span></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#ffffff; padding: 40px 40px 10px; border-radius:0 0 12px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0">

        <!-- KEY INSIGHTS -->
        <tr>
          <td style="padding-bottom: 32px;">
            <div style="font-family:Georgia,serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#d4a853; margin-bottom:16px; font-weight:600;">Key Insights This Week</div>

            <!-- Most active -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf7; border:1px solid #e8e4d8; border-radius:10px; margin-bottom:14px;">
              <tr>
                <td style="padding:18px 22px;">
                  <div style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Most Active This Week</div>
                  <div style="font-size:18px; font-weight:700; color:#1a1a1a;">${key_insights.most_active_school} <span style="font-size:13px; color:#d4a853; font-weight:400;">${key_insights.most_active_count} activities</span></div>
                </td>
              </tr>
            </table>

            <!-- Highlight cards -->
            <table width="100%" cellpadding="0" cellspacing="0">${insightCards}</table>

            <!-- Recommended action -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a; border-radius:10px;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:10px; font-weight:700; color:#d4a853; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Recommended Action for Istituto Marangoni Miami</div>
                  <div style="font-size:14px; color:#ffffff; line-height:1.7;">${key_insights.recommended_action}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding-bottom:28px; border-bottom:1px solid #eee;"></td></tr>
        <tr><td style="padding-top:28px;">
          <div style="font-family:Georgia,serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#999; margin-bottom:20px; font-weight:600;">Full Activity Log</div>
        </td></tr>

        <!-- SCHOOL SECTIONS -->
        ${schoolSections}

        <!-- FOOTER -->
        <tr>
          <td style="border-top:1px solid #eee; padding: 24px 0 8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Georgia,serif; font-size:12px; color:#aaa; font-style:italic;">Istituto Marangoni Miami · Competitor Intelligence Unit</td>
                <td align="right" style="font-size:11px; color:#ccc;">Auto-generated · Do not reply</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>

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
  const subject = `📊 Competitor Intel · ${report.report_date} · ${report.key_insights?.most_active_school || ''} Most Active`;

  const msg = {
    to: recipients,
    from: {
      email: process.env.FROM_EMAIL || 'intelligence@istitutomarangoni-miami.com',
      name: 'IM Miami Intelligence'
    },
    subject,
    html,
    text: `Competitor Intelligence Report - ${report.report_date}\n\nKey Insight: ${report.key_insights?.recommended_action}\n\nView full report in HTML.`,
  };

  await sgMail.sendMultiple(msg);
  console.log(`[mailer] Email sent to ${recipients.join(', ')}`);
}
