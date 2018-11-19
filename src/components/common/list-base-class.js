import { PermissionsBase } from './permissions-base-class';
import ListCommonMixin from './list-common-mixin';
import PaginationMixin from './pagination-mixin';
import DateMixin from './date-mixin';
import { updateAppState } from './navigation-helper';

export class ListBaseClass extends DateMixin(PaginationMixin(ListCommonMixin(PermissionsBase))) {
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
      // this should be redefined by children
      filters: {
        type: Object,
        value: {
          values: {},
          handlers: {}
        }
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

  _stateChanged(state) {
    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this.updateFilters(state.app.locationInfo.queryParams);
    }
  }

  initFilters() {
    console.warn('List filters not initiated!');
  }

  _visibilityChanged(visible) {
    if (visible && this._lastQueryString !== '') {
      updateAppState(window.location.pathname, this._lastQueryString, false);
    }
  }

  _queryStringChanged(qs) {
    if (!this.visible || !qs) {
      return false;
    }

    updateAppState(window.location.pathname, qs, false);
  }

  _updateUrlQuery() {
    this.set('_lastQueryString', this._buildUrlQueryString(this.filters.values));
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

}
