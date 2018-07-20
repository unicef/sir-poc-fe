/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident, syncIncident, fetchIncident } from '../../actions/incidents.js';
import { selectIncident } from '../../reducers/incidents.js';
import { isOnEditIncident } from '../../reducers/app.js';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends IncidentsBaseView {
  static get is() {
    return 'edit-incident';
  }

  static get properties() {
    return {
      incidentId: {
        type: Number,
        observer: '_idChanged'
      }
    };
  }

  static get observers() {
    return [
      'stateChanged(state)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  stateChanged() {
    if (!isOnEditIncident(this.state)) {
      return;
    }
    this.set('incident', selectIncident(this.state));
  }

  save() {
    if (this.incident.unsynced && !this.state.app.offline) {
      this.store.dispatch(syncIncident(this.incident));
    } else {
      this.store.dispatch(editIncident(this.incident));
    }
  }

  _idChanged(newId) {
    if (!newId || !isOnEditIncident(this.state)) {
      return;
    }
    if (!this.state.app.offline) {
      this.store.dispatch(fetchIncident(this.incidentId));
    }
  }
}

window.customElements.define(EditIncident.is, EditIncident);
