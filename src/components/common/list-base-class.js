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
      'filterData(filters.values.*)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadFiltersFromQueryParams();
  }

  loadFiltersFromQueryParams() {
    let queryParams = store.getState().app.locationInfo.queryParams;
    if (typeof queryParams !== 'undefined') {
      this.set('filters.values', this.deserializeFilters(queryParams));
    }
  }

  initFilters() {
    console.warn('List filters not initiated!');
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
    if (!this.visible) {
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

    filteredItems.sort((left, right) => {
      return moment.utc(right.last_modify_date).diff(moment.utc(left.last_modify_date));
    });

    this.updateFiltersQueryString();
    this.filteredItems = this.applyPagination(filteredItems);
  }

  updateFiltersQueryString() {
    this.set('lastQueryString', this.serializeFilters(this.filters.values));
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
