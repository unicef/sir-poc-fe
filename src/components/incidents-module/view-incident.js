/**
@license
*/
import {html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnViewIncident } from '../../reducers/app';

/**
 * @polymer
 * @customElement
 */
class ViewIncident extends IncidentsBaseView {

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <div class="row-h flex-c" hidden$="[[state.app.offline]]">
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
