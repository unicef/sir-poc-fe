/**
@license
*/
import { IncidentsBaseView } from '../incidents-base-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../../history-components/history-navigation-links.js';
import '../../history-components/styles.js';

/**
 * @polymer
 * @customElement
 */
class IncidentRevisionView extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
  }

  static get is() {
    return 'incident-revision-view';
  }

  static get properties() {
    return {
      workingItem: {
        type: Object,
        observer: '_itemChanged'
      }
    };
  }
  static get getTitleTemplate() {

    return html`
      <style include="history-common-styles"></style>
      <div class="layout-horizontal space-between flex-c">
        <div>
          <h2> View incident at this revision </h2>
        </div>

        <div class="nav-buttons">
          <history-navigation-links page="view" module="incidents" working-item="[[workingItem]]">
          </history-navigation-links>
        </div>
      </div>
    `;
  }

  _idChanged() {
  }

  _setIncidentId() {
  }

  _itemChanged(workingItem) {
    if (!workingItem) {
      return;
    }
    this.incident = workingItem.data;
  }
}

window.customElements.define(IncidentRevisionView.is, IncidentRevisionView);
