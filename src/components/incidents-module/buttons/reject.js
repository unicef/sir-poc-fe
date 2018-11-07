/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { rejectIncident } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { updatePath } from '../../common/navigation-helper';
import { hasPermission } from '../../common/utils';
import { ButtonsBaseClass } from './buttons-base.js';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class RejectButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
      </style>
      <paper-button raised
                    on-tap="validate"
                    hidden$="[[isHidden()]]">
        Reject
      </paper-button>
      `;
  }

  static get is() {
    return 'reject-button';
  }

  static get properties() {
    return {
      ...super.properties,
      commentText: {
        type: String,
        value: ''
      }
    }
  }

  isHidden() {
    return !hasPermission('approve_incident');
  }

  validate() {
    if (this.commentText.length) {
      this.openDialog();
    }
  }

  incidentChanged() {
    if (!this.warningDialog && this.incident) {
      this.createRejectConfirmationDialog();
    }
  }

  createRejectConfirmationDialog() {
    let content = `Are you sure you want to reject this incident?`;
    let okText = 'Reject';
    this.createConfirmationDialog(content, okText);
  }

  async reject() {
    let data = {
      incident: this.incident.id,
      comment: this.commentText
    };

    let successfull = await this.store.dispatch(rejectIncident(data));
    if (typeof successfull === 'boolean' && successfull) {
      this.store.dispatch(showSnackbar('Incident rejected'));
      updatePath(`/incidents/list/`);
    }
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.reject();
    }
  }
}

window.customElements.define(RejectButton.is, RejectButton);
