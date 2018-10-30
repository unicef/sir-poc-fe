/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { approveIncident } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { ButtonsBaseClass } from './buttons-base.js';
import { updatePath } from '../../common/navigation-helper';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class ApproveButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
      </style>
      <paper-button raised on-tap="openDialog">
        Approve
      </paper-button>
      `;
  }

  static get is() {
    return 'approve-button';
  }

  incidentChanged() {
    if (!this.warningDialog && this.incident) {
      this.createApproveConfirmationDialog();
    }
  }

  createApproveConfirmationDialog() {
    let content = `Are you sure you want to approve this incident?`;
    let okText = `Approve`;
    this.createConfirmationDialog(content, this.dialogConfirmationCallback.bind(this), okText);
  }

  async approve() {
    let successfull = await this.store.dispatch(approveIncident(this.incident.id));

    if (typeof successfull === 'boolean' && successfull) {
      this.store.dispatch(showSnackbar('Incident approved'));
      updatePath(`/incidents/list/`);
    }
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.approve();
    }
  }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident approved'));
  }
}

window.customElements.define(ApproveButton.is, ApproveButton);
