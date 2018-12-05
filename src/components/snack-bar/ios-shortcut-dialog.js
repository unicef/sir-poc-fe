
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog';

class IosShortcutDialog extends PolymerElement {
  static get is() {
    return 'ios-shortcut-dialog';
  }
  static get template() {
    return html`
      <style>
        paper-dialog {
          position: fixed;
          bottom: 0;
          margin: 0;
          width: 100%;
          max-height: initial !important;
        }
        img {
          margin: 0 8px 10px 8px;
          vertical-align: middle;
        }
        p {
          text-align: center;
        }
      </style>
      <paper-dialog id="dialog">
        <p>
          Install this webapp on your device: Tap <img src="/images/safari_share.png"></img> and then Add to Homescreen
        </p>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      active: Boolean
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkIfIosAndOpenDialog();
  }

  checkIfIosAndOpenDialog() {
    if (this.isIos() && !this.isInStandaloneMode()) {
      this.$.dialog.open();
    }
  }

  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }

  isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
  }
}

window.customElements.define(IosShortcutDialog.is, IosShortcutDialog);
