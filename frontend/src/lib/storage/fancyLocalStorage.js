import KEYS from "./localStorageVariables.js";

const registered = new Set(Object.values(KEYS));
const storage = window.localStorage;

function assertRegistered(key) {
  if (!registered.has(key)) {
    throw new Error(`Storage key "${key}" is not registered in localStorageVariables.`);
  }
}

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(raw) {
  if (raw === null) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function setItem(key, value) {
  assertRegistered(key);
  const v = serialize(value);
  storage.setItem(key, v);
}

export function getItem(key, defaultValue = null) {
  assertRegistered(key);
  const raw = storage.getItem(key);
  if (raw === null) return defaultValue;
  return deserialize(raw);
}

export function removeItem(key) {
  assertRegistered(key);
  storage.removeItem(key);
}

export function clear() {
  // Only clears keys that are registered in our registry.
  Object.values(KEYS).forEach((k) => storage.removeItem(k));
}

export default {
  setItem,
  getItem,
  removeItem,
  clear,
};
