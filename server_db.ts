/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface AIProviderRow {
  id: string;
  user_id: string;
  provider_name: string;
  api_key: string; // Encrypted on disk
  default_model: string;
  is_enabled: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Simple stable password/key for encrypting credentials
const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'marketing_os_db_secure_aes256_key_32bytes';
const IV_LENGTH = 16;

// Derive a 32-byte key buffer from the ENCRYPTION_KEY string
const keyBuffer = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

/**
 * Encrypt a plaintext string using AES-256-CBC
 */
export function encrypt(text: string): string {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('Encryption failed', err);
    return '';
  }
}

/**
 * Decrypt an AES-256-CBC encrypted string back to plaintext
 */
export function decrypt(text: string): string {
  if (!text) return '';
  try {
    const parts = text.split(':');
    if (parts.length !== 2) return '';
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed', err);
    return '';
  }
}

/**
 * Mask API key like: ************ABCD
 */
export function maskKey(apiKeyEncrypted: string): string {
  if (!apiKeyEncrypted) return '';
  const decrypted = decrypt(apiKeyEncrypted);
  if (!decrypted) return '';
  if (decrypted.length <= 4) {
    return '****' + decrypted;
  }
  return '************' + decrypted.slice(-4);
}

// In serverless environments (e.g. Vercel, Netlify, AWS Lambda), root is read-only
const isServerless = !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BASE_DATA_DIR = isServerless 
  ? path.join(os.tmpdir(), 'marketing_os_data')
  : path.join(process.cwd(), 'data');

const DB_PATH = path.join(BASE_DATA_DIR, 'ai_providers_db.json');

// In-memory fallback caches
let memoryProviders: AIProviderRow[] = [];
let memoryTools: ToolIntegrationRow[] = [];

/**
 * Ensures database folder and file exist
 */
function ensureDb() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    // Read-only or restricted filesystem: continue in memory
  }
}

/**
 * Read all provider rows from database file
 */
export function getAllRows(): AIProviderRow[] {
  ensureDb();
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(data) as AIProviderRow[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProviders = parsed;
      }
    }
  } catch (e) {
    // Read error fallback
  }
  return memoryProviders;
}

/**
 * Write all rows back to database file
 */
export function writeRows(rows: AIProviderRow[]) {
  memoryProviders = rows;
  ensureDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(rows, null, 2), 'utf8');
  } catch (e) {
    // Write error fallback
  }
}

/**
 * Get all configured providers for a specific user
 */
export function getProvidersForUser(userId: string): AIProviderRow[] {
  const rows = getAllRows();
  return rows.filter(r => r.user_id === userId);
}

/**
 * Saves or updates a provider configuration for a user.
 * Automatically clears is_default flags for other providers of the user if this is set to default.
 */
export function saveProvider(
  userId: string,
  providerName: string,
  apiKey: string,
  defaultModel: string,
  isEnabled: boolean,
  isDefault: boolean
): AIProviderRow {
  const rows = getAllRows();
  const now = new Date().toISOString();

  // If this provider is default, clear is_default for other providers of this user
  if (isDefault) {
    rows.forEach(r => {
      if (r.user_id === userId && r.provider_name !== providerName) {
        r.is_default = false;
        r.updated_at = now;
      }
    });
  }

  // Find if provider already exists for user
  const existingIndex = rows.findIndex(r => r.user_id === userId && r.provider_name === providerName);

  // If apiKey contains masking characters (stars) and is unchanged, keep existing encrypted key
  let finalEncryptedKey = '';
  if (apiKey) {
    if (apiKey.includes('*') || apiKey.includes('•')) {
      // Key was not modified by user, keep old key if found
      if (existingIndex > -1) {
        finalEncryptedKey = rows[existingIndex].api_key;
      } else {
        // First time but has masking characters (should not happen, but fallback encrypt)
        finalEncryptedKey = encrypt(apiKey);
      }
    } else {
      finalEncryptedKey = encrypt(apiKey);
    }
  }

  let resultRow: AIProviderRow;

  if (existingIndex > -1) {
    const existingRow = rows[existingIndex];
    resultRow = {
      ...existingRow,
      api_key: finalEncryptedKey || existingRow.api_key,
      default_model: defaultModel,
      is_enabled: isEnabled,
      is_default: isDefault,
      updated_at: now
    };
    rows[existingIndex] = resultRow;
  } else {
    const newId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString('hex');

    resultRow = {
      id: newId,
      user_id: userId,
      provider_name: providerName,
      api_key: finalEncryptedKey,
      default_model: defaultModel,
      is_enabled: isEnabled,
      is_default: isDefault,
      created_at: now,
      updated_at: now
    };
    rows.push(resultRow);
  }

  writeRows(rows);
  return resultRow;
}

