import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { store } from '../../redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
class IncidentReview extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }
      </style>
        <div class="card">
         <h2> No, review. </h2>
        </div>
      </div>

    `;
  }

  static get is() {
    return 'incident-review';
  }

  static get properties() {
    return {
      incidentId: {
        type: String,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      },
      offline: {
        type: Boolean,
        computed: '_setIsOffline(state.app.offline)'
      },
      state: {
        type: Object
      },
      incident: Object
    };
  }

  static get observers() {
    return [
    ];
  }

  _idChanged() {
    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));
  }

  _stateChanged(state) {
    this.state = state;
  }

  _setIsOffline(offline) {
    return offline;
  }

  _setIncidentId(id) {
    return id;
  }

}

window.customElements.define(IncidentReview.is, IncidentReview);
