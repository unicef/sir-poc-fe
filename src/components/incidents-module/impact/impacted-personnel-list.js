/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/image-icons.js';
import 'etools-data-table';
import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';


export class ImpactedPesonnelList extends PolymerElement {
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
      <div hidden$="[[!incident.involved.length]]">
        <etools-data-table-header id="listHeader" no-title>
          <etools-data-table-column class="col-6">
            Name
          </etools-data-table-column>
          <etools-data-table-column class="col-6">
            Type of Contract
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[incident.involved]]">
          <etools-data-table-row no-collapse>
            <div slot="row-data">
              <span class="col-data col-6" data-col-header-label="Name">
                <span class="truncate">
                  [[item.first_name]] [[item.last_name]]
                </span>
              </span>
              <span class="col-data col-6" data-col-header-label="Type of Contract">
                <span class="truncate">
                  [[item.type_of_contract]]
                </span>
              </span>
            </div>
          </etools-data-table-row>
        </template>
      <div>
      <hr hidden$="[[incident.involved.length]]">
    `;
  }

  static get is() {
    return 'impacted-personnel-list';
  }

  static get properties() {
    return {
      incident: Object
    };
  }
}

window.customElements.define(ImpactedPesonnelList.is, ImpactedPesonnelList);
