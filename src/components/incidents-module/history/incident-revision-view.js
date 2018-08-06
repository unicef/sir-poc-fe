/**
@license
*/
import { IncidentsBaseView } from '../incidents-base-view.js';

/**
 * @polymer
 * @customElement
 */
class IncidentRevisionView extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident revision';
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
    }
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
