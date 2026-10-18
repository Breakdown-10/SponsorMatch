import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  QLOO_API_KEY: process.env.QLOO_API_KEY || '',
  QLOO_BASE_URL: process.env.QLOO_BASE_URL || 'https://hackathon.api.qloo.com',
  CACHE_DIR: path.resolve(__dirname, '../../data/cache'),
  DB_DIR: path.resolve(__dirname, '../../data'),
  MAX_QLOO_CALLS_PER_RUN: 8,
  REQUEST_TIMEOUT_MS: 12000,
  ENABLE_MOCK_FALLBACK: true, // Seamless fallback if key is missing or quota exhausted
};
