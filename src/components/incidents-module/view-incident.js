/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { showSnackbar } from '../../actions/app.js';
import { submitIncident } from '../../actions/incidents.js';
import { IncidentsBaseView } from './incidents-base-view.js';

/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends IncidentsBaseView {
  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <div class="row-h flex-c padd-top" hidden$="[[!canEdit(state.app.offline, incident.unsynced, incident.id)]]">
        <div class="col col-12">
          <a href="/incidents/edit/[[incidentId]]">
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

  async submit() {
    if (!this.validate()) {
      return;
    }

    let result = await this.store.dispatch(submitIncident(this.incident));
    if (result) {
      scrollToTop();
      this.showSuccessMessage();
    }
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

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident submitted'));
  }
}

window.customElements.define('view-incident', ViewIncident);
