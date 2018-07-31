/**
@license
*/
import { addIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';
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

  save() {
    this.store.dispatch(addIncident(this.incident));
  }

  isOnExpectedPage() {
    return isOnNewIncident(this.state);
  }
}

window.customElements.define('add-incident', AddIncident);
