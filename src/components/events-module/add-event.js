/**
 @license
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { addEvent, setEventDraft } from '../../actions/events.js';
import { EventsBaseView } from './events-base-view.js';
import { getEventModel } from '../../models/event-model.js';


class AddEvent extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new event';
    this.set('event', this.state.events.draft);
  }

  static get observers() {
    return [
      '_eventChanged(event.*)'
    ];
  }

  static get actionButtonsTemplate() {
    return html`
        <paper-button raised
                    on-click="resetForm"
                    disabled$="[[canNotSave(eventId, state.app.offline)]]">
        Reset data
      </paper-button>
    `;
  }

  _eventChanged() {
    setTimeout(() => this.store.dispatch(setEventDraft(this.event)), 100);
  }

  async save() {
    if (!this.validate()) {
      return;
    }
    let successfull = await this.store.dispatch(addEvent(this.event));
    if (typeof successfull === 'boolean' && successfull) {
      this.resetForm();
    }
  }

  resetForm() {
    this.event = getEventModel();
    this.resetValidations();
  }
}

window.customElements.define('add-event', AddEvent);
