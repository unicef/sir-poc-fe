/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../../common/permissions-base-class';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import 'etools-data-table';
import { getNameFromId } from '../../../common/utils.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';

export class NonUnPersonnelList extends connect(store)(PermissionsBase) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>

      <div hidden$="[[!personnelList.length]]">
        <etools-data-table-header id="listHeader" no-title no-collapse low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-2">
            Name
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-6">
            Address
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[personnelList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]"
                                 low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data">
              <span class="col-data col-2" data-col-header-label="Name">
                [[item.person.first_name]] [[item.person.last_name]]
              </span>
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.person')]]
                </span>
              </span>
              <span class="col-data col-6" data-col-header-label="Address">
                  [[renderAddress(item)]]
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/incidents/impact/[[item.incident]]/non-un/[[item.id]]/"
                      title="Edit Non-UNICEF Personnel impact"
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
      },
      lowResolutionLayout: Boolean
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.getNameFromId = getNameFromId;
  }

  renderAddress(item) {
    let addressArray = [];
    if (item.person.address) {
      addressArray.push(item.person.address);
    }
    if (item.person.city) {
      addressArray.push(item.person.city);
    }
    if (item.person.country) {
      addressArray.push(this.getNameFromId(item.person.country, 'countries'));
    }
    return addressArray.join(', ');
  }

  _stateChanged(state) {
    this.offline = state.app.offline;
    let incidentId = state.app.locationInfo.incidentId;
    this.personnelList = state.incidents.personnel.filter(
        elem => '' + elem.incident === incidentId && !elem.person.un_official);
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced && !this.hasPermission('change_person');
  }
}

window.customElements.define(NonUnPersonnelList.is, NonUnPersonnelList);
