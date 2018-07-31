import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '../styles/grid-layout-styles.js';

/**
 * @polymer
 * @customElement
 */
class AddComment extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          display: block;
        }
        .container {
          padding: 0px 24px;
        }
        .btn {
          margin-top: 24px;
        }

      </style>
      <div class="container">
          <paper-textarea label="Write your comment here" id="commentText"
                          required auto-validate
                          value="{{commentText}}"></paper-textarea>
          <paper-button class="btn" raised on-click="save">Save</paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      commentText: {
        type: String,
        value: ''
      }
    };
  }

  save() {
    if (!this.$.commentText.validate()) {
      return;
    }
    this.dispatchEvent(new CustomEvent('add-comment', {detail: this.commentText}));
  }

  resetForm() {
    this.commentText = '';
    this.$.commentText.invalid = false;
  }
}

window.customElements.define('add-comment', AddComment);