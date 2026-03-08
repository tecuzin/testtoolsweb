import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSqlFile(filename: string) {
  const content = await fs.readFile(path.join(__dirname, filename), 'utf8');
  await pool.query(content);
}

export async function ensureDatabaseReady() {
  await runSqlFile('schema.sql');
}

export async function resetAndSeedDatabase() {
  await runSqlFile('seed.sql');
}
