import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const URGENCY_STYLES = {
  high:   { label: 'HIGH PRIORITY', color: '#C0392B', bg: '#FDF3F2' },
  medium: { label: 'WATCH',         color: '#D35400', bg: '#FDF6EC' },
  low:    { label: 'NOTE',          color: '#27AE60', bg: '#EAFAF1' },
};

function buildEmailHTML(report, reportUrl) {
  const { key_insights, schools, report_date } = report;
  const totalActivities = schools.reduce((a, s) => a + (s.items?.length || 0), 0);

  const topHighlights = (key_insights?.highlights || []).slice(0, 3).map(h => {
    const u = URGENCY_STYLES[h.urgency] || URGENCY_STYLES.low;
    return `
    <tr><td style="padding:0 0 10px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${u.color};background:${u.bg};">
        <tr><td style="padding:14px 18px;">
          <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${u.color};font-family:Georgia,serif;margin-bottom:4px;">${u.label} · ${h.school}</div>
          <div style="font-size:14px;font-weight:700;color:#1a1a1a;font-family:Georgia,serif;line-height:1.3;">${h.headline}</div>
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
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- CONFIDENTIAL BANNER -->
  <tr><td style="background:#f5f3ee;border-left:3px solid #1a1a1a;padding:12px 40px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1a1a1a;margin-bottom:4px;">CONFIDENTIAL — FOR INTERNAL USE ONLY</div>
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#555;line-height:1.6;">This report is intended exclusively for Istituto Marangoni Miami (IMM) leadership and authorized recipients. The information contained herein is proprietary and confidential. It may not be shared, forwarded, reproduced, or distributed to any party outside of IMM without prior authorization.</div>
  </td></tr>

  <!-- HEADER -->
  <tr><td style="background:#111;padding:36px 40px 28px;">
    <div style="font-family:Georgia,serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:12px;">Istituto Marangoni Miami · Intelligence Unit</div>
    <div style="font-family:Georgia,serif;font-size:26px;color:#fff;font-weight:400;line-height:1.1;">Competitor Intelligence<br><em style="color:rgba(255,255,255,0.35);">Daily Briefing</em></div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1);margin-bottom:16px;"><div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;">Report created and published by Nathalie Tessier</div></div>
    <div style="margin-top:24px;display:flex;gap:32px;">
      <div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#fff;font-weight:700;">${totalActivities}</div>
        <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Georgia,serif;">Activities</div>
      </div>
      <div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#fff;font-weight:700;">4</div>
        <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Georgia,serif;">Schools</div>
      </div>
      <div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#fff;font-weight:700;">${key_insights?.highlights?.length || 0}</div>
        <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Georgia,serif;">Alerts</div>
      </div>
    </div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#fff;padding:32px 40px;">

    <!-- Most active -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background:#111;padding:16px 20px;">
          <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Georgia,serif;margin-bottom:4px;">Most Active This Week</div>
          <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#fff;">${key_insights?.most_active_school || '—'} <span style="font-size:13px;color:rgba(255,255,255,0.4);font-weight:400;">${key_insights?.most_active_count || 0} activities</span></div>
        </td>
      </tr>
    </table>

    <!-- Top highlights -->
    <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;font-family:Georgia,serif;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:14px;">Top Alerts</div>
    <table width="100%" cellpadding="0" cellspacing="0">${topHighlights}</table>

    <!-- Recommended action -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #111;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#111;font-family:Georgia,serif;margin-bottom:6px;">Recommended Action for IMM</div>
        <div style="font-size:13px;color:#333;font-family:Georgia,serif;line-height:1.7;">${key_insights?.recommended_action || ''}</div>
      </td></tr>
    </table>

    <!-- BIG CTA BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="background:#111;padding:20px;">
          <a href="${reportUrl}" style="display:inline-block;font-family:Georgia,serif;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:1px;">
            VIEW FULL VISUAL REPORT →
          </a>
          <div style="font-size:10px;color:rgba(255,255,255,0.3);font-family:Georgia,serif;margin-top:6px;letter-spacing:0.5px;">Photos · Charts · Full Activity Log · ${report_date}</div>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#1a1a1a;padding:16px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:Georgia,serif;font-size:10px;color:rgba(255,255,255,0.2);">Istituto Marangoni Miami · Intelligence Unit</td>
      <td align="right" style="font-family:Georgia,serif;font-size:10px;color:rgba(255,255,255,0.2);">Auto-generated · Confidential</td>
    </tr></table>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

export async function sendEmail(report, reportUrl) {
  const recipients = (process.env.RECIPIENT_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
  if (!recipients.length) throw new Error('No RECIPIENT_EMAILS configured');

  const html = buildEmailHTML(report, reportUrl);
  const subject = `Intelligence Report · ${report.report_date} · ${report.key_insights?.most_active_school || ''} leads · ${report.key_insights?.highlights?.length || 0} alerts`;

  await sgMail.sendMultiple({
    to: recipients,
    from: { email: process.env.FROM_EMAIL || 'nathalie@tessier.biz', name: 'IMM Intelligence' },
    subject,
    html,
    text: `Competitor Intelligence · ${report.report_date}\n\nMost active: ${report.key_insights?.most_active_school}\n\nView full report: ${reportUrl}`,
  });

  console.log(`[mailer] Sent to ${recipients.join(', ')}`);
}
