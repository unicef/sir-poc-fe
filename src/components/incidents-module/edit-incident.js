
/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { updatePath } from '../common/navigation-helper';
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident,
         editAttachmentsNotes
       } from '../../actions/incidents.js';
import './buttons/delete.js';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends IncidentsBaseView {
  static get is() {
    return 'edit-incident';
  }

  static get deleteDraftTmpl() {
    return html`
      <delete-button incident="[[incident]]"
                     hidden$="[[state.app.offline]]">
      </delete-button>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  redirectIfNotEditable(incident, visible) {
    if (!incident || !visible) {
      return;
    }

    if (!this.canEdit(this.state.app.offline, incident.status, incident.unsynced)) {
      updatePath(`/incidents/view/${incident.id}/`);
    }
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
