/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';
import { paperInput } from '@polymer/paper-input/paper-input.js';

import { makeRequest } from '../common/request-helper.js';
import { addEvent } from '../../actions/events.js';
import { store } from '../store.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

class ViewEvent extends connect(store)(PolymerElement) {
 static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
      <div class="card">
          <h2>View event</h2>

          <paper-input label="Start date" type="date" readonly value="{{event.start_date}}"></paper-input>
          <paper-input label="End date" type="date" readonly value="{{event.end_date}}"></paper-input>

          <paper-input label="Description" type="text" readonly value="{{event.description}}"></paper-input>
          <paper-textarea label="Note" readonly value="{{event.note}}"></paper-textarea>
          <paper-input label="Location" type="text" readonly value="{{event.location}}"></paper-input>

      </div>
    `;
  }

  static get properties() {
    return {
      event: {
        type: Object,
        value: {}
      },
      eventId: Number,
      addEventEndpointName: {
        type: String,
        value: 'newEvent'
      }
    };
  }

  _stateChanged(state) {
    // TODO: fix ==
    this.set('event', state.events.events.find(ev => ev.id == this.eventId ));
  }

}

window.customElements.define('view-event', ViewEvent);