import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * @polymer
 * @customElement
 */
class WarnMessage extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .warning {
          display: flex;
          flex-direction: row;
          flex: 1;
          padding: 8px 24px;
          color: var(--primary-text-color);
          background-color: var(--ternary-warning-color);
          border: 1px solid var(--secondary-warning-color);
        }
      </style>

      <div class="warning">
        [[message]]
      </div>
    `;
  }

  static get properties() {
    return {
      message: {
        type: String,
        value: ''
      }
    }
  }

}

window.customElements.define('warn-message', WarnMessage);
