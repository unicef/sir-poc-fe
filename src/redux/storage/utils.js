import { createTransform } from 'redux-persist';
import { makeRequest } from '../../components/common/request-helper.js';
import { Endpoints } from '../../config/endpoints.js';
import { ERASE_DATABASE_AFTER } from '../../config/general.js';

const fetchKey = () => {
  return makeRequest(Endpoints.myKey).then((result) => {
    updateStoredKey(result.key);
    return result.key;
  });
};

// fetchKey();

const updateStoredKey = (key) => {
  resetKey();
  setKey(key, new Date(Date.now() + ERASE_DATABASE_AFTER));
}

const getKey = async () => {
  let index = document.cookie.indexOf('key=');

  if (index < 0) {
    if (navigator.onLine) {
      return await fetchKey();
    }

    return null;
  }

  return document.cookie.substring(4 + index, 4 + 32 + index);
}

const setKey = (key, expires) => {
  if (!expires instanceof Date) {
    return false;
  }

  document.cookie = `key=${key}; expires=${expires.toUTCString()}`;
}

const resetKey = () => {
  document.cookie = `key=000; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

export const resetKeyExpiry = () => {
  updateStoredKey(getKey());
}

export const encryptState = createTransform(
  (inboundState) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(inboundState), getKey());

    return cryptedText.toString();
  },
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, getKey());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);
