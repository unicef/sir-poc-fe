/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnNewIncident } from '../../reducers/app.js';
import { IncidentModel } from './models/incident-model';
import { addIncident } from '../../actions/incidents.js';
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
    let successfull = await this.store.dispatch(addIncident(this.incident));
    if (successfull) {
      this.resetForm();
      updatePath('/incidents/list/');
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

  isOnExpectedPage() {
    return isOnNewIncident(this.state);
  }

  resetForm() {
    this.incident = JSON.parse(JSON.stringify(IncidentModel));
  }

}

window.customElements.define('add-incident', AddIncident);
