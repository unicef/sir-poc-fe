/**
 *
 * @polymer
 * @mixinFunction
 */
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
          'end_date': 'End Date',
          'location': 'Location',
          'latitude': 'Latitude',
          'longitude': 'Longitude',
          'start_date': 'Start Date',
          'crash_type': 'Crash Type',
          'criticality': 'Criticality',
          'description': 'Description',
          'vehicle_type': 'Vehicle Type',
          'incident_time': 'Incident Time',
          'incident_date': 'Incident Date',
          'dhr_review_by': 'DHR review by',
          'crash_sub_type': 'Crash Subtype',
          'eod_review_by': 'EOD review by',
          'dfam_review_by': 'DFAM review by',
          'legal_review_by': 'Legal review by',
          'threat_category': 'Threat Category',
          'incident_category': 'Incident Category',
          'contributing_factor': 'Contributing Factor',
          'incident_SUBcategory': 'Incident Subcategory',
          'staff_wellbeing_review_by': 'Staff Wellbeing review by',
          'staff_wellbeing_review_date': 'Staff Wellbeing review date'
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
