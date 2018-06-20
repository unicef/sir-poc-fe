/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';
import { paperInput } from '@polymer/paper-input/paper-input.js';

import { addEvent } from '../../actions/events.js';
import { store } from '../store.js';

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

          <paper-input label="Start date" type="date" value="{{event.startDate}}"></paper-input>
          <paper-input label="End date" type="date" value="{{event.endDate}}"></paper-input>

          <paper-input label="Description" type="text" value="{{event.description}}"></paper-input>
          <paper-textarea label="Note" value="{{event.note}}"></paper-textarea>
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
    // console.log('new state', state);
  }

  save() {
    // should this.event not be passed by reference?
    store.dispatch(addEvent(this.event));
    this.set('event', {});
  }
}

window.customElements.define('add-event', AddEvent);
