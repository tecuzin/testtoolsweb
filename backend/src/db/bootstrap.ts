import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSqlFile(filename: string) {
  const primaryPath = path.join(__dirname, filename);
  const fallbackPath = path.join(__dirname, '../../src/db', filename);
  let content: string;

  try {
    content = await fs.readFile(primaryPath, 'utf8');
  } catch {
    content = await fs.readFile(fallbackPath, 'utf8');
  }

  await pool.query(content);
}

export async function ensureDatabaseReady() {
  await runSqlFile('schema.sql');
}

export async function resetAndSeedDatabase() {
  await runSqlFile('seed.sql');
}
