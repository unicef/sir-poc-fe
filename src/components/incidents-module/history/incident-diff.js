/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';

import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';

export class IncidentDiff extends connect(store)(PolymerElement)  {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
        }
        .label {
          padding-top: 28px;
        }
      </style>

      <div class="card">
        <template is="dom-repeat" items="[[changes]]">
          <div class="row-h flex-c">
            <div class="col col-2 label">
              [[getLabel(item.key)]]
            </div>
            <div class="col col-5">
              <paper-input readonly
                          label="Before"
                          placeholder="<None>"
                          value="[[getReadableValue(item.key, item.before)]]">
              </paper-input>
            </div>
            <div class="col col-5">
              <paper-input readonly
                          label="After"
                          placeholder="<None>"
                          value="[[getReadableValue(item.key, item.after)]]">
              </paper-input>
            </div>
          </div>
        </template>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-button on-tap="hideDiff"> back to list </paper-button>
          </div>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'incident-diff';
  }

  static get properties() {
    return {
      workingItem: {
        type: Object,
        notify: true,
        observer: 'itemChanged',
        value: null
      },
      hidden: {
        type: Boolean,
        value: true,
        notify: true,
        reflectToAttribute: true
      },
      labelsMap: {
        type: Object,
        value: {
          'city': 'City',
          'note': 'Note',
          'event': 'Event',
          'region': 'Region',
          'street': 'Street',
          'target': 'Target',
          'country': 'Country',
          'on_duty': 'On Duty',
          'injuries': 'Injuries',
          'reported': 'Reported',
          'crash_type': 'Crash Type',
          'criticality': 'Criticality',
          'description': 'Description',
          'reported_to': 'Reported To',
          'responsible': 'Responsible Party',
          'vehicle_type': 'Vehicle Type',
          'incident_time': 'Incident Time',
          'incident_date': 'Incident Date',
          'threat_category': 'Threat Category',
          'incident_category': 'Incident Category',
          'contributing_factor': 'Contributing Factor'
        }
      },
      changes: Array,
      events: Array,
      staticData: Object
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _stateChanged(state) {
    this.set('staticData', state.staticData);
    this.set('events', state.events.list);
  }

  _setIncidentId(id) {
    return id;
  }

  hideDiff() {
    this.hidden = true;
    this.workingItem = null;
  }

  itemChanged(item) {
    if (!item) {
      return;
    }

    let changes = Object.keys(item.change).map(key => {
      return {...item.change[key], key};
    });

    changes = changes.filter(elem => {
      return elem.key !== 'version';
    });

    this.hidden = !changes.length;
    this.set('changes', changes);
  }

  getNameFromId(id, staticDataKey) {
    let result = this.staticData[staticDataKey].find(v => v.id === Number(id));

    return result.name || '';
  }

  getLabel(key) {
    return this.labelsMap[key] || key;
  }

  getReadableValue(key, value) {
    if (value === 'None') {
      return value;
    }
    let result;
    switch(key) {
      case 'event':
        let result = this.events.find(e => e.id === value);
        return result.description;
      case 'vehicle_type':
        return this.getNameFromId(value, 'vehicleTypes');
      case 'contributing_factor':
        return this.getNameFromId(value, 'factors');
      case 'incident_category':
        return this.getNameFromId(value, 'incidentCategories');
      case 'threat_category':
        return this.getNameFromId(value, 'threatCategories');
      case 'vehicle_type':
        return this.getNameFromId(value, 'vehicleTypes');
      case 'criticality':
        return this.getNameFromId(value, 'criticalities');
      case 'crash_type':
        return this.getNameFromId(value, 'crashTypes');
      case 'region':
        return this.getNameFromId(value, 'regions');
      case 'target':
        return this.getNameFromId(value, 'targets');
      case 'country':
        return this.getNameFromId(value, 'countries');
      case 'incident_date':
        return value;

      default:
        return value;
    }
  }

}

window.customElements.define(IncidentDiff.is, IncidentDiff);
