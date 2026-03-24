import KEYS from './sessionStorageVariables.js';

const registered = new Set(Object.values(KEYS));

function assertRegistered(key) {
  if (!registered.has(key)) {
    throw new Error(`SessionStorage key "${key}" is not registered in sessionStorageVariables.`);
  }
}

function serialize(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function nullOrJsonify(raw) {
  if (raw === null) return null;
  return JSON.parse(raw);
}

export function setItem(key, value) {
  assertRegistered(key);
  const v = serialize(value);
  sessionStorage.setItem(key, v);
}

export function getItem(key, defaultValue = null) {
  assertRegistered(key);
  const raw = sessionStorage.getItem(key);
  if (raw === null) return defaultValue;
  return nullOrJsonify(raw);
}

export function removeItem(key) {
  assertRegistered(key);
  sessionStorage.removeItem(key);
}

export function clear() {
  // Only clears keys that are registered in our registry
  Object.values(KEYS).forEach((k) => sessionStorage.removeItem(k));
}

export default {
  setItem,
  getItem,
  removeItem,
  clear,
};
