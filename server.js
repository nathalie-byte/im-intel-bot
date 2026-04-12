import express from 'express';
import cron from 'node-cron';
import { generateReport } from './reporter.js';
import { sendEmail } from './mailer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Manual trigger endpoint (useful for testing)
app.post('/api/run-report', async (req, res) => {
  try {
    console.log('[server] Manual report trigger received');
    const report = await generateReport();
    await sendEmail(report);
    res.json({ success: true, message: 'Report generated and sent.', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[server] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Competitor Intelligence Bot', uptime: process.uptime() });
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Cron: every weekday at 8:00 AM Eastern (UTC-4 in summer / UTC-5 in winter)
// Adjust TZ env var on Render to "America/New_York"
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 12 * * 1-5'; // 8 AM ET = 12 UTC
cron.schedule(CRON_SCHEDULE, async () => {
  console.log(`[cron] Running scheduled report at ${new Date().toISOString()}`);
  try {
    const report = await generateReport();
    await sendEmail(report);
    console.log('[cron] Report sent successfully.');
  } catch (err) {
    console.error('[cron] Failed:', err.message);
  }
}, {
  timezone: 'America/New_York'
});

app.listen(PORT, () => {
  console.log(`\n🎓 Competitor Intelligence Bot running on port ${PORT}`);
  console.log(`📅 Scheduled: ${CRON_SCHEDULE} (America/New_York)`);
  console.log(`🔗 Health: http://localhost:${PORT}/health\n`);
});
