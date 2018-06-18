import { html } from '@polymer/lit-element';
import { LitElement } from '@polymer/lit-element';

import { paperInput } from '@polymer/paper-input/paper-input.js';

// These are the shared styles needed by this element.
import { SharedStyles } from '../styles/shared-styles.js';

class incidentForm extends LitElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section hidden="${!incident.expanded}">
        <p>${incident.incident_date}, ${incident.incident_time}</p>
      </section>
      <section hidden="${incident.expanded}">
        <paper-input type="date" label="Date" value="${incident.incident_date}"></paper-input>
        <paper-input type="time" label="Time" value="${incident.incident_time}"></paper-input>
        <paper-input type="text" label="Country" value="${incident.country}"></paper-input>
        <paper-input type="text" label="Region" value="${incident.region}"></paper-input>
        <paper-input type="text" label="City" value="${incident.city}"></paper-input>
        <button on-click="${(e) => incident.expanded = false }">Done</button>
      </section>
    `;
  }

  static get properties() {
    return {
      incident: {
        type: Object,
        value: {}
      }
    }
  }
}

window.customElements.define('incident-form', incidentForm);
