/**
@license
*/
import { addIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { IncidentModel } from './models/incident-model.js';

/**
 * @polymer
 * @customElement
 */
class AddIncident extends IncidentsBaseView {
  static get observers() {
    return [
      'stateChanged(state)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new incident';
  }

  stateChanged() {
    if (this.isVisible()  && onNewIncident(this.state)) {
      this.incident = JSON.parse(JSON.stringify(IncidentModel));
    }
  }


  save() {
    this.store.dispatch(addIncident(this.incident));
  }
}

window.customElements.define('add-incident', AddIncident);
