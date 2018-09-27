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


export class PremisesList extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div hidden$="[[!PremisesList.length]]">
        <etools-data-table-header id="listHeader" no-title no-collapse>
          <etools-data-table-column class="col-3">
            Owner
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Facility
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            UN Location
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[premisesList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Owner">
                <span class="truncate">
                  [[getNameFromId(item.agency, 'agencies')]]
                </span>
              </span>
              <span class="col-data col-2" data-col-header-label="Facility">
                <span class="truncate">
                  [[getNameFromId(item.premise_type, 'premisesTypes')]]
                </span>
              </span>
              <span class="col-data col-3" data-col-header-label="UN Location">
                <span class="truncate">
                  [[getNameFromId(item.un_location, 'unLocations')]]
                </span>
              </span>
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.property')]]
                </span>
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/incidents/impact/[[item.incident_id]]/premise/[[item.id]]/"
                      title="Edit premise impact"
                      hidden$="[[_notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
              </span>
            </div>
          </etools-data-table-row>
        </template>
      <div>
      <hr hidden$="[[premisesList.length]]">
    `;
  }

  static get is() {
    return 'premises-list';
  }

  static get properties() {
    return {
      offline: Boolean,
      premisesList: {
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
    this.premisesList = state.incidents.premises.filter(elem => '' + elem.incident_id === incidentId);
    this.offline = state.app.offline;
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced;
  }
}

window.customElements.define(PremisesList.is, PremisesList);
