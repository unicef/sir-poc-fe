/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { getIncidentModel } from '../../models/incident-model';
import { addIncident, setIncidentDraft } from '../../actions/incidents.js';
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
    this.set('incident', this.state.incidents.draft);
  }

  static get actionButtonsTemplate() {
    return html`
      <paper-button raised
                    on-click="saveAndAddImpact"
                    disabled$="[[canNotSave(incident.event, state.app.offline, incidentId)]]">
        Save and add impact
      </paper-button>
      <paper-button raised
                    on-click="resetForm"
                    disabled$="[[canNotSave(incident.event, state.app.offline, incidentId)]]">
        Reset data
      </paper-button>
    `;
  }

  static get observers() {
    return [
      '_incidentChanged(incident.*)'
    ];
  }

  _incidentChanged() {
    setTimeout(() => this.store.dispatch(setIncidentDraft(this.incident)), 100);
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
    this.incident = getIncidentModel();
    this.resetValidations();
  }

  showSuccessMessage() {
    if (this.state.app.offline) {
      this.store.dispatch(showSnackbar('Incident stored. Must be synced when online'));
    } else {
      this.store.dispatch(showSnackbar('Incident saved'));
    }
  }

}

window.customElements.define('add-incident', AddIncident);
