import { CommonFunctionality } from '@unicef-polymer/etools-dropdown/mixins/common-mixin.js';
import { Endpoints } from '../../../config/endpoints.js';
import { makeRequest, prepareEndpoint } from '../request-helper.js';

export const UsersDDCommonFunctionality = superClass => class extends CommonFunctionality(superClass) {
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
      },
      options: {
        type: Array,
        value: []
      }
    };
  }

  static get observers() {
    return [
      'resetIronDropdownSize(shownOptions.length)',
      '_searchChanged(search)'
    ];
  }

  _searchChanged(search) {
    if (search && this.hasThreeChars(search) && !this.options.length) {
      this._fetchOptionsList();
      return;
    }

    if (this.options.length && (!search || !this.hasThreeChars(search))) {
      this.options = [];
    }
  }

  _fetchOptionsList() {
    let endpoint = prepareEndpoint(Endpoints.usersSearch, {search: this.search});

    makeRequest(endpoint).then((result) => {
      this.options = result.map((elem) => {
        elem.name = elem.display_name || (elem.first_name + ' ' + elem.last_name);
        return elem;
      });
    });
  }

  hasThreeChars(string) {
    return string.length > 2;
  }
};
