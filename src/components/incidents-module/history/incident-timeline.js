import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { getNameFromId } from '../../common/utils.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import HistoryHelpers from '../../history-components/history-helpers.js';

/**
 * @polymer
 * @customElement
 */
class IncidentTimeline extends connect(store)(HistoryHelpers(PolymerElement)) {
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
          <hr year$="[[workingYear.year]]">
          <section class="timeline-outer">
              <ul class="timeline">
                <template is="dom-repeat" items="[[workingYear.items]]" as="thisDay">
                  <li>
                    <div class="timeline-date">
                      <b>[[thisDay.date.day]]</b>
                      [[thisDay.date.month]]
                    </div>
                    <template is="dom-repeat" items="[[thisDay.items]]">
                      <template is="dom-if" if="[[actionIs(item.action, 'create')]]">
                        <div class="card">
                          [[getUserName(item.by_user)]] added this incident.
                          <span title="View entire incident at this version">
                            <a href="/incidents/history/[[item.data.id]]/view/[[item.id]]">
                              View original data
                            </a>
                          </span>
                        </div>
                      </template>
                      <template is="dom-if" if="[[actionIs(item.action, 'update')]]">
                        <div class="card">
                          [[getUserName(item.by_user)]] changed fields:
                          <p> [[getChangedFileds(item.change)]] </p>
                          You can
                          <a href="/incidents/history/[[item.data.id]]/diff/[[item.id]]">
                            view the changes
                          </a>
                          or
                          <a href="/incidents/history/[[item.data.id]]/view/[[item.id]]">
                            view the entire incident at this revision
                          </a>
                        </div>
                      </template>
                      <template is="dom-if" if="[[actionIs(item.action, 'comment')]]">
                        <div class="card">
                          [[getUserName(item.by_user)]] commented on this:
                          <p> [[item.comment]] </p>
                        </div>
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
      timeline: Array
    };
  }

  _stateChanged(state) {
    if (!state || !state.staticData || !state.app) {
      return;
    }
    this.users = state.staticData.users;
  }

  _computeTimline(history, comments) {
    if (typeof history === 'undefined' || typeof comments === 'undefined') {
      return;
    }

    let tempTimeline = {};
    let finalTimeline = [];

    comments.forEach((elem) => {
      elem.action = 'comment';
    });

    [...history, ...comments].forEach((elem) => {
      let year = this._getYear(elem.created);
      let created = this._getDate(elem.created);
      tempTimeline[year] = tempTimeline[year] || {};
      tempTimeline[year][created] = tempTimeline[year][created] || [];
      tempTimeline[year][created].push(elem);
    });

    for(let year in tempTimeline) {
      let yearsEntries = [];
      for(let date in tempTimeline[year]) {
        tempTimeline[year][date].sort((a, b) => a.created < b.created);
        let dateComponents = {day: moment(date).format('DD'), month: moment(date).format('MMM')};
        yearsEntries.push({date: dateComponents, items: tempTimeline[year][date]});
      }
      finalTimeline.push({year, items: yearsEntries});
    }

    // TODO: Sorting. Newest items first
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

  getUserName(userId) {
    let user = this.users.find(u => u.id === Number(userId));
    if (!user) {
      return 'N/A';
    }
    return user.first_name + ' ' + user.last_name;
  }

  getChangedFileds(changesObj) {
    let changes = Object.keys(changesObj);

    changes = changes.filter(change => change !== 'version');
    changes = changes.map(change => this.getLabelForField(change));

    return (changes.length > 0 ? changes: ['No changes']).join(', ');
  }
}

window.customElements.define(IncidentTimeline.is, IncidentTimeline);
