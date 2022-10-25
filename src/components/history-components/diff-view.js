/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

import { getNameFromId } from '../common/utils.js';
import DateMixin from '../common/date-mixin.js';
import { store } from '../../redux/store.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import './styles.js';
import HistoryHelpers from './history-helpers.js';
import './history-navigation-links.js';

export class DiffViewBase extends DateMixin(HistoryHelpers(connect(store)(PolymerElement))) {
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
        <div class="layout-horizontal space-between flex-c">
          <div>
            <h3> Changes performed </h3>
          </div>
          <div class="nav-buttons">
            ${this.navButtons}
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

  static get properties() {
    return {
      workingItem: {
        type: Object,
        observer: 'itemChanged'
      },
      changes: Array,
      module: String,
      events: Array
    };
  }

  static get navButtons() {
    return html``;
  }

  _stateChanged(state) {
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
        return getNameFromId(value, 'factors');
      case 'incident_category':
        return getNameFromId(value, 'incidentCategories');
      case 'threat_category':
        return getNameFromId(value, 'threatCategories');
      case 'vehicle_type':
        return getNameFromId(value, 'vehicleTypes');
      case 'criticality':
        return getNameFromId(value, 'criticalities');
      case 'crash_type':
        return getNameFromId(value, 'crashTypes');
      case 'crash_sub_type':
        return getNameFromId(value, 'crashSubTypes');
      case 'person_category':
        return getNameFromId(value, 'personnelCategories');
      case 'person_nationality':
        return getNameFromId(value, 'nationalities');
      case 'person_agency':
        return getNameFromId(value, 'agencies');
      case 'region':
      case 'person_region':
        return getNameFromId(value, 'regions');
      case 'country':
      case 'person_country':
        return getNameFromId(value, 'countries');
      case 'target':
        return getNameFromId(value, 'targets');
        case 'injuries':
          return getNameFromId(value, 'injuries');
      case 'incident_date':
        return this.prettyDate(value);
      default:
        return value;
    }
  }
}
