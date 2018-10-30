/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
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

  static get submitBtnTmpl() {
    // language=HTML
    return html`
      <paper-button raised
                    hidden$="[[!canSubmit(state.app.offline, incident.status, incident.unsynced)]]"
                    on-tap="showSubmitConfirmationDialog">
        [[getLabel(incident.status)]]
      </paper-button>
    `;
  }

  static get submitIncidentTmpl() {
    // language=HTML
    return html`

      ${this.submitBtnTmpl}

      `;
  }

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <a href="/incidents/edit/[[incidentId]]"
         hidden$="[[!canEdit(state.app.offline, incident.status, incident.unsynced)]]">
        <paper-button raised>
          Edit
        </paper-button>
      </a>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
    this.createSubmitConfirmationDialog();
  }

  getLabel(status) {
    return status === 'created' ? 'Submit' : 'Resubmit';
  }

  createSubmitConfirmationDialog() {
    let content = `Are you sure you want to ${this.getLabel(this.incident.status).toLowerCase()} this incident?`;
    let okText = this.getLabel(this.incident.status);
    this.createConfirmationDialog(content, okText);
  }

  showSubmitConfirmationDialog() {
    if (!this.warningDialog) {
      // console.log('warningDialog not created!', 'pmp partner status change');
      return;
    }
    this.warningDialog.opened = true;
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

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident submitted'));
  }

  canSubmit(offline, status, unsynced) {
    return !unsynced && (status === 'created' || status === 'rejected') && !offline;
  }

  _dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.submit();
    }
  }
}

window.customElements.define('view-incident', ViewIncident);
