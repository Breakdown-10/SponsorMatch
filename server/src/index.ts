import express, { Request, Response } from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { runManager } from './pipeline/runManager.js';
import { SAMPLE_EVENTS } from './fixtures/sampleEvents.js';
import { qlooClient } from './qloo/client.js';
import { EventInput, UserFeedbackRequest } from './types.js';

const app = express();

app.use(cors());
app.use(express.json());

// SSE Clients Registry
const sseClients = new Map<string, Response[]>();

function broadcastProgress(runId: string, data: any) {
  const clients = sseClients.get(runId) || [];
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: CONFIG.NODE_ENV,
    qlooBaseUrl: CONFIG.QLOO_BASE_URL,
    hasApiKey: Boolean(CONFIG.QLOO_API_KEY && CONFIG.QLOO_API_KEY.length > 5),
    sampleCount: SAMPLE_EVENTS.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Sample events list
app.get('/api/samples', (req: Request, res: Response) => {
  res.json(SAMPLE_EVENTS);
});

// 3. Quick entity search for autocomplete
app.get('/api/search', async (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.json([]);
  }
  const type = String(req.query.type || 'urn:entity:artist');
  try {
    const result = await qlooClient.searchEntities(query, [type], 'search-api', 5);
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Create run
app.post('/api/runs', (req: Request, res: Response) => {
  const input: EventInput = req.body;
  if (!input || !input.eventName) {
    return res.status(400).json({ error: 'eventName is required' });
  }
  const run = runManager.createRun(input);
  res.status(201).json(run);
});

// 5. Get run state
app.get('/api/runs/:id', (req: Request, res: Response) => {
  const runId = String(req.params.id);
  const run = runManager.getRun(runId);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }
  res.json(run);
});

// 6. SSE streaming endpoint
app.get('/api/runs/:id/stream', (req: Request, res: Response) => {
  const runId = String(req.params.id);
  const run = runManager.getRun(runId);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial state
  res.write(`data: ${JSON.stringify({ type: 'INIT', run })}\n\n`);

  // Register client
  const clients = sseClients.get(runId) || [];
  clients.push(res);
  sseClients.set(runId, clients);

  req.on('close', () => {
    const remaining = (sseClients.get(runId) || []).filter(c => c !== res);
    if (remaining.length > 0) {
      sseClients.set(runId, remaining);
    } else {
      sseClients.delete(runId);
    }
  });
});

// 7. Execute pipeline
app.post('/api/runs/:id/execute', async (req: Request, res: Response) => {
  const runId = String(req.params.id);
  const run = runManager.getRun(runId);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  // Respond immediately, stream progress via SSE
  res.json({ message: 'Pipeline execution started', runId });

  runManager.executePipeline(runId, (progress) => {
    broadcastProgress(runId, { type: 'PROGRESS', progress, run: runManager.getRun(runId) });
  }).then(completedRun => {
    broadcastProgress(runId, { type: 'COMPLETED', run: completedRun });
  }).catch(err => {
    broadcastProgress(runId, { type: 'ERROR', error: err.message, run: runManager.getRun(runId) });
  });
});

// 8. Apply closed-loop feedback
app.post('/api/runs/:id/feedback', (req: Request, res: Response) => {
  const runId = String(req.params.id);
  const feedback: UserFeedbackRequest = req.body;
  if (!feedback || !feedback.brandId || !feedback.action) {
    return res.status(400).json({ error: 'brandId and action are required' });
  }

  try {
    const updatedRun = runManager.applyFeedback(runId, feedback);
    broadcastProgress(runId, { type: 'FEEDBACK_APPLIED', run: updatedRun });
    res.json(updatedRun);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Production client static file serving
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  console.log(`[SponsorMatch] Serving production frontend from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Pre-warm sample events on boot
async function prewarmSamples() {
  console.log('[SponsorMatch] Pre-warming 3 sample events for instant response...');
  for (const sample of SAMPLE_EVENTS) {
    const run = runManager.createRun(sample.input);
    // Assign stable id matching sample
    run.id = `sample-${sample.id}`;
    runManager['runs'].set(run.id, run);
    await runManager.executePipeline(run.id);
    console.log(`[SponsorMatch] Pre-warmed: ${sample.name} (${run.candidates.length} brands ranked)`);
  }
  console.log('[SponsorMatch] Pre-warming complete. Sample events will load instantly.');
}

const server = app.listen(CONFIG.PORT, () => {
  console.log(`🚀 SponsorMatch Backend running on http://localhost:${CONFIG.PORT}`);
  console.log(`📡 Qloo Base URL: ${CONFIG.QLOO_BASE_URL}`);
  console.log(`🔑 Qloo API Key: ${CONFIG.QLOO_API_KEY ? 'Configured (Active)' : 'Not set (Mock & Cache Fallback Active)'}`);
  prewarmSamples().catch(err => console.error('Error prewarming samples:', err));
});

export { app, server };
