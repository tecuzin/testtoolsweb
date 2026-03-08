import { app } from './app.js';
import { env } from './config/env.js';
import { ensureDatabaseReady, resetAndSeedDatabase } from './db/bootstrap.js';

async function bootstrap() {
  await ensureDatabaseReady();
  if (process.env.SEED_ON_STARTUP === 'true') {
    await resetAndSeedDatabase();
  }

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Unable to start API', error);
  process.exit(1);
});
