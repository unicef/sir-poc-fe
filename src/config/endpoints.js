const baseUrl = "http://" + window.location.host;

export const Endpoints = {
  eventsList: {
    url: baseUrl + "/api/events/",
    method: 'GET'
  },
  newEvent: {
    url: baseUrl + "/api/events/",
    method: 'POST'
  },
  getEvent: {
    url: baseUrl + "/api/events/<%=id%>",
    method: 'GET'
  },
  editEvent: {
    url: baseUrl + "/api/events/<%=id%>/",
    method: 'PUT'
  },
  incidentsList: {
    url: baseUrl + "/api/incidents/",
    method: 'GET'
  },
  newIncident: {
    url: baseUrl + "/api/incidents/",
    method: 'POST'
  },
  editIncident: {
    url: baseUrl + "/api/incidents/<%=id%>/",
    method: 'PUT'
  },
  regions: {
    url: baseUrl + "/api/regions/",
    method: 'GET'
  },
  countries: {
    url: baseUrl + "/api/countries/",
    method: 'GET'
  },
  teams: {
    url: baseUrl + "/api/teams/",
    method: 'GET'
  },
  users: {
    url: baseUrl + "/api/users/",
    method: 'GET'
  },
  weapons: {
    url: baseUrl + "/api/weapons/",
    method: 'GET'
  },
  criticalities: {
    url: baseUrl + "/api/criticalities/",
    method: 'GET'
  },
  vehicleTypes: {
    url: baseUrl + "/api/vehicle_types/",
    method: 'GET'
  },
  crashTypes: {
    url: baseUrl + "/api/crash_types/",
    method: 'GET'
  },
  impacts: {
    url: baseUrl + "/api/impacts/",
    method: 'GET'
  },
  factors: {
    url: baseUrl + "/api/factors/",
    method: 'GET'
  },
  propertyCategories: {
    url: baseUrl + "/api/property_categories/",
    method: 'GET'
  },
  incidentTypes: {
    url: baseUrl + "/api/incident_types/",
    method: 'GET'
  }

};
