export function updatePath(newPath) {
  window.history.pushState({}, '', newPath);
  window.dispatchEvent(new CustomEvent('location-changed'));
}

export function redirectToLogin() {
  // using updatePath will not cause a hard redirect
  window.location = '/admin/login';
}
