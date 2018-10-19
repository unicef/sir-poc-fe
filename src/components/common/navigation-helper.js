export function updatePath(newPath) {
  window.history.pushState({}, '', newPath);
  window.dispatchEvent(new Event('popstate'));
}

export function redirectToAdminLogin() {
  // using updatePath will not cause a hard redirect
  window.location = '/admin/login';
}

/**
 * Update app state
 */
export function updateAppState(routePath, qs, dispatchLocationChange) {
  // Using replace state to change the URL here ensures the browser's
  // back button doesn't take you through every query
  let currentState = window.history.state;
  window.history.replaceState(currentState, null,
      routePath + (qs.length ? '?' + qs : ''));
  if (dispatchLocationChange) {
    // This event lets app-location and app-route know
    // the URL has changed
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
}
