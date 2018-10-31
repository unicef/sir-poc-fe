
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog';

class IosShortcutDialog extends PolymerElement {
  static get is() {
    return 'ios-shortcut-dialog';
  }
  static get template() {
    return html`
      <style>
        paper-dialog.size-position {
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
      <paper-dialog id="dialog" class="size-position">
        <p> Install this webapp on your device: Tap <img src="/images/safari_share.png"></img> and then Add to Homescreen </p>
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
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.$.dialog.open();
    }
  }
}

window.customElements.define(IosShortcutDialog.is, IosShortcutDialog);
