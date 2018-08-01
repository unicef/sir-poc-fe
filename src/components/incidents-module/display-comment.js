import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import DateMixin from '../common/date-mixin.js';


/**
 * @polymer
 * @customElement
 */
class DisplayComment extends DateMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .container {
          padding: 24px 20px;
        }
        .username {
          color: var(--app-secondary-color);
          font-weight: 600;
        }
        .date {
          color: #bdbbbb;
        }
        .username-and-date {
          padding-bottom:10px;
          font-size:14px;
        }

      </style>
      <div class="container">

          <div class="username-and-date">
            <div class="username">[[comment.username]] Username</div>
            <div class="date">[[prettyDate(comment.created)]]</div>
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
}

window.customElements.define('display-comment', DisplayComment);
