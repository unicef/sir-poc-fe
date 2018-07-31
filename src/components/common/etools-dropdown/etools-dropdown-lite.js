import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CommonFunctionality } from './mixins/common-mixin.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import './elements/searchbox-input.js';
import './elements/options-list.js';
import './styles/esmm-shared-styles.js';

/**
 * @polymer
 * @mixinFunction
 * @appliesMixin EsmmMixins.CommonFunctionality
 */
const DropdownRequiredMixins = CommonFunctionality(PolymerElement);

/**
 * `etools-dropdown-lite`
 *
 * @customElement
 * @polymer
 * @appliesMixin DropdownRequiredMixins
 * @demo demo/index.html
 */
class EtoolsDropdown extends DropdownRequiredMixins {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles esmm-shared-styles">

        :host {
          --paper-input-container-input: {
            cursor: var(--esmm-select-cursor);
          }
        }

        #main {
          width: 100%;
        }

        #main iron-icon {
          @apply --esmm-icons;
        }

      </style>

      <paper-input id="main" label="[[label]]" placeholder="[[placeholder]]" always-float-label="[[alwaysFloatLabel]]"
                   no-label-float="[[noLabelFloat]]" value="[[getLabel(selectedItem)]]" disabled="[[disabled]]"
                   invalid="[[invalid]]" error-message="[[_getErrorMessage(errorMessage, invalid)]]" readonly=""
                   on-focus="onInputFocus" on-click="_openMenu">
        <iron-icon icon="arrow-drop-down" slot="suffix" hidden\$="[[readonly]]"></iron-icon>
      </paper-input>

      <iron-dropdown id="dropdownMenu" horizontal-align="right" allow-outside-scroll="[[allowOutsideScroll]]"
                     dynamic-align="[[dynamicAlign]]" on-iron-overlay-opened="_onDropdownOpen"
                     on-iron-overlay-closed="_onDropdownClose" disabled="[[_menuBtnIsDisabled(disabled, readonly)]]">

        <div id="ironDrContent" class="paper-material" elevation="1" slot="dropdown-content">
          <esmm-searchbox-input id="searchbox" search="{{search}}" hidden\$="{{hideSearch}}"></esmm-searchbox-input>

          <esmm-options-list id="optionsList" shown-options="[[shownOptions]]" selected="{{selected}}"
                             two-lines-label="[[twoLinesLabel]]" option-value="[[optionValue]]"
                             option-label="[[optionLabel]]"
                             show-no-search-results-warning="[[showNoSearchResultsWarning]]"
                             show-limit-warning="[[showLimitWarning]]" shown-options-limit="[[shownOptionsLimit]]"
                             no-options-available="[[noOptionsAvailable]]" none-option-label="[[noneOptionLabel]]"
                             capitalize="[[capitalize]]" on-close-etools-dropdown="_closeMenu"></esmm-options-list>
        </div>

      </iron-dropdown>
    `;
  }

  static get is() {
    return 'etools-dropdown-lite';
  }

  static get properties() {
    return {
      /** Dropdown selected value `optionValue` prop of the selected option */
      selected: {
        type: Number,
        notify: true,
        observer: '_selectedChanged'
      },
      /** Selected option object */
      selectedItem: {
        type: Object,
        value: null,
        notify: true
      },
      /** Element title attribute */
      title: {
        type: String,
        reflectToAttribute: true,
        computed: 'getLabel(selectedItem)'
      }
    };
  }

  static get observers() {
    return [
      '_selectedAndOptionsChanged(selected, options)'
    ];
  }

  _selectedAndOptionsChanged(selected, options) {
    this._setSelectedItem();
  }

  _setSelectedItem(selected, selectedItem) {
    if (selectedItem) {
      this.set('selectedItem', selectedItem);
      return;
    }

    selected = selected || this.selected;

    if (!selected && this._noOptions()) {
      this.set('selectedItem', null);
      return;
    }

    selectedItem = this._getItemFromOptions(selected);
    this.set('selectedItem', selectedItem);
  }

  _getItemFromOptions(value) {
    if (this._noOptions()) {
      return null;
    }
    return this.options.find(item => item[this.optionValue] == value);
  }

  _onDropdownClose() {
    super._onDropdownClose();
    if (this.autoValidate) {
      this.validate(this.selected);
    }
  }

  /**
   * Validate dropdown selection
   * @param selected
   * @returns {boolean}
   */
  validate(selected) {
    if (!this.hasAttribute('required') || this.readonly) {
      this.set('invalid', false);
      return true;
    }
    selected = selected || this.selected;
    this.set('invalid', !selected);
    return !!selected;
  }

  _selectedChanged(selected) {
    // elemAttached condition is to prevent eager validation
    if (this.autoValidate && this.elemAttached) {
      this.validate(selected);
    }
    if (!selected) {
      this.set('selectedItem', null);
    }

    // trigger item change event check
    if (!this.triggerValueChangeEvent) {
      return;
    }

    this._debouncer = Debouncer.debounce(
        this._debouncer,
        timeOut.after(10),
        () => {
          this._fireChangeEvent();
        }
    );
  }

  _fireChangeEvent() {
    this.dispatchEvent(new CustomEvent('etools-selected-item-changed', {
      detail: {selectedItem: this.selectedItem},
      bubbles: true,
      composed: true
    }));
  }
}

window.customElements.define(EtoolsDropdown.is, EtoolsDropdown);
