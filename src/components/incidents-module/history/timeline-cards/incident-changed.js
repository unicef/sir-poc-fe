/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { TimelineCardBase } from './card-base-class.js';
import { store } from '../../../../redux/store.js';
import { fetchUserHistory } from '../../../../actions/incidents.js';


/**
 * @polymer
 * @customElement
 *
 */
class IncidentChangedCard extends TimelineCardBase {


  static get template() {
    return html`
       ${this.styles}
       <template is="dom-if" if="[[checkIsCreatedByUser(item.change)]]">
            <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
            [[item.by_user_display]] changed fields:
            <p> [[getChangedFileds(item.change)]] </p>
            You can
            <a href="/incidents/history/[[item.data.id]]/diff-incident/[[item.id]]">
              view the changes
            </a>
            or
            <a href="/incidents/history/[[item.data.id]]/view-incident/[[item.id]]">
              view the entire incident at this revision
            </a>
          </div>
        </template>

        <template is="dom-if" if="[[!checkIsCreatedByUser(item.change,items)]]">
            <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
            <p> [[item.by_user_display]] has changed ownership from [[beforeName]] to [[afterName]] </p>
            You can
            <a href="/incidents/history/[[item.data.id]]/view-incident/[[item.id]]">
              view the entire incident at this revision
            </a>
          </div>
        </template>
       
      
      `;
  }

  static get is() {
    return 'incident-changed-card';
  }

  static get properties() {
    return {
      beforeName: String,
      afterName: String
    };
  }

  checkIsCreatedByUser(changesObj, items) {

    let changes = Object.keys(changesObj);
    changes = changes.filter(change => change !== 'version');
    changes = changes.map(change => this.getLabelForField(change));

    if (items && changesObj.created_by_user) {
      this.set('afterName', items.find(item => item.user_id === changesObj.created_by_user.after).display_name);
      this.set('beforeName', items.find(item => item.user_id === changesObj.created_by_user.before).display_name);
    }
    if ((changes.length > 0 ? changes : ['No changes found']).join(', ') === 'created_by_user') {
      store.dispatch(fetchUserHistory([changesObj.created_by_user.after, changesObj.created_by_user.before]));
      return false;
    }
    else {return true;}

  }


}

window.customElements.define(IncidentChangedCard.is, IncidentChangedCard);
