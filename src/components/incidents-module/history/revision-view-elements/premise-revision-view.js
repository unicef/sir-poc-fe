/**
@license
*/
import { PremiseForm } from '../../impact/forms/premise.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../../../history-components/styles.js';
import '../incident-history-navigation-links.js';

/**
 * @polymer
 * @customElement
 */
class PremiseRevisionView extends PremiseForm {
  connectedCallback() {
    super.connectedCallback();
    this.hideCancelBtn = true;
    this.readonly = true;
  }

  static get is() {
    return 'premise-revision-view';
  }

  static get properties() {
    return {
      workingItem: {
        type: Object,
        observer: '_itemChanged'
      }
    };
  }

  static get getTitleTemplate() {
    return html`
      <style include="history-common-styles"></style>
      <div class="layout-horizontal space-between flex-c">
        <div>
          <h2> View premise impact at this revision </h2>
        </div>

        <div class="nav-buttons">
          <incident-history-navigation-links page="view"
                                             module="incidents"
                                             diff-url="diff-premise"
                                             working-item="[[workingItem]]">
          </incident-history-navigation-links>
        </div>
      </div>
    `;
  }

  _idChanged() {
  }

  _itemChanged(workingItem) {
    if (!workingItem) {
      return;
    }

    this.data = workingItem.data;
  }
}

window.customElements.define(PremiseRevisionView.is, PremiseRevisionView);
