/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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

const DB_PATH = path.join(process.cwd(), 'data', 'ai_providers_db.json');

/**
 * Ensures database folder and file exist
 */
function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Read all provider rows from database file
 */
export function getAllRows(): AIProviderRow[] {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data) as AIProviderRow[];
  } catch (e) {
    console.error('Failed to read db file', e);
    return [];
  }
}

/**
 * Write all rows back to database file
 */
export function writeRows(rows: AIProviderRow[]) {
  ensureDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(rows, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write to db file', e);
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
