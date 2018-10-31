/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import './buttons/submit.js';
/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends IncidentsBaseView {
  static get submitIncidentTmpl() {
    // language=HTML
    return html`
      <submit-button incident="[[incident]]"
                     hidden$="[[!canSubmit(state.app.offline, incident.status, incident.unsynced)]]">
      </submit-button>`;
  }

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <a href="/incidents/edit/[[incidentId]]"
         hidden$="[[!canEdit(state.app.offline, incident.status, incident.unsynced)]]">
        <paper-button raised>
          Edit
        </paper-button>
      </a>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  canSubmit(offline, status, unsynced) {
    return !unsynced && (status === 'created' || status === 'rejected') && !offline;
  }
}

window.customElements.define('view-incident', ViewIncident);
