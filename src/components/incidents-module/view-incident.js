/**
@license
*/

import '@polymer/iron-icons/editor-icons.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnViewIncident } from '../../reducers/app';

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

  isOnExpectedPage() {
    return isOnViewIncident(this.state);
  }

  static get getTitleTemplate() {
    return html`
      <style>
        .nav-buttons {
          display: inline-flex;
          align-items: center;
        }
      </style>
      <div class="layout-horizontal flex-c">
        <div class="col-11">
          <h2>[[title]]</h2>
        </div>
        <div class="col-1 nav-buttons">
          <a href="incidents/edit/[[incidentId]]" title="Edit Incident">
            <iron-icon icon="editor:mode-edit"></iron-icon>
          </a>
        </div>
      </div>
    `;
  }
}

window.customElements.define('view-incident', ViewIncident);
