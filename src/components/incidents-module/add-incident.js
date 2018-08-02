/**
@license
*/
import { addIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnNewIncident } from '../../reducers/app.js';
import { IncidentModel } from './models/incident-model';
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

  async save() {
    let successfull = await this.store.dispatch(addIncident(this.incident));
    if (typeof successfull === 'boolean' && successfull) {
      this.resetForm();
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
