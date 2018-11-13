/**
@license
*/
import { EventsBaseView } from './events-base-view.js';
import { editEvent } from '../../actions/events.js';
import { showSnackbar } from '../../actions/app.js';

/**
 * @polymer
 * @customElement
 */
class EditEvent extends EventsBaseView {
  static get is() {
    return 'edit-event';
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit event';
  }

  save() {
    if (!this.validate()) {
      return;
    }

    if (!this.hasPermission('change_event')) {
      showSnackbar('You do not have permission to edit an event');
      return;
    }

    this.store.dispatch(editEvent(this.event));
  }

}

window.customElements.define(EditEvent.is, EditEvent);
