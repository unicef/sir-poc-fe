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


export class NonUnPersonnelList extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div hidden$="[[!personnelList.length]]">
        <etools-data-table-header id="listHeader" no-title no-collapse>
          <etools-data-table-column class="col-4">
            Name
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Address
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[personnelList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]">
            <div slot="row-data">
              <span class="col-data col-4" data-col-header-label="Name">
                [[item.first_name]] [[item.last_name]]
              </span>
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.person')]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Address">
                  [[item.address]]
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/incidents/impact/[[item.incident_id]]/non-un/[[item.id]]/"
                      title="Edit non-UN Personnel impact"
                      hidden$="[[_notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
              </span>
            </div>
          </etools-data-table-row>
        </template>
      <div>
      <hr hidden$="[[personnelList.length]]">
    `;
  }

  static get is() {
    return 'non-un-personnel-list';
  }

  static get properties() {
    return {
      offline: Boolean,
      personnelList: {
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
    this.offline = state.app.offline;
    let incidentId = state.app.locationInfo.incidentId;
    this.personnelList = state.incidents.personnel.filter(elem => '' + elem.incident_id === incidentId && !elem.un_official);
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced;
  }
}

window.customElements.define(NonUnPersonnelList.is, NonUnPersonnelList);
