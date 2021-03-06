import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import HistoryHelpers from '../../../history-components/history-helpers.js';
import '../../../styles/shared-styles.js';

export class TimelineCardBase extends HistoryHelpers(PolymerElement) {
  static get styles() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        .card.new:before {
          content: "New";
          font-weight: bold;
          color: var(--notification-icon-color);
        }
      </style>`;
  }

  static get properties() {
    return {
      item: Object
    };
  }

  getCardClass(item) {
    return item.is_new ? 'card new': 'card';
  }

  getChangedFileds(changesObj) {
    let changes = Object.keys(changesObj);

    changes = changes.filter(change => change !== 'version');
    changes = changes.map(change => this.getLabelForField(change));

    return (changes.length > 0 ? changes: ['No changes found']).join(', ');
  }

  hasChangedFields(changesObj) {
    let changes = Object.keys(changesObj);
    // length 1 because version is always present
    return changes.length !== 1;
  }
}
