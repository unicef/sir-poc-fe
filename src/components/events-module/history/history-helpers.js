const HistoryHelpers = baseClass => class extends baseClass {
  static get properties() {
    return {
      labelsMap: {
        type: Object,
        value: {
          'note': 'Note',
          'location': 'Location',
          'end_date': 'End Date',
          'start_date': 'Start Date',
          'description': 'Description'
        }
      }
    };
  }

  getLabelForField(key) {
    return this.labelsMap[key] || key;
  }

  hasChangedFilds(changesObj) {
    // length > 1 because changesObj.version does not count as a change
    return Object.keys(changesObj).length > 1;
  }
};

export default HistoryHelpers;
