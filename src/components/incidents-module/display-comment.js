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
          padding: 24px 0;
        }
        .username {
          font-weight: 600;
          color: var(--primary-color-darker);
        }
        .date {
          color: var(--secondary-text-color);
          font-size: 13px;
        }
        .username-and-date {
          padding-bottom:10px;
          font-size:14px;
        }

      </style>
      <div class="container">

          <div class="username-and-date">
            <div class="username">[[_getUsername(comment.last_modify_user_id)]]</div>
            <div class="date">[[_displayDateTime(comment.created)]] UTC</div>
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
      },
      allUsers: {
        type: Array,
        value: []
      }
    };
  }

  _displayDateTime(date) {
    let dateString = this._convertDate(date);
    return this._utcDate(dateString, 'D MMM YYYY HH:mm:ss');
  }

  _getUsername(userId) {
    if (userId === null || userId === undefined) {
      return 'N/A';
    }
    let user = this.allUsers.find(u => Number(u.id) === Number(userId));
    if (user) {
      return user.name;
    }
    return 'N/A';
  }
}

window.customElements.define('display-comment', DisplayComment);
