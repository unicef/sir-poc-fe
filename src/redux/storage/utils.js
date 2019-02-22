import { createTransform } from 'redux-persist';
import { makeRequest } from '../../components/common/request-helper.js';
import { Endpoints } from '../../config/endpoints.js';

var key;

makeRequest(Endpoints.myKey).then((result) => {
  key = result.key;
})

export const encryptState = createTransform(
  (inboundState) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(inboundState), key);

    return cryptedText.toString();
  },
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);
