/**
@license
*/
import { EventsBaseView } from '../events-base-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../../history-components/history-navigation-links.js';
import '../../history-components/styles.js';
import './history-navigation-links.js';
/**
 * @polymer
 * @customElement
 */
class EventRevisionView extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.useBasicLayout = true;
    this.readonly = true;
  }

  static get is() {
    return 'event-revision-view';
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
          <h2> View event at this revision </h2>
        </div>

        <div class="nav-buttons">
          <event-history-navigation-links page="view" module="events" working-item="[[workingItem]]">
          </event-history-navigation-links>
        </div>
      </div>
    `;
  }

  _idChanged() {
  }

  _setEventId() {
  }

  _itemChanged(workingItem) {
    if (!workingItem) {
      return;
    }
    this.event = workingItem.data;
  }
}

window.customElements.define(EventRevisionView.is, EventRevisionView);
