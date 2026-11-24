import { ALLOWED_EMAIL_HASHES } from '../types';

/**
 * Computes SHA-256 hex digest for a normalized email (lowercase and trimmed).
 * Uses browser standard Web Crypto API.
 */
export async function hashEmail(email: string): Promise<string> {
  const normalized = (email || '').trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates whether the given email matches one of the allowed SHA-256 hashes.
 */
export async function isEmailAllowed(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const hash = await hashEmail(email);
    return ALLOWED_EMAIL_HASHES.includes(hash);
  } catch (error) {
    console.error('Failed to hash email for verification:', error);
    return false;
  }
}
