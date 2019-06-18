import {PolymerElement, html} from '@polymer/polymer';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {IronOverlayBehavior} from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';

 class NoAccessOverlay extends mixinBehaviors(IronOverlayBehavior, PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          background: white;
          color: black;
          padding: 24px;
          box-shadow: rgba(0, 0, 0, 0.24) -2px 5px 12px 0px, rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define('no-access-overlay', NoAccessOverlay);
