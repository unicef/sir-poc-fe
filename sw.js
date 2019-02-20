console.log('service worker started');
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

function createTransaction() {
  var db = idb.result;
  var tx = db.transaction('PersistedState', 'readwrite');
  return tx.objectStore('PersistedState');
}

setTimeout(() => {
  console.log('nuking the DB');
  // createTransaction().clear();
}, 10000);

