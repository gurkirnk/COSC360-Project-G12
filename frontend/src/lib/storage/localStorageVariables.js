/**
 * Central registry of allowed local storage keys, to make remembering these strings easier.
 *
 * Export named constants for direct import, and a default
 * object that contains all keys for programmatic checks.
 *
 * Example:
 * import { USERNAME } from './localStorageVariables'
 * import storage from './localStorageVariables'
 * console.log(storage.USERNAME === USERNAME)
 */

export const AUTH_TOKEN = 'authToken';
export const AUTH_USER = 'authUser';

const KEYS = {
  AUTH_TOKEN,
  AUTH_USER,
};

export default KEYS;
