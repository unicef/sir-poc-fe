/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';

import DateMixin from '../../common/date-mixin.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';
import './styles.js';
import HistoryHelpers from './history-helpers.js';
import './history-navigation-links.js';

export class IncidentDiff extends DateMixin(HistoryHelpers(connect(store)(PolymerElement))) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles history-common-styles">
        :host {
          @apply --layout-vertical;
        }
        .label {
          padding-top: 28px;
        }
      </style>

      <div class="card">
        <div class="row-h flex-c">
          <div class="col-11">
            <h3> Changes performed </h3>
          </div>
          <div class="col-1 nav-buttons">
            <history-navigation-links page="diff" working-item="[[workingItem]]"></history-navigation-links>
          </div>
        </div>
        <template is="dom-repeat" items="[[changes]]">
          <div class="row-h flex-c">
            <div class="col col-2 label">
              [[getLabelForField(item.key)]]
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
        observer: 'itemChanged'
      },
      changes: Array,
      events: Array,
      staticData: Object
    };
  }

  _stateChanged(state) {
    this.set('staticData', state.staticData);
    this.set('events', state.events.list);
  }

  itemChanged(item) {
    if (!item) {
      return;
    }

    let changes = Object.keys(item.change).map((key) => {
      return {...item.change[key], key};
    });

    changes = changes.filter((elem) => {
      return elem.key !== 'version';
    });

    this.set('changes', changes);
  }

  getNameFromId(id, staticDataKey) {
    let result = this.staticData[staticDataKey].find(v => v.id === Number(id));

    return result.name || '';
  }

  getReadableValue(key, value) {
    if (value === 'None') {
      return value;
    }
    let result;
    switch (key) {
      case 'event':
        result = this.events.find(e => e.id === value);
        return result.description;
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
        return this.prettyDate(value);
      default:
        return value;
    }
  }

}

window.customElements.define(IncidentDiff.is, IncidentDiff);
