/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../../common/permissions-base-class';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import '@unicef-polymer/etools-data-table/';
import { getNameFromId } from '../../../common/utils.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';


export class PropertiesList extends connect(store)(PermissionsBase) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>

      <div hidden$="[[!propertiesList.length]]">
        <etools-data-table-header id="listHeader" no-title no-collapse
                                  low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Owner
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Type
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Value in USD
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[propertiesList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]"
                                 low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.property')]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Owner">
                <span class="truncate">
                  [[getNameFromId(item.agency, 'agencies')]]
                </span>
              </span>
              <span class="col-data col-2" data-col-header-label="Type">
                [[getNameFromId(item.property_type, 'propertyTypes')]]
              </span>
              <span class="col-data col-2" data-col-header-label="Value in USD">
                $[[item.value]]
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/incidents/impact/[[item.incident_id]]/property/[[item.id]]/"
                      title="Edit property impact"
                      hidden$="[[_notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
              </span>
            </div>
          </etools-data-table-row>
        </template>
      <div>
      <hr hidden$="[[propertiesList.length]]">
    `;
  }

  static get is() {
    return 'properties-list';
  }

  static get properties() {
    return {
      lowResolutionLayout: Boolean,
      offline: Boolean,
      propertiesList: {
        type: Array,
        value: []
      },
      getNameFromId: {
        type: Function,
        value: () => getNameFromId
      }
    };
  }

  _stateChanged(state) {
    let incidentId = state.app.locationInfo.incidentId;
    this.propertiesList = state.incidents.properties.filter(elem => '' + elem.incident_id === incidentId);
    this.offline = state.app.offline;
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced && !this.hasPermission('change_property');
  }
}

window.customElements.define(PropertiesList.is, PropertiesList);
