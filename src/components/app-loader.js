import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { SirMsalAuth } from './auth/jwt/msal-authentication.js';
import './landing-page-components/sir-login.js';
import {rootPath} from '@polymer/polymer/lib/utils/settings.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class AppLoader extends PolymerElement {
  static get template() {
    return html`
      <style>
        *[hidden] {
          display: none !important;
        }

        #loading-card {
          @apply --layout-horizontal;
          @apply --layout-center;
          padding: 28px;
          margin: 12px;
          color: rgba(0, 0, 0, 0.87);
          flex-wrap: wrap;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      </style>

      <div hidden$="[[loading]]">
        <template is="dom-if" if="[[authorized]]">
          <template is="dom-if" if="[[noAccessGranted]]">
            <no-access></no-access>
          </template>
          <template is="dom-if" if="[[!noAccessGranted]]">
            <app-shell></app-shell>
          </template>
        </template>
        <template is="dom-if" if="[[!authorized]]">
          <sir-login></sir-login>
        </template>
      </div>

      <div id="loading-card" hidden$="[[!loading]]">
        <h2> Loading, please wait </h2>
      </div>
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
      },
      loading: {
        type: Boolean,
        value: false
      },
      noAccessGranted: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkAuth();
    window.addEventListener('no-access-error', () => this.showNoAccessPage());
  }

  async showNoAccessPage() {
    await import('./non-found-module/no-access.js');
    this.set('noAccessGranted', true);
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
    this.set('loading', true);
    const reduxStore = await import('../redux/store.js');
    reduxStore.initStore();
    this.registerServiceWorker();
    await import('./app-shell.js');
    this.set('authorized', true);
    this.set('loading', false);
  }

  unauthorizedCallback() {
    this.set('authorized', false);
  }

  registerServiceWorker() {
    // Load and register pre-caching Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js', {
        scope: MyAppGlobals.rootPath
      });
    }
  }
}

window.customElements.define(AppLoader.is, AppLoader);
