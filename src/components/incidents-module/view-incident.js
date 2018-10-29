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

  static get submitBtnTmpl() {
    // language=HTML
    return html`
      <paper-button raised
                    hidden$="[[!canSubmit(state.app.offline, incident.status, incident.unsynced)]]"
                    on-tap="openSubmitConfirmation">
        [[getLabel(incident.status)]]
      </paper-button>
    `;
  }

  static get submitIncidentTmpl() {
    // language=HTML
    return html`

      ${this.submitBtnTmpl}

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

  ready() {
    super.ready();

    const submitWarningDialogContent = document.createElement('span');
    submitWarningDialogContent.innerHTML = 'Are you sure you want to submit this incident?';

    const config = {
      size: 'sm',
      okBtnText: 'Submit',
      cancelBtnText: 'Cancel',
      closeCallback: this._dialogConfirmationCallback.bind(this),
      content: submitWarningDialogContent
    };

    this.warningDialog = this.createDynamicDialog(config);

    this.warningDialog.updateStyles({'--etools-dialog-confirm-btn-bg': 'var(--button-primary-bg-color)'});
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  getLabel(status) {
    return status === 'created' ? 'Submit' : 'Resubmit';
  }

  openSubmitConfirmation() {
    this.shadowRoot.querySelector('#submitConfirm').opened = true;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeDialog(this.warningDialog);
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
