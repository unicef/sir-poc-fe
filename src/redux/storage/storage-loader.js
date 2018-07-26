import storage from 'redux-persist/es/storage';
import { storage as idbStorage} from './indexeddb-storage.js';

export const getStorage = () => {
  if (!('indexedDB' in window)) {
    return storage;
  }

  return idbStorage;
}
