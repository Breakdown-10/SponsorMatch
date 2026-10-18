import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { CONFIG } from '../config.js';

export class ResponseCache {
  private cacheDir: string;
  private memoryCache: Map<string, { data: any; timestamp: number }>;

  constructor() {
    this.cacheDir = CONFIG.CACHE_DIR;
    this.memoryCache = new Map();
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private hashKey(endpoint: string, params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const sortedObj: Record<string, any> = {};
    for (const key of sortedKeys) {
      sortedObj[key] = params[key];
    }
    const raw = `${endpoint}::${JSON.stringify(sortedObj)}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  public get<T = any>(endpoint: string, params: Record<string, any>): T | null {
    const key = this.hashKey(endpoint, params);

    // 1. Check memory cache
    const mem = this.memoryCache.get(key);
    if (mem) {
      return mem.data as T;
    }

    // 2. Check disk cache
    const filePath = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.memoryCache.set(key, { data: parsed.data, timestamp: parsed.timestamp });
        return parsed.data as T;
      } catch (err) {
        return null;
      }
    }

    return null;
  }

  public set(endpoint: string, params: Record<string, any>, data: any): void {
    const key = this.hashKey(endpoint, params);
    const payload = {
      endpoint,
      params,
      data,
      timestamp: Date.now(),
    };

    this.memoryCache.set(key, { data, timestamp: payload.timestamp });

    try {
      this.ensureCacheDir();
      const filePath = path.join(this.cacheDir, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.warn(`[Cache] Failed to write cache file:`, err);
    }
  }

  public clear(): void {
    this.memoryCache.clear();
  }
}

export const globalCache = new ResponseCache();
