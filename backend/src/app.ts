import express from 'express';
import cors from 'cors';
import parcelRoutes from './routes/parcel.routes.js';
import plantingRoutes from './routes/planting.routes.js';
import treatmentRoutes from './routes/treatment.routes.js';
import { DomainError } from './services/errors.js';
import { env } from './config/env.js';
import { resetAndSeedDatabase } from './db/bootstrap.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/parcels', parcelRoutes);
app.use('/api/plantings', plantingRoutes);
app.use('/api/treatments', treatmentRoutes);

app.post('/api/test/reset', async (_req, res, next) => {
  if (!env.enableTestReset) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  try {
    await resetAndSeedDatabase();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof DomainError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof Error && error.name === 'ZodError') {
    res.status(400).json({ message: 'Payload invalide' });
    return;
  }

  res.status(500).json({ message: 'Erreur interne' });
});
