/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident, syncIncident } from '../../actions/incidents.js';
import { isOnEditIncident } from '../../reducers/app.js';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends IncidentsBaseView {
  static get is() {
    return 'edit-incident';
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  save() {
    if (!this.validate()) {
      return;
    }
    if (this.incident.unsynced && !this.state.app.offline) {
      this.store.dispatch(syncIncident(this.incident));
    } else {
      this.store.dispatch(editIncident(this.incident));
    }
  }

  isOnExpectedPage() {
    return isOnEditIncident(this.state);
  }
}

window.customElements.define(EditIncident.is, EditIncident);
