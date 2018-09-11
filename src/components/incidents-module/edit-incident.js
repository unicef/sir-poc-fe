/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident } from '../../actions/incidents.js';
import { isOnEditIncident } from '../../reducers/app.js';
import { store } from '../../redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends connect(store)(IncidentsBaseView) {
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

    this.store.dispatch(editIncident(this.incident));
  }

  isOnExpectedPage() {
    return isOnEditIncident(this.state);
  }
}

window.customElements.define(EditIncident.is, EditIncident);
