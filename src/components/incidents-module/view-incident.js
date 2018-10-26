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

  // on-tap="openSubmitConfirmation"

  static get submitBtnTmpl() {
    // language=HTML
    return html`
      <paper-button raised
                    hidden$="[[!canSubmit(state.app.offline, incident.status, incident.unsynced)]]" 
                    on-tap="showSubmitConfirmationDialog">
        Submit
      </paper-button>
    `;
  }

  static get submitIncidentTmpl() {
    // language=HTML
    return html`

      ${this.submitBtnTmpl}

      <!--<paper-dialog id="submitConfirm">-->
        <!--<h2>Confirm Submit</h2>-->
        <!--<p>Are you sure you want to submit this incident?</p>-->
        <!--<div class="buttons">-->
          <!--<paper-button class="white-bg smaller" dialog-dismiss>Cancel</paper-button>-->
          <!--<paper-button class="smaller" on-tap="submit" dialog-confirm autofocus>Submit</paper-button>-->
        <!--</div>-->
      <!--</paper-dialog>-->
      
      <!--<etools-dialog -->
                    <!--id="submitConfirm" -->
                    <!--opened="{{dialogOpened}}" -->
                    <!--on-close="onCloseActionHandler" -->
                    <!--ok-btn-text="Submit"-->
                    <!--dialog-title="Confirm Submit" -->

        <!--<p>Are you sure you want to submit this incident?</p>-->
        <!---->
      <!--</etools-dialog>-->
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

    this.submitWarningDialogContent = document.createElement('div');
    this.submitWarningDialogContent.setAttribute('id', 'submitWarningContent');
    // let submitWarningContent.innerHTML = 'Are you sure you want to submit this incident?';

    const config = {
      title: 'Confirm Submit',
      size: 'sm',
      okBtnText: 'Submit',
      cancelBtnText: 'Cancel',
      closeCallback: this._dialogConfirmationCallback.bind(this),
      content: 'Are you sure you want to Submit this incident?'
    };

    this.warningDialog = this.createDialog(config);

    // this.warningDialog = this.createDialog('Confirm Submit', 'sm', 'Submit', 'Cancel',
    //     this._dialogConfirmationCallback.bind(this), 'Are you sure you want to Submit this incident?');

    this.warningDialog.updateStyles({'--etools-dialog-confirm-btn-bg': 'var(--button-primary-bg-color)'});
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
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

    if (!this.submitWarningDialogContent) {
      // console.log('#deleteWarningContent element not found!', 'pmp partner status change');
      return;
    }
    let warningMessage = 'Are you sure you want to Submit this incident?';
    this.submitWarningDialogContent.innerHTML = warningMessage;
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
    return !unsynced && status === 'created' && !offline;
  }

  _dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.submit();
    }
  }
}

window.customElements.define('view-incident', ViewIncident);
