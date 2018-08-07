'use strict';

const init = () => new Promise((resolve, reject) => {
  let store;
  let idb = indexedDB.open('sir-poc', 1);

  idb.onupgradeneeded = () => {
    var db = idb.result;
    store = db.createObjectStore('PersistedState', {keyPath: 'key'});
  };

  idb.onerror = () => {
    console.warn('IDB creation failed');
    reject();
  };

  idb.onsuccess = () => {
    // Start a new transaction
    var db = idb.result;
    var tx = db.transaction('PersistedState', 'readwrite');
    store = tx.objectStore('PersistedState');
    resolve(store);
  };
});

let getItem = key => new Promise((resolve, reject) => {
  init().then((store) => {
    let getReq = store.get(key);
    getReq.onsuccess = () => resolve(getReq.result ? getReq.result.item : null);
    getReq.onerror = () => reject(getReq.error);
  });
});

let setItem = (key, item) => new Promise((resolve, reject) => {
  init().then((store) => {
    let putReq = store.put({key, item});
    putReq.onsuccess = () => resolve(item);
    putReq.onerror = () => reject(item);
  });
});

let removeItem = key => new Promise((resolve, reject) => {
  init().then((store) => {
    let getReq = store.delete(key);
    getReq.onsuccess = () => resolve();
    getReq.onerror = () => reject();
  });
});

export const storage = {
  getItem,
  setItem,
  removeItem
};
