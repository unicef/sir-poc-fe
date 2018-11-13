/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { deleteIncident } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { ButtonsBaseClass } from './buttons-base.js';
import { updatePath } from '../../common/navigation-helper';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class DeleteButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
      </style>
      <paper-button raised
                    on-tap="openDialog"
                    hidden$="[[!_showDelete(incident.status, incident.unsynced, incident.attachments)]]">
        Delete
      </paper-button>
      `;
  }

  static get is() {
    return 'delete-button';
  }

  incidentChanged() {
    if (!this.warningDialog && this.incident) {
      this.createDeleteConfirmationDialog();
    }
  }

  createDeleteConfirmationDialog() {
    let content = `Are you sure you want to delete this incident?`;
    let okText = `Delete`;
    this.createConfirmationDialog(content, okText);
  }

  async delete() {
    let successfull = await this.store.dispatch(deleteIncident(this.incident.id));

    if (typeof successfull === 'boolean' && successfull) {
      this.showSuccessMessage();
      updatePath(`/incidents/list/`);
    }
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.delete();
    }
  }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident deleted'));
  }

  _showDelete(status, unsynced, attachments) {
    if (attachments && attachments.length) {
      return false;// back-end throws errors if attachement are present
    }

    if (unsynced) {
      return true;
    }

    if (status === 'created' && this.hasPermission('delete_incident')) {
      return true;
    }

    return false;
  }
}

window.customElements.define(DeleteButton.is, DeleteButton);
