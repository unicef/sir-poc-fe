import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
class IncidentTimeline extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        .card {
          padding: 16px;
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

        .timeline .to-the-left {
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

      <template is="dom-repeat" items="[[timeline]]" as="thisYear">
        <div class="container">
          <hr year$="[[thisYear.year]]">
          <section class="timeline-outer">
              <ul class="timeline">
                <template is="dom-repeat" items="[[thisYear.items]]" as="thisDay">
                  <li>
                    <div class="to-the-left">
                      <b>[[thisDay.date.day]]</b>
                      [[thisDay.date.month]]
                    </div>
                    <template is="dom-repeat" items="[[thisDay.items]]">
                      <div class="card">
                        <h3> Card title </h3>
                        <p>
                          action: [[item.action]]
                        </p>
                      </div>
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
        tempTimeline[year][date].sort((a, b) => a.created > b.created);
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
}

window.customElements.define(IncidentTimeline.is, IncidentTimeline);
