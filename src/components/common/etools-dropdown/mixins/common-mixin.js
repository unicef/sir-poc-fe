import {ListItemUtils} from './list-item-utils-mixin.js';

/*
 * Common functionality for single selection and multiple selection dropdown
 * @polymer
 * @mixinFunction
 * @appliesMixin EsmmMixins.ListItemUtils
 */
export const CommonFunctionality = (superClass) => class extends ListItemUtils(superClass) {

  static get properties() {
    return {
      /** Dropdown label */
      label: {
        type: String
      },
      noLabelFloat: Boolean,
      alwaysFloatLabel: {
        type: Boolean,
        value: true
      },
      placeholder: {
        type: String,
        value: '—'
      },
      required: {
        type: Boolean,
        observer: '_requiredChanged',
        reflectToAttribute: true
      },
      errorMessage: {
        type: String,
        value: 'This field is required'
      },
      autoValidate: {
        type: Boolean
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      readonly: {
        type: Boolean,
        value: function () {
          return false;
        },
        reflectToAttribute: true,
        observer: '_readonlyChanged'
      },
      invalid: {
        type: Boolean,
        value: function () {
          return false;
        },
        reflectToAttribute: true
      },
      /** Makes the dropdown to show top or bottom where it will fit better */
      dynamicAlign: {
        type: Boolean,
        value: true
      },
      /** Allows scroll outside opened dropdown */
      allowOutsideScroll: {
        type: Boolean
      },
      search: {
        type: String
        // observer: '_searchValueChanged'
      },
      /** Array of objects, dropdowns options used to compute shownOptions */
      options: {
        type: Array
      },
      /** Options seen by user */
      shownOptions: {
        type: Array,
        computed: '_computeShownOptions(options, search, enableNoneOption, options.length)'
      },
      /**
       * Flag to show `None` option (first dropdown option)
       * Used to reset single selection dropdown selected value
       */
      enableNoneOption: {
        type: Boolean,
        value: false
      },
      hideSearch: {
        type: Boolean,
        value: false
      },
      dropdownIsClosing: {
        type: Boolean,
        value: false
      },
      /** Limit displayed options */
      shownOptionsLimit: {
        type: Number,
        value: 50
      },
      /** Flag to show a no options avaliable warning */
      noOptionsAvailable: {
        type: Boolean,
        value: true,
        computed: '_computeNoOptionsAvailable(options, options.length)'
      },
      /** Flag to show the limit of options shown in dropdown */
      showLimitWarning: {
        type: Boolean,
        value: false,
        computed: '_computeShowLimitWarning(shownOptionsLimit, shownOptions)'
      },
      /** Flag used to show no search result found warning */
      showNoSearchResultsWarning: {
        type: Boolean,
        value: false,
        computed: '_showNoSearchResultsWarning(noOptionsAvailable, shownOptions.length, options.length)'
      },
      /** Stop autofocus from paper-dialog */
      disableOnFocusHandling: {
        type: Boolean,
        value: function () {
          return this.disableOnFocusHandling || this.isIEBrowser();
        },
        reflectToAttribute: true
      },
      /**
       * Element that will prevent dropdown to overflow outside it's margins
       * @type HTMLElement
       */
      fitInto: {
        type: Object,
        observer: '_setFitInto'
      },
      /** Margin added if dropdown bottom is too close to the viewport bottom margin */
      viewportEdgeMargin: {
        type: Number,
        value: 20
      },
      /**
       * By default the search string is reset when the dropdown closes
       * This flag allows the search value to persist after the dropdown is closed
       */
      preserveSearchOnClose: {
        type: Boolean,
        value: false
      },
      /** Flag to trigger `etools-selected-items-changed` event */
      triggerValueChangeEvent: {
        type: Boolean,
        value: false
      },
      elemAttached: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    // focusout is used because blur acts weirdly on IE
    this.addEventListener('focusout', (e) => {
      e.stopImmediatePropagation();
      this._closeMenu();
    });

    this._setFitInto();
    this._setPositionTarget();
    this._setFocusTarget();
    this._setDropdownWidth();
    this.notifyDropdownResize();

    this._setResetSizeHandler();
    this.elemAttached = true;
  }

  _setFitInto() {
    let ironDropdown = this._getIronDropdown();
    // fitInto element will not let the dropdown to overlap it's margins
    if (!this.fitInto && window.EtoolsEsmmFitIntoEl) {
      ironDropdown.set('fitInto', window.EtoolsEsmmFitIntoEl);
    } else if (this.fitInto) {
      ironDropdown.set('fitInto', this.fitInto);
    }
  }

  /**
   * Reset dropdown size on close
   */
  _setResetSizeHandler() {
    let ironDropdown = this._getIronDropdown();
    ironDropdown.addEventListener('iron-overlay-closed', this.resetIronDropdownSize.bind(this));
  }

  _isUndefined(prop) {
    return typeof prop === 'undefined';
  }

  /**
   * Reset previous calculated maxHeight,
   * in this way on each dropdown open action we'll get the same calculated new height.
   */
  resetIronDropdownSize() {
    let ironDrContent = this._getIronDropdownContent();
    let optionsList = this._getOptionsList();
    ironDrContent.style.maxHeight = 'none';
    optionsList.style.maxHeight = 'none';
  }

  _dropdownOpenedDownwards(overlayCoord) {
    let paperContainerCoords = this.$.main.getBoundingClientRect();
    return Math.abs(overlayCoord.top - paperContainerCoords.top) <= 10;
  }

  _noOptions() {
    return (!this.options || !this.options.length);
  }

  _menuBtnIsDisabled(disabled, readonly) {
    return disabled || readonly;
  }

  resetInvalidState() {
    this.set('invalid', false);
  }

  _computeNoOptionsAvailable(options, optionsLength) {
    if (this._isUndefined(options)) {
      return;
    }
    return !Array.isArray(options) || !optionsLength;
  }

  _readonlyChanged(newValue, oldValue) {
    if (this._isUndefined(newValue)) {
      return;
    }
    if (newValue) {
      this.invalid = false;
    }
    this._attributeRepaintNeeded(newValue, oldValue);
  }

  _requiredChanged(newValue, oldValue) {
    if (this._isUndefined(newValue)) {
      return;
    }
    if (!newValue) {
      this.invalid = false;
    }
    this._attributeRepaintNeeded(newValue, oldValue);
  }

  /**
   * Force styles update
   */
  _attributeRepaintNeeded(newValue, oldValue) {
    if (newValue !== undefined && newValue !== oldValue) {
      this.updateStyles();
    }
  }

  _computeShownOptions(options, search, enableNoneOption) {
    if (this._isUndefined(options) || this._isUndefined(enableNoneOption)) {
      return;
    }

    let shownOptions = JSON.parse(JSON.stringify(options));

    if (search) {
      shownOptions = options.filter(this._itemContainsSearchString.bind(this));
      shownOptions = this._trimByShownOptionsLimit(shownOptions);
    } else if (options.length > this.shownOptionsLimit) {
      shownOptions = this._trimByShownOptionsLimit(options);
    }

    if (enableNoneOption) {
      let emptyOption = {cssClass: 'esmm-none-option'};
      emptyOption[this.optionValue] = null;
      emptyOption[this.optionLabel] = this.noneOptionLabel;
      shownOptions.unshift(emptyOption);
    }
    return shownOptions;
  }

  _trimByShownOptionsLimit(options) {
    return options.slice(0, Math.min(this.shownOptionsLimit, options.length));
  }

  _itemContainsSearchString(item) {
    return item[this.optionLabel] &&
        item[this.optionLabel].toString().toLowerCase().indexOf(this.search.toLowerCase()) > -1;
  }

  _computeShowLimitWarning(limit, shownOptions) {
    if (this._isUndefined(limit) || this._isUndefined(shownOptions)) {
      return false;
    }
    return shownOptions.length > limit;
  }

  _showNoSearchResultsWarning(noOptionsAvailable, shownOptionsLength, optionsLength) {
    if (noOptionsAvailable) {
      return false;
    }
    return (optionsLength > 0 && shownOptionsLength === 0) ||
        (shownOptionsLength === 1 && this.shownOptions[0][this.optionValue] === null);
  }

  _validCoordinates(coords) {
    return !(coords.x === 0 && coords.y === 0 &&
        coords.width === 0 && coords.height === 0 &&
        coords.left === 0 && coords.right === 0 &&
        coords.top === 0 && coords.bottom === 0);
  }

  _bottomTooCloseToViewportEdge(dropdownBottom) {
    let viewportH = this._getViewportHeight();
    return (viewportH - dropdownBottom) < 10;
  }

  _dropdownBottomOutsideViewPort(openedDropdownCoord) {
    let viewportH = this._getViewportHeight();
    let dropdownBottomY = openedDropdownCoord.top + openedDropdownCoord.height;
    let diff = viewportH - dropdownBottomY;
    return diff <= 0;
  }

  _getViewportHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  _recalculateOptionsListHeightForIE11(newComputedHeight, openedDropdownCoord, searchboxHeight) {
    if (this.isIEBrowser()) {
      let viewportH = this._getViewportHeight();
      /**
       * - if newComputedHeight is bigger than IE11 viewport we need to recalculate list height
       * or
       * - recheck bottom margin if it's visible, it might still be under viewport bottom limit in IE11
       * possible dynamicAlign issue in IE11
       */
      if (this._dropdownOpenedDownwards(openedDropdownCoord) &&
          (newComputedHeight > viewportH || this._dropdownBottomOutsideViewPort(openedDropdownCoord))) {
        newComputedHeight = this._getNewHeightRelatedToBottomViewportEdge(openedDropdownCoord, searchboxHeight);
      }

      /**
       * There is another case when the top coordinate of the dropdown is negative
       * and the height is bigger than the viewport height
       */
      if (!this._dropdownOpenedDownwards(openedDropdownCoord) && newComputedHeight > viewportH) {
        let maxDropdownHeight = viewportH - openedDropdownCoord.bottom;
        newComputedHeight = viewportH - maxDropdownHeight - searchboxHeight - 60;
        let ironDropdown = this._getIronDropdown();
        ironDropdown.style.top = '60px'; // adjust iron dropdown top to be able to see it, ugly
      }
    }
    return newComputedHeight;
  }

  _getSearchFieldHeight() {
    let searchboxHeight = 0;
    if (!this.hideSearch) {
      let searchInputWrapper = this._getSearchox();
      searchboxHeight = Number(window.getComputedStyle(searchInputWrapper).height.replace('px', ''));
    }
    return searchboxHeight;
  }

  _getNewHeightRelatedToBottomViewportEdge(openedDropdownCoord, searchboxHeight) {
    let viewportH = this._getViewportHeight();
    return viewportH - openedDropdownCoord.top - searchboxHeight - this.viewportEdgeMargin;
  }

  _resizeOptionsListHeight() {
    let ironDrContent = this._getIronDropdownContent();

    let dropdownContentHeightCheck = setInterval(function () {
      // opened dropdown coordinates
      let openedDropdownCoord = ironDrContent.getBoundingClientRect();

      // don't do anything until maxHeight is set and the dropdown has been opened
      if (ironDrContent.style.maxHeight && this._validCoordinates(openedDropdownCoord)) {
        clearInterval(dropdownContentHeightCheck);
        let drMaxHeight = Number(ironDrContent.style.maxHeight.replace('px', ''));
        let searchboxHeight = this._getSearchFieldHeight();

        // for browsers
        let listOptionsComputedHeight = drMaxHeight - searchboxHeight;
        if (this._dropdownOpenedDownwards(openedDropdownCoord) &&
            this._bottomTooCloseToViewportEdge(drMaxHeight + openedDropdownCoord.top)) {
          listOptionsComputedHeight -= this.viewportEdgeMargin;
        }

        // check if height is correctly calculated for IE11 and recalculate if needed
        listOptionsComputedHeight = this._recalculateOptionsListHeightForIE11(listOptionsComputedHeight,
            openedDropdownCoord, searchboxHeight);

        let optionsList = this._getOptionsList();
        optionsList.style.maxHeight = listOptionsComputedHeight + 'px';
      }
    }.bind(this), 0);
  }

  _onDropdownOpen() {
    this._setDropdownWidth();
    this._resizeOptionsListHeight();
    // when inside a paper-dialog the dropdown opens somewhere in the background and
    // we need to force repositioning
    this.notifyDropdownResize();
  }

  _onDropdownClose() {
    this.dropdownIsClosing = false;
    if (!this.preserveSearchOnClose) {
      this.set('search', '');
    }
  }

  _setDropdownWidth() {
    let ironDropdown = this._getIronDropdown();
    ironDropdown.style.width = this.offsetWidth + 'px';
  }

  _setFocusTarget() {
    let ironDropdown = this._getIronDropdown();
    let searchbox = this._getSearchox();
    ironDropdown.focusTarget = searchbox.shadowRoot.querySelector('#searchInput');
  }

  _setPositionTarget() {
    // set position target to align dropdown content properly
    let ironDropdown = this._getIronDropdown();
    ironDropdown.set('positionTarget', this);
  }

  _getIronDropdown() {
    return this.$.dropdownMenu;
  }

  _getIronDropdownContent() {
    return this.$.ironDrContent;
  }

  _getOptionsList() {
    return this.$.optionsList;
  }

  _getSearchox() {
    return this.$.searchbox;
  }

  _openMenu() {
    let dr = this._getIronDropdown();
    if (!dr.opened) {
      dr.open();
    }
  }

  _closeMenu(e) {
    let dr = this._getIronDropdown();
    this.dropdownIsClosing = true;
    dr.close();
  }

  /**
   * On focus received from a previous element (filds navigation in form using Tab)
   * @param e
   */
  onInputFocus(e) {
    if (this.disableOnFocusHandling || this.dropdownIsClosing) {
      return;
    }
    this._openMenu();
  }

  /**
   * TODO: this might not be needed anymore. To be removed
   * Sometimes the dropdown doesn't resize when search is changed and we need to force the resize
   */
  // _searchValueChanged(search, oldSearch) {
  //   if (this._isUndefined(search) || (this._isUndefined(oldSearch) && search === '')) {
  //     // prevent resizing at search property init
  //     return;
  //   }

  //   this.resetIronDropdownSize();
  //   this.notifyDropdownResize();
  //   this.async(function() {
  //     this._resizeOptionsListHeight();
  //   });
  // }

  notifyDropdownResize() {
    let ironDropdown = this._getIronDropdown();
    ironDropdown.notifyResize();
  }

  /**
   * Checks for IE11 browser :)
   * @returns {boolean}
   */
  isIEBrowser() {
    let userAgent = window.navigator.userAgent;
    return userAgent.indexOf('Trident/') > -1;
  }

  arrayIsNotEmpty(arr) {
    return Array.isArray(arr) && arr.length;
  }

  // prevents the element from rendering an error message container when valid
  _getErrorMessage(message, invalid) {
    return invalid ? message : '';
  }
};
