/**
 @license
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';

// import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';

import {Endpoints} from '../../config/endpoints.js';
import {updatePath} from '../common/navigation-helper.js';
import {makeRequest} from '../common/request-helper.js';
import {addEvent} from '../../actions/events.js';
import {store} from '../store.js';

import '../common/errors-box.js';
import { scrollToTop } from '../common/content-container-helper.js';

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

          <errors-box server-errors="{{serverReceivedErrors}}"></errors-box>

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
      },
      serverReceivedErrors: Object
    };
  }

  _stateChanged(state) {
  }

  save() {
    makeRequest(Endpoints.newEvent, this.event).then((result) => {
      store.dispatch(addEvent(JSON.parse(result)));
      this.set('event', {});
      updatePath('/events/list/');
    }).catch((error) => {
      this.set('serverReceivedErrors', error.response);
      scrollToTop();
    });
  }
}

window.customElements.define('add-event', AddEvent);
