/**
@license
*/
import {html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnViewIncident } from '../../reducers/app';
import { store } from '../../redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends connect(store)(IncidentsBaseView) {

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <div class="row-h flex-c" hidden$="[[!canEdit(state.app.offline, incident.unsynced, incident.id)]]">
        <div class="col col-12">
          <a href="/incidents/edit/[[incidentId]]">
            <paper-button raised>
              <iron-icon icon="editor:mode-edit"></iron-icon>
              Edit
            </paper-button>
          </a>
        </div>
      </div>`;
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

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  isOnExpectedPage() {
    return isOnViewIncident(this.state);
  }

}

window.customElements.define('view-incident', ViewIncident);
