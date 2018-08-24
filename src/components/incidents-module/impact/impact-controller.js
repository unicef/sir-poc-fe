/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
export class ImpactController extends PolymerElement {
  static get is() {
    return 'impact-controller';
  }
  static get template() {
    return html`
      <style include="shared-styles">
        hr {
          border-width: 1px;
          border-style: inset;
          margin-bottom: 0;
        }
        h3 {
          margin-bottom: 0;
        }
        paper-button {
          text-transform: none;
          padding: 0 8px;
        }
        .right {
          text-align: right;
        }
      </style>
      <div class="card">

        <h3>Personnel</h3>
        <hr>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add UN Personnel
          </paper-button>
          <hr>
        </div>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add NON UN Personnel
          </paper-button>
        </div>
        <hr>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add Evacuation
          </paper-button>
        </div>

        <h3>UN Property(assets)</h3>
        <hr>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add UN Property
          </paper-button>
        </div>

        <h3>UN Premises(facilities)</h3>
        <hr>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add Premises
          </paper-button>
        </div>

        <h3>UN Programme</h3>
        <hr>
        <div class="right">
          <paper-button raised class="white-bg smaller">
            <iron-icon icon="add"></iron-icon>
            Add Programme
          </paper-button>
        </div>
      </div>
    `;
  }
}

window.customElements.define(ImpactController.is, ImpactController);
