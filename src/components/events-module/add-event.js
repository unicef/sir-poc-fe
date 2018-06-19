/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { DomRepeat } from '@polymer/polymer/lib/elements/dom-repeat.js';

import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';
import { paperInput } from '@polymer/paper-input/paper-input.js';

import { store } from '../store.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

class AddEvent extends PolymerElement {
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
          <paper-input label="Start date" type="date" on-value-changed="updateEventStartDate"></paper-input>
          <paper-input label="End date" type="date" on-value-changed="updateEventEndDate"></paper-input>

          <paper-input label="Description" type="text" on-value-changed="updateEventDescription"></paper-input>
          <paper-textarea label="Note" on-value-changed="updateEventNote"></paper-textarea>
          <paper-input label="Location" type="text" on-value-changed="updateEventLocation"></paper-input>

        </section>
        <section>
          <h5>Incidents</h5>
          <p><button on-click="openIncidentForm">+ Add new incident </button></p>
        </section>
      </div>
    `;
  }

  static get properties() {
    return {
      _incidentFormOpen: {
        type: Boolean,
        value: false
      },
      incidents: {
        type: Array,
        value: [
          {expanded: true},
          {expanded: true},
          {expanded: true}
        ]
      }
    };
  }

  _stateChanged(state) {
  }

  updateEventStartDate(e) {
    // console.log(e.detail.value);
  }
  updateEventEndDate(e) {
    // console.log(e.detail.value);
  }
  updateEventDescription(e) {
    // console.log(e.detail.value);
  }
  updateEventNote(e) {
    // console.log(e.detail.value);
  }
  updateEventLocation(e) {
    // console.log(e.detail.value);
  }
  openIncidentForm() {
    this.push('incidents', {expanded: true});
  }
}

window.customElements.define('add-event', AddEvent);
