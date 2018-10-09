import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { store } from '../../redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../styles/shared-styles.js';

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

        section.timeline-outer {
          width: calc(100% - 100px);
          margin-right: 0;
          margin-left: auto;
        }

        .timeline {
          border-left: 8px solid var(--primary-color);
          border-bottom-right-radius: 2px;
          padding: 20px 0;
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

      <section id="timeline" class="timeline-outer">
        <div class="container" id="content">
          <ul class="timeline">
            <li>
              <div class="to-the-left">
                <b>23</b> <br> Sept
              </div>
              <div class="card">
                <h3> Card title </h3>
                <p>
                  Card content bla bla bla bla bla
                </p>
              </div>
            </li>
            <li>
              <div class="card">
                <h3> Second card title </h3>
                <p>
                  Bla bla bla Card content bla bla bla bla bla
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    `;
  }
  static get is() {
    return 'incident-timeline';
  }

  static get properties() {
    return {
    };
  }

  _stateChanged(state) {

  }

}

window.customElements.define(IncidentTimeline.is, IncidentTimeline);
