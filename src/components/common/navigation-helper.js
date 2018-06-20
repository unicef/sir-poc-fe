export function updatePath(newPath) {
  window.history.pushState({}, '', newPath);
  window.dispatchEvent(new CustomEvent('location-changed'));
}
