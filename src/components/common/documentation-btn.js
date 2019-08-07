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
                + 'EcDrjx9_qhtIg9hIH6ifjaEBUiWhLfS_u9UtCfL9AQbbYA?e=fVU0JG'
      }
    };
  }
}
customElements.define(DocumentationBtn.is, DocumentationBtn);
