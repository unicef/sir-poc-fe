import { storage as idbStorage } from './indexeddb-storage.js';

export const getStorage = () => {
  // no service worker means no offline capability and no point to persist the state
  if (!('indexedDB' in window) || !('serviceWorker' in navigator)) {
    return {
      getItem: () => Promise.resolve(null),
      setItem: (key, item) => Promise.resolve(item),
      removeItem: () => Promise.resolve()
    }
  }

  return idbStorage;
};
