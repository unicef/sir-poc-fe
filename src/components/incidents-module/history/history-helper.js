const labelsMap  = {
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
  };


export const getLabelForField = (key) => {
  return labelsMap[key] || key;
}
