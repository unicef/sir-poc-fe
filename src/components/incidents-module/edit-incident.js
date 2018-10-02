/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident, editAttachmentsNotes } from '../../actions/incidents.js';

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

    this.store.dispatch(editAttachmentsNotes(this.incident)).then(() =>{
      this.store.dispatch(editIncident(this.incident));
    });
  }

}

window.customElements.define(EditIncident.is, EditIncident);
