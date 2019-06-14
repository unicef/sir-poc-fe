/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { ButtonsBaseClass } from './buttons-base.js';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class ResetButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
        :host {
          margin-left: 4px;
        }
      </style>
      <paper-button raised
                    on-tap="openDialog"
                    hidden$="[[!hasPermission('add_incident')]]">
        Reset Data
      </paper-button>
      `;
  }

  static get is() {
    return 'reset-button';
  }

  connectedCallback() {
    super.connectedCallback();
    this.createResetConfirmationDialog();
  }

  createResetConfirmationDialog() {
    let content = 'Are you sure you want to reset the data on this incident?';
    let okText = 'Reset';
    this.createConfirmationDialog(content, okText);
  }

  dialogConfirmationCallback(event) {
    if (!event.detail.confirmed) {
      return;
    }

    let resetEvent = new CustomEvent('reset-incident', {bubbles: true, composed: true});
    this.dispatchEvent(resetEvent);
  }

}

window.customElements.define(ResetButton.is, ResetButton);
