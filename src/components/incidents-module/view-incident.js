/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { showSnackbar } from '../../actions/app.js';
import { submitIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';

/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends IncidentsBaseView {
  static get goToSubmitBtnTmpl() {
    // language=HTML
    return html`
      <paper-button raised
                    on-tap="openSubmitConfirmation">
            Submit
      </paper-button>
    `;
  }

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <a href="/incidents/edit/[[incidentId]]" 
         hidden$="[[!canEdit(state.app.offline, incident.unsynced, incident.id)]]">
        <paper-button raised>
          Edit
        </paper-button>
      </a>
      
      <paper-button raised
                on-tap="openSubmitConfirmation">
        Submit
      </paper-button>
        
      <paper-dialog id="submitConfirm">
        <h2>Confirm Submit</h2>
        <p>Are you sure you want to submit this incident?</p>
        <div class="buttons">
          <paper-button class="white-bg smaller" dialog-dismiss>Cancel</paper-button>
          <paper-button class="smaller" on-tap="submit" dialog-confirm autofocus>Submit</paper-button>
        </div>
      </paper-dialog>
      `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  openSubmitConfirmation() {
    this.shadowRoot.querySelector('#submitConfirm').opened = true;
  }

  async submit() {
    if (!this.validate()) {
      return;
    }

    let result = await this.store.dispatch(submitIncident(this.incident));
    if (result) {
      scrollToTop();
      this.showSuccessMessage();
    }
  }

  canEdit(offline, unsynced, itemId) {
    if (!offline) {
      return true;
    }
    if (unsynced && isNaN(itemId)) {
      return true;
    }
    return false;
  }

  // canNotSubmit(offline, status) {
  //   return status !== 'created' || offline;
  // }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident submitted'));
  }

  // canNotSubmit(offline, status, unsynced, id) {
  //   return !this.canEdit(offline, unsynced, id) ||
  //       status !== 'created' || offline;
  // }
}

window.customElements.define('view-incident', ViewIncident);
