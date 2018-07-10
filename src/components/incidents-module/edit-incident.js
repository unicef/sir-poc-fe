/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident } from '../../actions/incidents.js';

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

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  save() {
    this.store.dispatch(editIncident(this.incident));
  }

  _idChanged(newId) {
    console.log(newId);
    this.set('incident', this.state.incidents.list.find(elem => elem.id == this.incidentId));
    console.log(this.incident);
  }
}

window.customElements.define(EditIncident.is, EditIncident);
