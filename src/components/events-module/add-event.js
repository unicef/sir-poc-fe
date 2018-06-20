/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';
import { paperInput } from '@polymer/paper-input/paper-input.js';

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
        <section>
          <h2>Add new event</h2>
        </section>
        <section>
          <paper-input label="Start date" type="date" value="{{event.startDate}}"></paper-input>
          <paper-input label="End date" type="date" value="{{event.endDate}}"></paper-input>

          <paper-input label="Description" type="text" value="{{event.description}}"></paper-input>
          <paper-textarea label="Note" value="{{event.note}}"></paper-textarea>
          <paper-input label="Location" type="text" value="{{event.location}}"></paper-input>

        </section>
        <section>
          <h5>Incidents</h5>
          <p><paper-button on-click="save"> Save </paper-button></p>
        </section>
      </div>
    `;
  }

  static get properties() {
    return {
      event: Object,
      value: {}
    };
  }

  _stateChanged(state) {
  }

  save() {
    console.log('save me to redux');
  }
}

window.customElements.define('add-event', AddEvent);
