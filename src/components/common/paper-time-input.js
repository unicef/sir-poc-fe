'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';


class PaperTimeInput extends PolymerElement {
  static get is() {
    return 'paper-time-input';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          @apply --paper-font-common-base;
        }

        paper-input{
          width: 30px;
          text-align: center;
          --paper-input-container-input: {
            /* Damn you firefox
            * Needed to hide spin num in firefox
            * http://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box
            */
            -moz-appearance: textfield;
            @apply --paper-time-input-cotnainer;
          };
          --paper-input-container-input-webkit-spinner: {
            -webkit-appearance: none;
            margin: 0;
            display: none;
          };
        }

        paper-dropdown-menu{
          width: 55px;
          padding: 0;
          /* Force ripple to use the whole container */
          --paper-dropdown-menu-ripple: {
            color: var(--paper-time-input-dropdown-ripple-color, --primary-color);
          };
          --paper-input-container-input: {
            @apply --paper-font-button;
            text-align: center;
            padding-left: 5px;
            @apply --paper-time-dropdown-input-cotnainer;
          };
          --paper-input-container-underline: {
            border-color: transparent;
          }
          --paper-input-container-underline-focus: {
            border-color: transparent;
          };
        }
        paper-item{
          cursor: pointer;
          text-align: center;
          font-size: 14px;
        }
        paper-listbox{
          padding: 0;
        }

        label{
          @apply --paper-font-caption;
        }
        .time-input-wrap{
          @apply --layout-horizontal;
          @apply --layout-no-wrap;
        }

        [hidden]{
          display: none !important;
        }
      </style>

      <label hidden$="[[hideLabel]]">[[label]]</label>
      <div class="time-input-wrap">

        <!-- Hour Input -->
        <paper-input
          id="hour"
          type="number"
          value="{{hour}}"
          required
          auto-validate="[[autoValidate]]"
          prevent-invalid-input
          maxlength="2"
          max="12"
          min="0"
          no-label-float
          disabled="[[disabled]]">
          <span suffix slot="suffix">:</span>
        </paper-input>

        <!-- Min Input -->
        <paper-input
          id="min"
          type="number"
          value="{{min}}"
          required
          auto-validate="[[autoValidate]]"
          prevent-invalid-input
          maxlength="2"
          max="59"
          min="0"
          no-label-float
          disabled="[[disabled]]">
        </paper-input>

        <!-- Dropdown Menu -->
        <paper-dropdown-menu
          id="dropdown"
          required
          no-label-float
          disabled="[[disabled]]">

          <paper-listbox attr-for-selected="name" selected="{{amPm}}" slot="dropdown-content">
            <paper-item name="AM">AM</paper-item>
            <paper-item name="PM">PM</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>

      </div>
    `;
  }

  static get properies() {
    return  {
      /**
       * Label for the input
       */
      label: {
        type: String,
        value: 'Time'
      },
      /**
       * auto validate time inputs
       */
      autoValidate: {
        type: Boolean,
        value: true
      },
      /**
       * hides the label
       */
      hideLabel: {
        type: Boolean,
        value: false
      },
      /**
       * disables the inputs
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * hour
       */
      hour: {
        type: String,
        value: '00'
      },
      /**
       * minute
       */
      min: {
        type: String,
        value: '00'
      },
      /**
       * AM or PM
       */
      amPm: {
        type: String,
        value: () => 'AM'
      },
      /**
       * Formatted time string
       */
      value: {
        type: String,
        notify: true,
        observer: '_valueChanged'
      },
    };
  }

  static get observers() {
    return [
      '_computeTime(hour, min, amPm)'
    ];
  }

  validate() {
    var valid = true;
    // Validate hour & min fields
    if(!this.$.hour.validate() | !this.$.min.validate()){
      valid = false;
    }
    // Validate AM PM if 12 hour time
    if (!this.$.dropdown.validate()) {
      valid = false;
    }
    return valid;
  }

  _valueChanged(newVal, oldVal) {
    if (!oldVal) {
      // change event from initialization
      return;
    }
    // if (this.timeWasComputed) {
    //   this.timeWasComputed = false;
    //   return;
    // }

    let hour, min;
    [hour, min] = this.value.split(':');

    if (hour > 12) {
      this.amPm = 'PM';
      hour = hour - 12;
    }
    this.timeWasComputed = true;
    this.hour = hour;
    this.min = min;
  }

  _computeTime() {
    if (this.timeWasComputed) {
      this.timeWasComputed = false;
      return;
    }
    if (this.hour && this.min) {
      // this.timeWasComputed = true;
      this.set('value', this._formatHour(this._getHour()) + ':' + this._formatMin(this.min));
    }
  }
  _getHour() {
    if (this.hour === '12' && this.amPm === 'AM') {
      return 0;
    }
    if (this.amPm === 'PM' && this.hour !== '12') {
      return Number(this.hour) + 12;
    }
    return Number(this.hour);
  }

  _formatMin(min) {
    min = Number(min);
    return (min < 10) ? ('0' + min) : '' + min;
  }

  _formatHour(hour) {
    hour = Number(hour);
    return (hour < 10) ? ('0' + hour) : '' + hour;
  }

  _equal(n1, n2) {
    return n1 == n2;
  }
}

window.customElements.define(PaperTimeInput.is, PaperTimeInput);
