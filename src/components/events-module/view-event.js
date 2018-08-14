/**
 @license
 */
import {html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import {EventsBaseView} from './events-base-view.js';
import {isOnViewEvent} from '../../reducers/app.js';

/**
 * @polymer
 * @customElement
 */
class ViewEvent extends EventsBaseView {

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <div class="row-h flex-c" hidden$="[[state.app.offline]]">
        <div class="col col-12">
          <a href="/events/edit/[[eventId]]">
            <paper-button raised>
              <iron-icon icon="editor:mode-edit"></iron-icon>
              Edit
            </paper-button>
          </a>
        </div>
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View event';
  }

  isOnExpectedPage() {
    return isOnViewEvent(this.state);
  }

}

window.customElements.define('view-event', ViewEvent);

