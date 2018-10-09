/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident, editAttachmentsNotes, deleteIncident,
  deleteIncidentLocally } from '../../actions/incidents.js';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends IncidentsBaseView {
  static get is() {
    return 'edit-incident';
  }

  static get actionButtonsTemplate() {
    return html`
      <paper-button raised
        hidden$="[[!_showDelete(incident.status, incident.unsynced, state.app.offline, incident.attachments)]]"
        on-click="openDeleteConfirmation">
        Delete
      </paper-button>

      <paper-dialog id="delConfirm">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this incident?</p>
        <div class="buttons">
          <paper-button class="white-bg smaller" dialog-dismiss>No</paper-button>
          <paper-button class="smaller" on-tap="deleteIncident" dialog-confirm autofocus>Yes</paper-button>
        </div>
    </paper-dialog>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  save() {
    if (!this.validate()) {
      return;
    }

    this.store.dispatch(editAttachmentsNotes(this.incident)).then(() =>{
      this.store.dispatch(editIncident(this.incident));
    });
  }

  openDeleteConfirmation() {
    this.shadowRoot.querySelector('#delConfirm').opened = true;
  }

  deleteIncident() {
    if (isNaN(this.incidentId)) {
      this.store.dispatch(deleteIncidentLocally(this.incidentId));
    } else {
      this.store.dispatch(deleteIncident(this.incidentId));
    }
  }

  _showDelete(status, unsynced, offline, attachments) {
    if (attachments && attachments.length) {
      return false;// bk err when there are att
    }

    if (offline) {
      if (unsynced) {
        return true;
      }
      return false;
    }

    if (status === 'created' || unsynced) {
      return true;
    }
    return false;
  }

}

window.customElements.define(EditIncident.is, EditIncident);
