import { CommonFunctionality } from 'etools-dropdown/mixins/common-mixin.js';
import { Endpoints } from '../../../config/endpoints.js';
import { makeRequest, prepareEndpoint } from '../request-helper.js';


export const UsersDDCommonFunctionality = (superClass) => class extends CommonFunctionality(superClass) {
  static get properties() {
    return {
      ...super.properties,
      optionValue: {
        type: String,
        value: 'id'
      },
      optionLabel: {
        type: String,
        value: 'name'
      },
      preserveSearchOnClose: {
        type: Boolean,
        value: true
      }
    }
  }

  static get observers() {
    return [
      'resetIronDropdownSize(shownOptions.length)'
    ];
  }

  _computeShownOptions(options = [], search, enableNoneOption) {
    if (this._isUndefined(enableNoneOption)) {
      return;
    }

    if (search && search.length > 2 && !options.length) {
      this._fetchOptionsList();
      return;
    }

    if (options.length && (!search || search.length < 3)) {
      this.options = [];
    }

    let shownOptions = [...options];

    if (search && options.length) {
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

  _fetchOptionsList() {
    let endpoint = prepareEndpoint(Endpoints.usersSearch, {search: this.search});

    makeRequest(endpoint).then((result) => {
      this.options = result.map((elem) => {
        elem.name = elem.display_name || (elem.first_name + ' ' + elem.last_name);
        return elem;
      })
      console.log('new options are:', ...this.options);
    });
  }
};
