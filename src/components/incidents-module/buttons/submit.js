/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { submitIncident, fetchIncidents } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { ButtonsBaseClass } from './buttons-base.js';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class SubmitButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
        :host {
          margin-left: 4px;
        }
      </style>
      <paper-button raised on-tap="openDialog">
        [[getLabel(incident.status)]]
      </paper-button>
      `;
  }

  static get is() {
    return 'submit-button';
  }

  incidentChanged() {
    if (!this.warningDialog && this.incident) {
      this.createSubmitConfirmationDialog();
    }
  }

  getLabel(status) {
    return 'Submit';
  }

  createSubmitConfirmationDialog() {
    let content = `Are you sure you want to ${this.getLabel(this.incident.status).toLowerCase()} this incident?`;
    let okText = this.getLabel(this.incident.status);
    this.createConfirmationDialog(content, okText);
  }

  async submit() {
    let result = await this.store.dispatch(submitIncident(this.incident));
    if (result) {
      this.showSuccessMessage();
      this.store.dispatch(fetchIncidents());
    }
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.submit();
    }
  }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident submitted'));
  }

}

window.customElements.define(SubmitButton.is, SubmitButton);
