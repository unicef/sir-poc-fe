/**
@license
*/

import { html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { PageViewElement } from '../common/page-view-element.js';
import { store } from '../store.js';


import { paperInput } from '@polymer/paper-input/paper-input.js';
import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';

// These are the shared styles needed by this element.
import { SharedStyles } from '../styles/shared-styles.js';

class NewEventView extends connect(store)(PageViewElement) {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Add new event</h2>
      </section>
      <section>
        <paper-input label="Start date" type="date" on-value-changed="${this.updateEventStartDate}"></paper-input>
        <paper-input label="End date" type="date" on-value-changed="${this.updateEventEndDate}"></paper-input>

        <paper-input label="Description" type="text" on-value-changed="${this.updateEventDescription}"></paper-input>
        <paper-textarea label="Note" on-value-changed="${this.updateEventNote}"></paper-textarea>
        <paper-input label="Location" type="text" on-value-changed="${this.updateEventLocation}"></paper-input>



      </section>
      <section>
        <p> Here goes the incident add form </p>
      </section>
    `;
  }

  static get properties() {
    return {};
  }

  _stateChanged(state) {
  }

  updateEventStartDate(e) {
    console.log(e.detail.value);
  }
  updateEventEndDate(e) {
    console.log(e.detail.value);
  }
  updateEventDescription(e) {
    console.log(e.detail.value);
  }
  updateEventNote(e) {
    console.log(e.detail.value);
  }
  updateEventLocation(e) {
    console.log(e.detail.value);
  }
}

window.customElements.define('new-event', NewEventView);
