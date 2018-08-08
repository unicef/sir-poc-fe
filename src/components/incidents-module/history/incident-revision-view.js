/**
@license
*/
import { IncidentsBaseView } from '../incidents-base-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import HistoryHelpers from './history-helpers.js';
import './history-navigation-links.js';
import './styles.js';

/**
 * @polymer
 * @customElement
 */
class IncidentRevisionView extends HistoryHelpers(IncidentsBaseView) {
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
      <div class="row-h flex-c">
        <div class="col-11">
          <h3> View incident at this revision </h3>
        </div>

        <div class="col-1 nav-buttons">
          <history-navigation-links page="view" working-item="[[workingItem]]"></history-navigation-links>
        </div>
      </div>
    `;
  }

  _idChanged() {
  }

  _setIncidentId() {
  }

  isOnExpectedPage() {
    return true;
  }

  _itemChanged(workingItem) {
    if (!workingItem) {
      return;
    }
    this.incident = workingItem.data;
  }
}

window.customElements.define(IncidentRevisionView.is, IncidentRevisionView);
