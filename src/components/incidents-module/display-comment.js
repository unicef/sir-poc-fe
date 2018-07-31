import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import DateMixin from '../common/date-helper.js'


/**
 * @polymer
 * @customElement
 */
class DisplayComment extends DateMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        .comment {
          padding: 20px 20px;
        }
      </style>
      <div class="comment">
          <div>
            <div>[[comment.username]] Username</div>
            <div>[[prettyDate(comment.created)]]</div>
          </div>
          <div>
            [[comment.comment]]
          </div>
      </div>
    `;
  }

  static get properties() {
    return {
      comment: {
        type: Array,
        value: []
      }
    };
  }


  connectedCallback() {
    super.connectedCallback();

  }


}

window.customElements.define('display-comment', DisplayComment);
