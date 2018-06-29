/**
 @license
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';

// import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';

import {addEvent} from '../../actions/events.js';
import {store} from '../store.js';

import '../common/errors-box.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

class AddEvent extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
          <h2>Add new event</h2>

          <errors-box></errors-box>

          <paper-input label="Start date" type="date" value="{{event.start_date}}"></paper-input>
          <paper-input label="End date" type="date" value="{{event.end_date}}"></paper-input>

          <paper-input label="Description" type="text" value="{{event.description}}"></paper-input>
          <paper-input label="Note" type="text" value="{{event.note}}"></paper-input>
          <paper-input label="Location" type="text" value="{{event.location}}"></paper-input>

          <paper-button on-click="save"> Save </paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      event: {
        type: Object,
        value: {}
      }
    };
  }

  _stateChanged(state) {
  }

  save() {
    store.dispatch(addEvent(this.event));
  }

}

window.customElements.define('add-event', AddEvent);
