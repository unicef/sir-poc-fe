import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { SirMsalAuth } from './auth/jwt/msal-authentication.js';
import './auth/sir-login.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class AppLoader extends PolymerElement {
  static get template() {
    return html`
      <template is="dom-if" if="[[authorized]]">
        <app-shell></app-shell>
      </template>
      <template is="dom-if" if="[[!authorized]]">
        <sir-login></sir-login>
      </template>
    `;
  }

  static get is() {
    return 'app-loader';
  }

  static get properties() {
    return {
      authorized: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkAuth();
  }

  checkAuth() {
    if (SirMsalAuth.tokenIsValid()) {
      this.authorizedCallback();
      return;
    }

    SirMsalAuth.acquireTokenSilent()
      .then(this.authorizedCallback.bind(this))
      .catch(this.unauthorizedCallback.bind(this));
  }

  async authorizedCallback() {
    await import('./app-shell.js');
    this.set('authorized', true);
    this.registerServiceWorker();
  }

  unauthorizedCallback() {
    this.set('authorized', false);
  }

  registerServiceWorker() {
    // Load and register pre-caching Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js', {
          scope: MyAppGlobals.rootPath
        });
      });
    }
  }
}

window.customElements.define(AppLoader.is, AppLoader);
