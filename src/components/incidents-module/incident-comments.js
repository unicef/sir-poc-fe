import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/**
 * @polymer
 * @customElement
 */
class IncidentComments extends PolymerElement {
  connectedCallback() {
    super.connectedCallback();

  }


}

window.customElements.define('incident-comments', IncidentComments);
