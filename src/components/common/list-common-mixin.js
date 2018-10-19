
/**
 *
 * @polymer
 * @mixinFunction
 */
const ListCommonMixin = superClass => class extends superClass {

  static get properties() {
    return {
      showToggleFiltersBtn: {
        type: Boolean,
        value: false,
        observer: '_showToggleFiltersBtnChanged'
      }
    };
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

  // Outputs the query string for the list
  _buildUrlQueryString(filters) {
    let queryParams = [];

    for (let field in filters) {
      if (filters[field]) {
        let filterValue = filters[field];
        let filterUrlValue;

        let filterValType = filterValue instanceof Array ? 'array' : typeof filterValue;

        switch (filterValType) {
          case 'array':
            if (filterValue.length > 0) {
              filterUrlValue = filterValue.join('|');
            }
            break;
          case 'object':
            if (field === 'sort' && filterValue.field && filterValue.direction) {
              filterUrlValue = filterValue.field + '.' + filterValue.direction;
            }
            break;
          default:
            if (!(field === 'page' && filterValue === 1)) { // do not include page if page=1
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

};

export default ListCommonMixin;
