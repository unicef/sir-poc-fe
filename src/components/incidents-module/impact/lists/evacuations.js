/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icons/editor-icons.js';

import 'etools-data-table';
import { getNameFromId } from '../../../common/utils.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';


export class EvacuationsList extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }

        etools-data-table-row[no-collapse] {
          padding-left: 32px;
        }
      </style>

      <div hidden$="[[!evacuationsList.length]]">
        <etools-data-table-header id="listHeader" no-title>
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Agency
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            S(I)
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            S(N)
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            D(I)
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            D(N)
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[evacuationsList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.evacuation')]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Agency">
                <span class="truncate">
                  [[getNameFromId(item.agency, 'agencies')]]
                </span>
              </span>
              <span class="col-data col-1" data-col-header-label="S(I)">
                <span class="truncate">
                  [[item.number_international]]
                </span>
              </span>
              <span class="col-data col-1" data-col-header-label="S(N)">
                <span class="truncate">
                  [[item.number_national]]
                </span>
              </span>
              <span class="col-data col-1" data-col-header-label="D(I)">
                <span class="truncate">
                  [[item.number_international_dependants]]
                </span>
              </span>
              <span class="col-data col-1" data-col-header-label="D(N)">
                <span class="truncate">
                  [[item.number_national_dependants]]
                </span>
              </span>
              <span class="col-data col-2" data-col-header-label="Actions">
                  <a href="/incidents/impact/1/evacuation/[[item.id]]/"
                      title="Edit evacuation"
                      hidden$="[[_notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
              </span>
            </div>
          </etools-data-table-row>
        </template>
      <div>
      <hr hidden$="[[evacuationsList.length]]">
    `;
  }

  static get is() {
    return 'evacuations-list';
  }

  static get properties() {
    return {
      offline: Boolean,
      evacuationsList: {
        type: Array,
        value: []
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.getNameFromId = getNameFromId;
  }

  _stateChanged(state) {
    let incidentId = state.app.locationInfo.incidentId;
    this.evacuationsList = state.incidents.evacuations.filter(elem => '' + elem.incident_id === incidentId);
    this.offline = state.app.offline;
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced;
  }
}

window.customElements.define(EvacuationsList.is, EvacuationsList);
