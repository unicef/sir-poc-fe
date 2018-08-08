const HistoryHelpers = baseClass => class extends baseClass {
  static get properties() {
    return {
      labelsMap: {
        type: Object,
        value: {
          'city': 'City',
          'note': 'Note',
          'event': 'Event',
          'region': 'Region',
          'street': 'Street',
          'target': 'Target',
          'country': 'Country',
          'on_duty': 'On Duty',
          'injuries': 'Injuries',
          'reported': 'Reported',
          'crash_type': 'Crash Type',
          'criticality': 'Criticality',
          'description': 'Description',
          'reported_to': 'Reported To',
          'responsible': 'Responsible Party',
          'vehicle_type': 'Vehicle Type',
          'incident_time': 'Incident Time',
          'incident_date': 'Incident Date',
          'threat_category': 'Threat Category',
          'incident_category': 'Incident Category',
          'contributing_factor': 'Contributing Factor'
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
