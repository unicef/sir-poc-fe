import { PermissionsBase } from './permissions-base-class';
import PaginationMixin from './pagination-mixin';
import DateMixin from './date-mixin';
import { updateAppState } from './navigation-helper';
import { store } from '../../redux/store.js';
import { getUserName } from '../common/utils.js';

export class ListBaseClass extends DateMixin(PaginationMixin(PermissionsBase)) {
  static get properties() {
    return {
      lastQueryString: {
        type: String,
        value: '',
        observer: 'queryStringChanged'
      },
      visible: {
        type: Boolean,
        observer: 'visibilityChanged'
      },
      listItems: {
        type: Object,
        value: []
      },
      filteredItems: {
        type: Array
      },
      filters: {
        type: Object,
        value: {
          values: {},
          handlers: {}
        }
      },
      sortingOptions: {
        type: Array,
        value: []
      },
      selectedSorting: {
        type: Object,
        value: null
      },
      getUserName: {
        type: Function,
        value: () => getUserName
      },
      showToggleFiltersBtn: {
        type: Boolean,
        value: false,
        observer: '_showToggleFiltersBtnChanged'
      }
    };
  }

  static get observers() {
    return [
      'filterData(listItems)',
      'filterData(pagination.*)',
      'filterData(filters.values.*)',
      'filterData(selectedSorting)'
    ];
  }

  connectedCallback() {
    this.initFilters(); // causes slow filter init if not first
    super.connectedCallback();
    this.initSorting();
    this.loadFiltersFromQueryParams();
    this.checkForDefaultFilter();
  }

  loadFiltersFromQueryParams() {
    let queryParams = store.getState().app.locationInfo.queryParams;
    if (typeof queryParams !== 'undefined') {
      let filters = this.deserializeFilters(queryParams);
      this.set('filters.values', filters);
      this.setSorting(filters.sort);
    }
  }

  initFilters() {
    console.warn('List filters not initiated!');
  }

  initSorting() {
    console.warn('Sorting options not initiated!');
  }

  checkForDefaultFilter() {
    if (!this.selectedSorting) {
      let defaultSorting = this.sortingOptions.find(option => option.default);
      this.selectedSorting =  {...defaultSorting};
    }
  }

  setSorting(sortingId) {
    this.selectedSorting = this.sortingOptions.find(option => option.id === sortingId);
  }

  visibilityChanged(visible) {
    if (visible && this.lastQueryString !== '') {
      // reinstates old filters when navigating back to the list
      this.addQueryStringToUrl();
    }
  }

  queryStringChanged(qs) {
    if (!this.visible || !qs) {
      return false;
    }

    this.addQueryStringToUrl();
  }

  addQueryStringToUrl() {
    updateAppState(window.location.pathname, this.lastQueryString, false);
  }

  filterData() {
    if (!this.visible || !this.selectedSorting) {
      return false;
    }
    let filteredItems = JSON.parse(JSON.stringify(this.listItems));
    let allFilters = Object.keys(this.filters.handlers);

    filteredItems = filteredItems.filter((incident) => {
      for (let i = 0; i < allFilters.length; i++) {
        let key = allFilters[i];
        let value = this.filters.values[key];
        let handler = this.filters.handlers[key];
        if (!handler(incident, value)) {
          return false;
        }
      }
      return true;
    });

    filteredItems.sort(this.selectedSorting.method);

    this.updateFiltersQueryString();
    this.filteredItems = this.applyPagination(filteredItems);
  }

  updateFiltersQueryString() {
    this.set('lastQueryString', this.serializeFilters({
      ...this.filters.values,
      sort: this.selectedSorting.id
    }));
  }

  _showToggleFiltersBtnChanged(show) {
    if (!this.$.collapse) {
      return;
    }
    if ((show && this.$.collapse.opened) || (!show && !this.$.collapse.opened)) {
      this._toggleFilters();
    }
  }

  _toggleFilters() {
    if (this.$.collapse) {
      this.$.collapse.toggle();
    }
    if (this.$.toggleIcon) {
      this.$.toggleIcon.icon = this.$.collapse.opened ? 'icons:expand-less' : 'icons:expand-more';
    }
  }

  _alphabeticalSort(left, right)  {
    if (left < right) {
      return -1;
    }
    if (left > right) {
      return 1;
    }
    return 0;
  }

  deserializeFilters(query) {
    let result = {};
    Object.keys(query).forEach((key) => {
      if (query[key].startsWith('|')) {
        result[key] = query[key].substring(1).split('|');
        return;
      }

      result[key] = query[key];
    });

    return result;
  }

  serializeFilters(filters) {
    let queryParams = [];

    for (let field in filters) {
      if (filters[field]) {
        let filterValue = filters[field];
        let filterUrlValue;

        let filterValType = filterValue instanceof Array ? 'array' : typeof filterValue;

        switch (filterValType) {
          case 'array':
            if (filterValue.length > 0) {
              filterUrlValue = '|' + filterValue.join('|');
            }
            break;
          case 'object':
            if (field === 'sort' && filterValue.field && filterValue.direction) {
              filterUrlValue = filterValue.field + '.' + filterValue.direction;
            }
            break;
          default:
            if (field !== 'page' || filterValue !== 1) { // do not include page if page=1
              filterUrlValue = String(filterValue).trim();
            }
        }

        if (filterUrlValue) {
          queryParams.push(field + '=' + filterUrlValue);
        }
      }
    }
    return queryParams.join('&');
  }
}
