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
      </style>

      <div class="card">
        <template is="dom-repeat" items="[[changes]]">
          <div class="row-h flex-c">
            <div class="col col-2">
              <p>[[item.key]]</p>
            </div>
            <div class="col col-5">
              <paper-input readonly
                          label="Before"
                          value="[[getReadableValue(item.key, item.before)]]">
              </paper-input>
            </div>
            <div class="col col-5">
              <paper-input readonly
                          label="After"
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
      changes: Array,
      staticData: Object
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _stateChanged(state) {
    this.set('staticData', state.staticData);
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

    this.hidden = !(changes.length > 1);
    this.set('changes', changes);
  }

  getReadableValue(key, value) {
    if (value === 'None') {
      return value;
    }
    switch(key) {
      case 'vehicle_type':
        let result = this.staticData.vehicleTypes.find(v => v.id === value);
        return result.name;
      case 'contributing_factor':
        let result = this.staticData.contributingFactors.find(v => v.id === value);
        return result.name;
      default:
        return '<not defined yet>';
    }
  }

}

window.customElements.define(IncidentDiff.is, IncidentDiff);
