/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';

/**
 * @polymer
 * @customElement
 */
class ViewIncident extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  static get properties() {
    return {
      incidentId: {
        type: Number,
        observer: '_idChanged'
      }
    };
  }

  _idChanged(newId) {
    this.set('incident', this.state.incidents.incidents.find(elem => elem.id == this.incidentId ));
  }

}

window.customElements.define('view-incident', ViewIncident);
