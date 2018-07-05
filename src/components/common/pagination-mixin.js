
const PaginationMixin = baseClass => class extends baseClass {
  static get properties() {
    return {
      pagination: {
        type: Object,
        value: {
          pageNumber: 1,
          pageSize: 10,
          totalResults: 0
        }
      }
    };
  }
  static get observers() {
    return [
      'resetPageNumber(pagination.pageSize, q)'
    ];
  }

  resetPageNumber() {
    this.set('pagination.pageNumber', 1);
  }

  applyPagination(filteredList) {
    if (!filteredList || ! filteredList.length) {
      this.set('pagination.totalResults', 0);
      return [];
    }
    this.set('pagination.totalResults', filteredList.length);

    let pageNumber = Number(this.pagination.pageNumber);
    let pageSize = Number(this.pagination.pageSize);
    let startingIndex = (pageNumber - 1) * pageSize;
    return filteredList.slice(startingIndex, startingIndex + pageSize);
  }
}

export default PaginationMixin;
