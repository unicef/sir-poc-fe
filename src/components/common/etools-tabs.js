import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-tabs/paper-tabs.js';


/**
 * @polymer
 * @customElement
 */
class EtoolsTabs extends PolymerElement {
  static get is() {
    return 'etools-tabs';
  }

  static get template() {
    return html`
        <style>
        *[hidden] {
          display: none !important;
        }

        :host {
          @apply --layout-horizontal;
          @apply --layout-start-justified;
        }


        paper-tabs {
          --paper-tabs-selection-bar-color: var(--app-primary-color);
        }

        paper-tab[link],
        paper-tab {
          --paper-tab-ink: var(--app-primary-color);
          padding: 0 24px;
          min-width: 70px;
        }
        
        @media only screen and (max-width: 450px) {
          paper-tab[link],
          paper-tab {
            --paper-tab-ink: var(--app-primary-color);
            min-width: 14px;
          }
        }

        paper-tab .tab-content {
          color: var(--primary-text-color);
          text-transform: uppercase;
        }

        paper-tab.iron-selected .tab-content {
          color: var(--app-primary-color);
        }
      </style>

      <paper-tabs id="tabs"
                  selected="{{selected}}"
                  attr-for-selected="name"
                  noink>

        <template is="dom-repeat" items="[[tabs]]">
          <paper-tab name$="[[item.name]]" link hidden$="[[item.hidden]]">
            <span class="tab-content">
              [[item.tabLabel]]
              <template is="dom-if" if="[[item.showTabCounter]]" restamp>
                ([[item.counter]])
              </template>
            </span>
          </paper-tab>
        </template>

      </paper-tabs>
    `;
  }

  static get properties() {
    return {
      selected: {
        type: String,
        notify: true
      },
      tabs: {
        type: Array,
        value: []
      }
    };
  }

}

window.customElements.define(EtoolsTabs.is, EtoolsTabs);
