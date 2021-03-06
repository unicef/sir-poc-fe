/**
 @license
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { addEvent, setEventDraft } from '../../actions/events.js';
import { showSnackbar } from '../../actions/app.js';
import { EventsBaseView } from './events-base-view.js';
import { getEventModel } from '../../models/event-model.js';


class AddEvent extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new event';
    this.hideReviewFields = true;
    this.set('event', this.state.events.draft);
  }

  static get observers() {
    return [
      '_eventChanged(event.*)'
    ];
  }

  static get actionButtonsTemplate() {
    return html`
      <paper-button raised on-click="resetForm">
        Reset data
      </paper-button>
    `;
  }

  _eventChanged() {
    this._debouncer = Debouncer.debounce(
        this._debouncer,
        timeOut.after(1000),
        this.saveDraft.bind(this)
    );
  }

  saveDraft() {
    this.store.dispatch(setEventDraft(this.event));
  }

  async save() {
    if (!this.validate()) {
      this.store.dispatch(showSnackbar('Please fill in all the required fields'));
      return;
    }

    if (!this.hasPermission('add_event')) {
      this.store.dispatch(showSnackbar('You do not have permission to add an event'));
      return;
    }

    let successfull = await this.store.dispatch(addEvent(this.event));
    if (typeof successfull === 'boolean' && successfull) {
      this.resetForm();
    }
  }

  _idChanged() {
    // nothing to do here
  }

  resetForm() {
    this.event = getEventModel();
    this.resetValidations();
  }
}

window.customElements.define('add-event', AddEvent);