export interface ToolIntegrationRow {
  id: string;
  user_id: string;
  tool_id: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  config_encrypted: string; // JSON encrypted
  last_sync: string;
  synced_metrics_json: string;
  created_at: string;
  updated_at: string;
}

const TOOLS_DB_PATH = path.join(BASE_DATA_DIR, 'tool_integrations_db.json');

function ensureToolsDb() {
  try {
    const dir = path.dirname(TOOLS_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(TOOLS_DB_PATH)) {
      fs.writeFileSync(TOOLS_DB_PATH, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    // Read-only filesystem fallback
  }
}

export function getAllToolRows(): ToolIntegrationRow[] {
  ensureToolsDb();
  try {
    if (fs.existsSync(TOOLS_DB_PATH)) {
      const data = fs.readFileSync(TOOLS_DB_PATH, 'utf8');
      const parsed = JSON.parse(data) as ToolIntegrationRow[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryTools = parsed;
      }
    }
  } catch (e) {
    // Read error fallback
  }
  return memoryTools;
}

export function writeToolRows(rows: ToolIntegrationRow[]) {
  memoryTools = rows;
  ensureToolsDb();
  try {
    fs.writeFileSync(TOOLS_DB_PATH, JSON.stringify(rows, null, 2), 'utf8');
  } catch (e) {
    // Write error fallback
  }
}

export function getToolsForUser(userId: string): ToolIntegrationRow[] {
  const rows = getAllToolRows();
  return rows.filter(r => r.user_id === userId);
}

export function saveToolIntegration(
  userId: string,
  toolId: string,
  config: Record<string, string>,
  status: 'connected' | 'disconnected' | 'syncing' | 'error' = 'connected',
  syncedMetrics?: any
): ToolIntegrationRow {
  const rows = getAllToolRows();
  const now = new Date().toISOString();
  const existingIndex = rows.findIndex(r => r.user_id === userId && r.tool_id === toolId);

  // Encrypt config credentials
  const encryptedConfig = encrypt(JSON.stringify(config));
  const metricsJson = syncedMetrics ? JSON.stringify(syncedMetrics) : '';

  let resultRow: ToolIntegrationRow;

  if (existingIndex > -1) {
    const existing = rows[existingIndex];
    resultRow = {
      ...existing,
      status,
      config_encrypted: encryptedConfig || existing.config_encrypted,
      last_sync: now,
      synced_metrics_json: metricsJson || existing.synced_metrics_json,
      updated_at: now
    };
    rows[existingIndex] = resultRow;
  } else {
    const newId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString('hex');

    resultRow = {
      id: newId,
      user_id: userId,
      tool_id: toolId,
      status,
      config_encrypted: encryptedConfig,
      last_sync: now,
      synced_metrics_json: metricsJson,
      created_at: now,
      updated_at: now
    };
    rows.push(resultRow);
  }

  writeToolRows(rows);
  return resultRow;
}

export function deleteToolIntegration(userId: string, toolId: string): boolean {
  const rows = getAllToolRows();
  const filtered = rows.filter(r => !(r.user_id === userId && r.tool_id === toolId));
  if (filtered.length !== rows.length) {
    writeToolRows(filtered);
    return true;
  }
  return false;
}

