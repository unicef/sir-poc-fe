/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import 'etools-data-table';
import { getNameFromId } from '../../../common/utils.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';


export class UnPersonnelList extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>

      <div hidden$="[[!personnelList.length]]">
        <etools-data-table-header id="listHeader" no-title no-collapse
                                  low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-4">
            Name
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Impact
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Category
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[personnelList]]">
          <etools-data-table-row no-collapse unsynced$="[[item.unsynced]]"
                                 low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data">
              <span class="col-data col-4" data-col-header-label="Name">
                [[item.person.first_name]] [[item.person.last_name]]
              </span>
              <span class="col-data col-3" data-col-header-label="Impact">
                <span class="truncate">
                  [[getNameFromId(item.impact, 'impacts.person')]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Category">
                [[getNameFromId(item.person.category, 'personnelCategories')]]
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/incidents/impact/[[item.incident]]/un-personnel/[[item.id]]/"
                      title="Edit UNICEF Personnel impact"
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
    return 'un-personnel-list';
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

  _stateChanged(state) {
    this.offline = state.app.offline;
    let incidentId = state.app.locationInfo.incidentId;
    this.personnelList = state.incidents.personnel.filter(
      elem => '' + elem.incident === incidentId && elem.person.un_official);
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced;
  }
}

window.customElements.define(UnPersonnelList.is, UnPersonnelList);
