const baseUrl = "http://" + window.location.host;

export const ENDPOINTS_URL = {
  EVENTS: baseUrl + '/api/events/',
  INCIDENTS: baseUrl + '/api/incidents/',
  REGIONS: baseUrl + '/api/regions/',
  COUNTRIES: baseUrl + '/api/countries/',
  TEAMS: baseUrl + '/api/teams/',
  USERS: baseUrl + '/api/users/',
  WEAPONS: baseUrl + '/api/weapons/',
  CRITICALITIES: baseUrl + '/api/criticalities/',
  VEHICLE_TYPES: baseUrl + '/api/vehicle_types/',
  CRASH_TYPES: baseUrl + '/api/crash_types/',
  IMPACTS: baseUrl + '/api/impacts/',
  FACTORS: baseUrl + '/api/factors/',
  PROPERTY_CATEGORIES: baseUrl + '/api/property_categories/',
  INCIDENT_TYPES: baseUrl + '/api/incident_types/',
};
