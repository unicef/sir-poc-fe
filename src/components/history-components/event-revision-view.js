/**
@license
*/
import { EventsBaseView } from '../events-module/events-base-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import './history-navigation-links.js';
import './styles.js';

/**
 * @polymer
 * @customElement
 */
class EventRevisionView extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
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
          <history-navigation-links page="view" module="events" working-item="[[workingItem]]"></history-navigation-links>
        </div>
      </div>
    `;
  }

  _idChanged() {
  }

  _setEventId() {
  }

  isOnExpectedPage() {
    return true;
  }

  _itemChanged(workingItem) {
    if (!workingItem) {
      return;
    }
    this.event = workingItem.data;
  }
}

window.customElements.define(EventRevisionView.is, EventRevisionView);
