/**
@license
*/
import { addIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { IncidentModel } from './models/incident-model.js';
import { isOnNewIncident } from '../../reducers/app.js';
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

  _stateChanged(state) {
    super._stateChanged(state);
    if (isOnNewIncident(state)) {
      this.incident = JSON.parse(JSON.stringify(IncidentModel));
    }
  }


  save() {
    this.store.dispatch(addIncident(this.incident));
  }

  isOnExpectedPage() {
    return isOnNewIncident(this.state);
  }
}

window.customElements.define('add-incident', AddIncident);
