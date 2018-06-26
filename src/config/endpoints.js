const baseUrl = "http://" + window.location.host;
export const Endpoints = {
  eventsList: {
    url: baseUrl + "/api/events/",
    method: 'GET',
    auth: true
  },
  newEvent: {
    url: baseUrl + "/api/events/",
    method: 'POST',
    auth: true
  },
  incidentsList: {
    url: baseUrl + "/api/incidents/",
    method: 'GET',
    auth: true
  },
  newIncident: {
    url: baseUrl + "/api/incidents/",
    method: 'POST',
    auth: true
  },
  regions: {
    url: baseUrl + "/api/regions/",
    method: 'GET',
    auth: true
  },
  countries: {
    url: baseUrl + "/api/countries/",
    method: 'GET',
    auth: true
  },
  teams: {
    url: baseUrl + "/api/teams/",
    method: 'GET',
    auth: true
  },
  users: {
    url: baseUrl + "/api/users/",
    method: 'GET',
    auth: true
  },
  weapons: {
    url: baseUrl + "/api/weapons/",
    method: 'GET',
    auth: true
  },
  criticalities: {
    url: baseUrl + "/api/criticalities/",
    method: 'GET',
    auth: true
  },
  vehicleTypes: {
    url: baseUrl + "/api/vehicle_types/",
    method: 'GET',
    auth: true
  },
  crashTypes: {
    url: baseUrl + "/api/crash_types/",
    method: 'GET',
    auth: true
  },
  impacts: {
    url: baseUrl + "/api/impacts/",
    method: 'GET',
    auth: true
  },
  factors: {
    url: baseUrl + "/api/factors/",
    method: 'GET',
    auth: true
  },
  propertyCategories: {
    url: baseUrl + "/api/property_categories/",
    method: 'GET',
    auth: true
  },
  incidentTypes: {
    url: baseUrl + "/api/incident_types/",
    method: 'GET',
    auth: true
  }

};
