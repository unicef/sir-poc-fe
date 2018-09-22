/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { editIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnViewIncident } from '../../reducers/app';

/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends IncidentsBaseView {
  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <div class="row-h">
        <div class="col-12">
          <a href="/incidents/edit/[[incidentId]]" hidden$="[[!canEdit(state.app.offline, incident.unsynced, incident.id)]]">
            <paper-button raised>
              Edit
            </paper-button>
          </a>
          <paper-button raised
                    on-click="submit"
                    hidden$="[[canNotSubmit(incident.event, state.app.offline, incidentId, incident.status)]]">
            Submit
          </paper-button>
        </div>
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  isOnExpectedPage() {
    return isOnViewIncident(this.state);
  }

  submit() {
    if (!this.validate()) {
      return;
    }

    this.incident.status = 'submitted';
    this.store.dispatch(editIncident(this.incident));
  }

  canEdit(offline, unsynced, itemId) {
    if (!offline) {
      return true;
    }
    if (unsynced && isNaN(itemId)) {
      return true;
    }
    return false;
  }

  canNotSubmit(eventId, offline, incidentId, status) {
    if (!this.canNotSave(eventId, offline, incidentId)) {
      return false;
    }

    return status !== 'created';
  }
}

window.customElements.define('view-incident', ViewIncident);
