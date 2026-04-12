import express from 'express';
import cron from 'node-cron';
import { generateReport } from './reporter.js';
import { sendEmail } from './mailer.js';
import { generateReportHTML } from './report-template.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `https://im-intel-bot.onrender.com`;

app.use(express.json());

// Store latest report in memory
let latestReport = null;
let latestReportHTML = null;
let latestReportDate = null;

// ── Serve the visual HTML report ──────────────────────────────
app.get('/report', (req, res) => {
  if (!latestReportHTML) {
    return res.send(`
      <!DOCTYPE html><html><head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
      </head>
      <body style="background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
      <div style="text-align:center;color:#fff;">
        <div style="font-family:'Playfair Display',serif;font-size:32px;margin-bottom:16px;">No report yet</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(255,255,255,0.4);">Trigger one via POST /api/run-report</div>
      </div></body></html>
    `);
  }
  res.send(latestReportHTML);
});

// ── Manual trigger ────────────────────────────────────────────
app.post('/api/run-report', async (req, res) => {
  try {
    console.log('[server] Generating report...');
    const report = await generateReport();
    latestReport = report;
    latestReportHTML = generateReportHTML(report);
    latestReportDate = new Date().toISOString();
    await sendEmail(report, `${BASE_URL}/report`);
    res.json({ success: true, message: 'Report generated and sent.', report_url: `${BASE_URL}/report`, timestamp: latestReportDate });
  } catch (err) {
    console.error('[server] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Competitor Intelligence Bot', uptime: process.uptime(), last_report: latestReportDate });
});

// ── Status landing page ───────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IMM Intelligence Bot</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:#0d0d0d;color:#f0ece4;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px}
    .wrap{max-width:520px;width:100%}
    .eyebrow{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:16px}
    h1{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;line-height:1.05;margin-bottom:8px}
    h1 em{font-style:italic;color:rgba(255,255,255,0.3)}
    .sub{font-size:13px;color:rgba(255,255,255,0.3);margin-bottom:48px;line-height:1.6}
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px}
    .stat{background:#1a1a1a;border:1px solid #222;border-radius:4px;padding:18px 20px}
    .stat-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:6px}
    .stat-value{font-family:'Playfair Display',serif;font-size:20px;color:#fff}
    .btn{display:block;width:100%;padding:16px;background:#fff;color:#111;border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.5px;transition:opacity 0.2s;margin-bottom:10px}
    .btn:hover{opacity:0.85}
    .btn:disabled{opacity:0.4;cursor:not-allowed}
    .btn-outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.2)}
    .btn-outline:hover{background:rgba(255,255,255,0.05)}
    .status{margin-top:14px;font-size:13px;text-align:center;min-height:20px;color:rgba(255,255,255,0.3)}
    .status.success{color:#4ade80}
    .status.error{color:#f87171}
    .dot{display:inline-block;width:6px;height:6px;background:#4ade80;border-radius:50%;margin-right:6px;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    .footer{margin-top:40px;text-align:center;font-size:10px;color:rgba(255,255,255,0.15);letter-spacing:0.5px}
  </style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">Istituto Marangoni Miami</div>
  <h1>Intelligence<br><em>Bot</em></h1>
  <p class="sub">Tracking MDC · FIT · SCAD · Parsons across 7 platforms. Every weekday at 8AM ET.</p>

  <div class="stat-grid">
    <div class="stat"><div class="stat-label">Status</div><div class="stat-value"><span class="dot"></span>Live</div></div>
    <div class="stat"><div class="stat-label">Uptime</div><div class="stat-value" id="uptime">—</div></div>
    <div class="stat"><div class="stat-label">Schedule</div><div class="stat-value">8AM ET</div></div>
    <div class="stat"><div class="stat-label">Last Report</div><div class="stat-value" id="last">${latestReportDate ? new Date(latestReportDate).toLocaleDateString() : 'Never'}</div></div>
  </div>

  <button class="btn" onclick="trigger()">Generate & Send Report Now</button>
  ${latestReportHTML ? `<a href="/report"><button class="btn btn-outline">View Last Report →</button></a>` : ''}
  <div class="status" id="status"></div>

  <div class="footer">Auto-generated · Confidential · Not for external distribution</div>
</div>
<script>
async function upd(){try{const r=await fetch('/health');const d=await r.json();const s=Math.floor(d.uptime);const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);document.getElementById('uptime').textContent=h>0?h+'h '+m+'m':m+'m';}catch(e){}}
async function trigger(){
  const btn=document.querySelector('.btn');const st=document.getElementById('status');
  btn.disabled=true;btn.textContent='Generating report…';st.className='status';st.textContent='Searching all platforms — takes ~60 seconds…';
  try{
    const r=await fetch('/api/run-report',{method:'POST'});const d=await r.json();
    if(d.success){st.className='status success';st.textContent='✓ Report sent! Check your inbox.';btn.textContent='View Report →';btn.onclick=()=>window.open('/report','_blank');btn.disabled=false;}
    else throw new Error(d.error);
  }catch(e){st.className='status error';st.textContent='✗ '+e.message;btn.disabled=false;btn.textContent='Try Again';}
}
upd();setInterval(upd,30000);
</script>
</body></html>`);
});

// ── Cron scheduler ────────────────────────────────────────────
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 12 * * 1-5';
cron.schedule(CRON_SCHEDULE, async () => {
  console.log(`[cron] Running at ${new Date().toISOString()}`);
  try {
    const report = await generateReport();
    latestReport = report;
    latestReportHTML = generateReportHTML(report);
    latestReportDate = new Date().toISOString();
    await sendEmail(report, `${BASE_URL}/report`);
    console.log('[cron] Done.');
  } catch (err) {
    console.error('[cron] Failed:', err.message);
  }
}, { timezone: 'America/New_York' });

app.listen(PORT, () => {
  console.log(`\n🎓 Competitor Intelligence Bot running on port ${PORT}`);
  console.log(`📅 Schedule: ${CRON_SCHEDULE} (America/New_York)`);
  console.log(`🔗 Report: ${BASE_URL}/report\n`);
});
