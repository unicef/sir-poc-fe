import { PermissionsBase } from './permissions-base-class';
import ListCommonMixin from './list-common-mixin';
import PaginationMixin from './pagination-mixin';
import DateMixin from './date-mixin';
import { updateAppState } from './navigation-helper';

export class ListBaseClass extends DateMixin(PaginationMixin(PermissionsBase)) {
  static get properties() {
    return {
      _lastQueryString: {
        type: String,
        value: '',
        observer: '_queryStringChanged'
      },
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
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

  initFilters() {
    console.warn('List filters not initiated!');
  }

  _visibilityChanged(visible) {
    if (visible && this._lastQueryString !== '') {
      updateAppState(window.location.pathname, this._lastQueryString, false);
    }
  }

  handleQueryParamsChange(queryParams) {
    if (typeof queryParams !== 'undefined') {
      this.updateFilters(queryParams);
    }
  }

  _queryStringChanged(qs) {
    if (!this.visible || !qs) {
      return false;
    }

    updateAppState(window.location.pathname, qs, false);
  }

  _updateUrlQuery() {
    this.set('_lastQueryString', this.serializeFilters(this.filters.values));
  }

  updateFilters(queryParams) {
    if (queryParams && this.visible) {
      this.set('filters.values', this.deserializeFilters(queryParams));
    }
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

    this._updateUrlQuery();
    this.filteredItems = this.applyPagination(filteredItems);
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
