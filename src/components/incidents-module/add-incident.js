/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { IncidentModel } from './models/incident-model';
import { addIncident } from '../../actions/incidents.js';
import { showSnackbar } from '../../actions/app.js';
import { updatePath } from '../common/navigation-helper.js';
/**
 * @polymer
 * @customElement
 */
class AddIncident extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new incident';
  }

  static get actionButtonsTemplate() {
    return html`
      <paper-button raised
                    on-click="saveAndAddImpact"
                    disabled$="[[canNotSave(incident.event, state.app.offline, incidentId)]]">
        Save and add impact
      </paper-button>
    `;
  }

  async save() {
    if (!this.validate()) {
      return;
    }
    let createdId = await this.store.dispatch(addIncident(this.incident));
    if (createdId) {
      scrollToTop();
      this.resetForm();
      this.resetValidations();
      this.showSuccessMessage();
    }
  }

  async saveAndAddImpact() {
    if (!this.validate()) {
      return;
    }
    let incidentId = await this.store.dispatch(addIncident(this.incident));
    if (incidentId) {
      this.resetForm();
      updatePath(`/incidents/impact/${incidentId}/list`);
    }
  }

  resetForm() {
    this.incident = JSON.parse(JSON.stringify(IncidentModel));
  }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident saved'));
  }

}

window.customElements.define('add-incident', AddIncident);
