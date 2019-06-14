import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/communication-icons';

/**
 * @polymer
 * @customElement
*/

class DocumentationBtn extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host(:hover) {
          cursor: pointer;
        }
        a {
          color: inherit;
          text-decoration: none;
          font-size: 16px;
        }
        iron-icon {
          margin-right: 4px;
        }
        @media only screen and (max-width: 766px) {
          a span {
            display: none;
          }
        }
      </style>

      <a href="[[url]]"
        target="_blank">
        <iron-icon icon="icons:description"></iron-icon>
        <span>Documentation</span>
      </a>
    `;
  }

  static get is() {
    return 'documentation-btn';
  }

  static get properties() {
    return {
      url: {
        type: String,
        value: 'https://unicef.sharepoint.com/:w:/t/EMOPS-OSC/'
          + 'ES5YDX0zziRIg8nj_nx0EkMBqjplq_JbHw7mUF2KLuO1iQ?e=4%3aNbNMmH&at=9'
      }
    };
  }
}
customElements.define(DocumentationBtn.is, DocumentationBtn);
