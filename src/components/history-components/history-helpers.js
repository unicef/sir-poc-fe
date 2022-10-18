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
          'date': 'Date',
          'note': 'Note',
          'area': 'Area',
          'value': 'Value',
          'scope': 'Scope',
          'event': 'Event',
          'status': 'Status',
          'impact': 'Impact',
          'region': 'Region',
          'street': 'Street',
          'target': 'Target',
          'agency': 'Agency',
          'country': 'Country',
          'on_duty': 'On Duty',
          'to_city': 'To City',
          'injuries': 'Injuries',
          'end_date': 'End Date',
          'location': 'Location',
          'latitude': 'Latitude',
          'from_city': 'From City',
          'to_region': 'To Region',
          'longitude': 'Longitude',
          'to_country': 'To Country',
          'start_date': 'Start Date',
          'crash_type': 'Crash Type',
          'from_region': 'From Region',
          'criticality': 'Criticality',
          'description': 'Description',
          'from_country': 'From Country',
          'premise_type': 'Premise Type',
          'capture_date': 'Capture Date',
          'release_date': 'Release Date',
          'vehicle_type': 'Vehicle Type',
          'un_location': 'Unicef Location',
          'property_type': 'Property Type',
          'incident_time': 'Incident Time',
          'incident_date': 'Incident Date',
          'dhr_review_by': 'DHR review by',
          'eod_review_by': 'EOD review by',
          'crash_sub_type': 'Crash Subtype',
          'programme_type': 'Programme Type',
          'dfam_review_by': 'DFAM review by',
          'legal_review_by': 'Legal review by',
          'number_national': 'Number National',
          'threat_category': 'Threat Category',
          'incident_category': 'Incident Category',
          'contributing_factor': 'Contributing Factor',
          'next_of_kin_notified': 'Next Of Kin Notified',
          'number_international': 'Number International',
          'incident_SUBcategory': 'Incident Subcategory',
          'staff_wellbeing_review_by': 'Staff Wellbeing review by',
          'number_national_dependants': 'Number National Dependants',
          'staff_wellbeing_review_date': 'Staff Wellbeing review date',
          'number_international_dependants': 'Number International Dependants',
          'person_category': 'Personnel Category',
          'person_date_of_birth': 'Date of Birth',
          'person_index_number': 'Index Number',
          'person_nationality': 'Nationality',
          'person_first_name': 'First name',
          'person_job_title': 'Job Title',
          'person_last_name': 'Last name',
          'person_address': 'Address',
          'person_country': 'Country',
          'person_contact': 'Contact',
          'person_agency': 'Agency',
          'person_gender': 'Gender',
          'person_sex': 'Sex',
          'person_region': 'Region',
          'person_email': 'Email',
          'person_city': 'City'
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
