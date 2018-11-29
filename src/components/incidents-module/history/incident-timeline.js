import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../common/permissions-base-class';
import { getUserName } from '../../common/utils.js';
import '../../styles/shared-styles.js';
import { store } from '../../../redux/store.js';
import './timeline-cards/incident-status-changed';
import './timeline-cards/incident-commented';
import './timeline-cards/incident-changed';
import './timeline-cards/incident-created';
import './timeline-cards/incident-signed';
/**
 * @polymer
 * @customElement
 */
class IncidentTimeline extends PermissionsBase {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        .container {
          padding: 10px 0;
        }

        hr {
          color: var(--secondary-text-color);
          border-width: 0;
          border-style: inset;
          overflow: visible;
          text-align: center;
          height: 8px;
        }

        hr:after {
          background: var(--background-color);
          font-size: 1.4em;
          content: attr(year);
          padding: 0 4px;
          position: relative;
          top: -13px;
        }

        section.timeline-outer {
          width: calc(100% - 100px);
          margin-right: 0;
          margin-left: auto;
        }

        .timeline {
          border-left: 8px solid var(--primary-color);
          padding: 0;
          list-style: none;
        }

        .timeline li {
          position: relative;
        }

        .timeline li:before,
        .timeline li:after {
          position: absolute;
          display: block;
          top: 0;
        }

        .timeline .timeline-date {
          max-width: 40px;
          margin-left: -72px;
          color: var(--primary-text-color);
          font-size: 1.2em;
          float: left;
          text-align: center;
        }

        .timeline li:after {
          box-shadow: 0 0 0 8px var(--primary-color);
          left: -10px;
          background: var(--primary-text-color);
          border-radius: 50%;
          height: 11px;
          width: 11px;
          content: "";
          top: 5px;
        }

        @media (max-width: 768px) {
          .timeline li::before {
            left: 0.5px;
            top: 20px;
            min-width: 0;
            font-size: 13px;
          }

          section.timeline-outer {
            width: calc(100% - 72px);
          }
        }
      </style>

      <template is="dom-repeat" items="[[timeline]]" as="workingYear">
        <div class="container">
          <hr year$="[[workingYear.year]]" hidden$="[[isCurrentYear(workingYear.year)]]">
          <section class="timeline-outer">
            <ul class="timeline">
              <template is="dom-repeat" items="[[workingYear.items]]" as="workingDay">
                <li>
                  <div class="timeline-date">
                    <b>[[workingDay.date.day]]</b>
                    [[workingDay.date.month]]
                  </div>
                  <template is="dom-repeat" items="[[workingDay.items]]">
                    <template is="dom-if" if="[[actionIs(item.action, 'create')]]">
                      <incident-created-card item="[[item]]"></incident-created-card>
                    </template>
                    <template is="dom-if" if="[[actionIs(item.action, 'update')]]">
                      <template is="dom-if" if="[[statusHasChanged(item.change)]]">
                        <incident-status-changed-card item="[[item]]"></incident-status-changed-card>
                      </template>

                      <template is="dom-if" if="[[isSignOperation(item.change)]]">
                        <incident-signed-card item="[[item]]"></incident-signed-card>
                      </template>

                      <template is="dom-if" if="[[!statusHasChanged(item.change)]]">
                      <template is="dom-if" if="[[!isSignOperation(item.change)]]">
                        <incident-changed-card item="[[item]]"></incident-changed-card>
                      </template>
                      </template>
                    </template>
                    <template is="dom-if" if="[[actionIs(item.action, 'comment')]]">
                        <incident-commented-card item="[[item]]"></incident-commented-card>
                    </template>
                  </template>
                </li>
              </template>
            </ul>
          </section>
        </div>
      </template>
    `;
  }
  static get is() {
    return 'incident-timeline';
  }

  static get observers() {
    return [
      '_computeTimline(history, comments)'
    ];
  }

  static get properties() {
    return {
      history: Array,
      comments: Array,
      timeline: Array,
      profile: Object,
      getUserName: {
        type: Function,
        value: () => getUserName
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    let state = store.getState();
    this.profile = state.staticData.profile;
  }

  _computeTimline(history, comments) {
    if (typeof history === 'undefined' || typeof comments === 'undefined') {
      return;
    }

    let tempTimeline = {};
    let finalTimeline = [];
    let userLastLogin = moment(this.profile.last_login);

    if (this.hasPermission('view_comment')) {
      comments.forEach((elem) => {
        elem.action = 'comment';
      });
    } else {
      comments = [];
    }

    [...history, ...comments].forEach((elem) => {
      let year = this._getYear(elem.created);
      let created = this._getDate(elem.created);
      elem.is_new = moment(elem.created).isAfter(userLastLogin);
      tempTimeline[year] = tempTimeline[year] || {};
      tempTimeline[year][created] = tempTimeline[year][created] || [];
      tempTimeline[year][created].push(elem);
    });

    let sortedYears = Object.keys(tempTimeline).sort((a, b) => a < b);

    sortedYears.forEach((year) => {
      let yearsEntries = [];
      let sortedDatesThisYear = Object.keys(tempTimeline[year]).sort((a, b) => new Date(a) < new Date(b));

      sortedDatesThisYear.forEach((date) => {
        tempTimeline[year][date].sort((a, b) => new Date(a.created) < new Date(b.created));
        let dateComponents = {day: moment(date).format('DD'), month: moment(date).format('MMM')};
        yearsEntries.push({date: dateComponents, items: tempTimeline[year][date]});
      });

      finalTimeline.push({year, items: yearsEntries});
    });

    finalTimeline.sort((a, b) => a.year < b.year);

    this.set('timeline', finalTimeline);
  }

  _getDate(dateString) {
    return moment(dateString).format('YYYY-MM-DD');
  }

  _getYear(dateString) {
    return moment(dateString).format('YYYY');
  }

  actionIs(received, expected) {
    return received === expected;
  }

  statusHasChanged(changesObj) {
    return Object.keys(changesObj).indexOf('status') > -1;
  }

  isSignOperation(changesObj) {
    let keys = Object.keys(changesObj);
    if (keys.length !== 3) {
      return false;
    }

    keys = keys.filter((key) => {
      if (key.endsWith('review_by')) {
        return false;
      }
      if (key.endsWith('review_date')) {
        return false;
      }
      if (key === 'version') {
        return false;
      }
      return true;
    });

    return keys.length === 0;
  }

  isCurrentYear(year) {
    return moment().format('YYYY') === year;
  }
}

window.customElements.define(IncidentTimeline.is, IncidentTimeline);
