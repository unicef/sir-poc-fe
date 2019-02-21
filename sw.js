importScripts('persistance-config.js');

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});


let store, db;
let idb = indexedDB.open('sir-poc', 1);
let lastActivityTimestamp = getCurrentTimestamp();

idb.onupgradeneeded = () => {
  db = idb.result;
  store = db.createObjectStore('PersistedState', {keyPath: 'key'});
};

idb.onerror = () => {
  console.warn('IDB creation failed');
  reject();
};

function createTransaction() {
  let tx = idb.result.transaction('PersistedState', 'readwrite');
  return tx.objectStore('PersistedState');
}

function clearSavedState() {
  createTransaction().clear();
}

function getCurrentTimestamp() {
  return (new Date()).getTime();
}

function getElapsedTime(timestamp) {
  return getCurrentTimestamp() - timestamp;
}

self.addEventListener('message', (event) => {
  lastActivityTimestamp = getCurrentTimestamp();
});

// check to see if we need to erase the saved state
let interval = setInterval(() => {
  if (getElapsedTime(lastActivityTimestamp) >= ERASE_DATABASE_AFTER) {
    clearSavedState();
    lastActivityTimestamp = getCurrentTimestamp();
    console.log('persisted state deleted due to inactivity');
  } else {
    console.log('last activity was', getElapsedTime(lastActivityTimestamp) / 1000, 'seconds ago')
  }
}, CHECK_IDLE_STATE_INTERVAL);

