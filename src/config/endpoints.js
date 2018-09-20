const baseUrl = window.location.origin;

export const Endpoints = {
  eventsList: {
    url: baseUrl + '/api/events/',
    method: 'GET'
  },
  newEvent: {
    url: baseUrl + '/api/events/',
    method: 'POST'
  },
  getEvent: {
    url: baseUrl + '/api/events/<%=id%>',
    method: 'GET'
  },
  editEvent: {
    url: baseUrl + '/api/events/<%=id%>/',
    method: 'PATCH'
  },
  getEventHistory: {
    url: baseUrl + '/api/events/<%=id%>/history/',
    method: 'GET'
  },
  incidentsList: {
    url: baseUrl + '/api/incidents/',
    method: 'GET'
  },
  newIncident: {
    url: baseUrl + '/api/incidents/',
    method: 'POST'
  },
  getIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/',
    method: 'GET'
  },
  getIncidentHistory: {
    url: baseUrl + '/api/incidents/<%=id%>/history/',
    method: 'GET'
  },
  editIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/',
    method: 'PATCH'
  },
  incidentsCommentsList: {
    url: baseUrl + '/api/comments/',
    method: 'GET'
  },
  addIncidentComment: {
    url: baseUrl + '/api/comments/',
    method: 'POST'
  },
  addIncidentEvacuation: {
    url: baseUrl + '/api/incident_evacuations/',
    method: 'POST'
  },
  editIncidentEvacuation: {
    url: baseUrl + '/api/incident_evacuations/<%=id%>/',
    method: 'PATCH'
  },
  incidentEvacuationsList: {
    url: baseUrl + '/api/incident_evacuations/',
    method: 'GET'
  },
  addIncidentProperty: {
    url: baseUrl + '/api/incident_properties/',
    method: 'POST'
  },
  editIncidentProperty: {
    url: baseUrl + '/api/incident_properties/<%=id%>/',
    method: 'PATCH'
  },
  incidentPropertiesList: {
    url: baseUrl + '/api/incident_properties/',
    method: 'GET'
  },
  addIncidentPremise: {
    url: baseUrl + '/api/incident_premises/',
    method: 'POST'
  },
  editIncidentPremise: {
    url: baseUrl + '/api/incident_premises/<%=id%>/',
    method: 'PATCH'
  },
  incidentPremisesList: {
    url: baseUrl + '/api/incident_premises/',
    method: 'GET'
  },
  addIncidentProgramme: {
    url: baseUrl + '/api/incident_programmes/',
    method: 'POST'
  },
  editIncidentProgramme: {
    url: baseUrl + '/api/incident_programmes/<%=id%>/',
    method: 'PATCH'
  },
  incidentProgrammesList: {
    url: baseUrl + '/api/incident_programmes/',
    method: 'GET'
  },
  addIncidentPersonnel: {
    url: baseUrl + '/api/incident_involved/',
    method: 'POST'
  },
  editIncidentPersonnel: {
    url: baseUrl + '/api/incident_involved/<%=id%>/',
    method: 'PATCH'
  },
  incidentPersonnelList: {
    url: baseUrl + '/api/incident_involved/',
    method: 'GET'
  },
  cities: {
    url: baseUrl + '/api/cities/',
    method: 'GET'
  },
  regions: {
    url: baseUrl + '/api/regions/',
    method: 'GET'
  },
  countries: {
    url: baseUrl + '/api/countries/',
    method: 'GET'
  },
  teams: {
    url: baseUrl + '/api/teams/',
    method: 'GET'
  },
  users: {
    url: baseUrl + '/api/users/',
    method: 'GET'
  },
  weapons: {
    url: baseUrl + '/api/weapons/',
    method: 'GET'
  },
  criticalities: {
    url: baseUrl + '/api/criticalities/',
    method: 'GET'
  },
  vehicleTypes: {
    url: baseUrl + '/api/vehicle_types/',
    method: 'GET'
  },
  crashTypes: {
    url: baseUrl + '/api/crash_types/',
    method: 'GET'
  },
  crashSubTypes: {
    url: baseUrl + '/api/crash_subtypes/',
    method: 'GET'
  },
  agencies: {
    url: baseUrl + '/api/agencies/',
    method: 'GET'
  },
  factors: {
    url: baseUrl + '/api/factors/',
    method: 'GET'
  },
  targets: {
    url: baseUrl + '/api/target/',
    method: 'GET'
  },
  incidentCategories: {
    url: baseUrl + '/api/incident_categories/',
    method: 'GET'
  },
  threatCategories: {
    url: baseUrl + '/api/threat_categories/',
    method: 'GET'
  },
  personImpacts: {
    url: baseUrl + '/api/impacts/person/',
    method: 'GET'
  },
  propertyImpacts: {
    url: baseUrl + '/api/impacts/property/',
    method: 'GET'
  },
  programmeImpacts: {
    url: baseUrl + '/api/impacts/programme/',
    method: 'GET'
  },
  evacuationImpacts: {
    url: baseUrl + '/api/impacts/evacuation/',
    method: 'GET'
  },
  personnelCategories: {
    url: baseUrl + '/api/person_categories/',
    method: 'GET'
  },
  unLocations: {
    url: baseUrl + '/api/un_locations/',
    method: 'GET'
  },
  propertyTypes: {
    url: baseUrl + '/api/property_types/',
    method: 'GET'
  },
  nationalities: {
    url: baseUrl + '/api/nationalities/',
    method: 'GET'
  },
  premisesTypes: {
    url: baseUrl + '/api/premise_types/',
    method: 'GET'
  },
  programmeScopes: {
    url: baseUrl + '/api/scope/',
    method: 'GET'
  },
  programmeAreas: {
    url: baseUrl + '/api/area/',
    method: 'GET'
  },
  programmeTypes: {
    url: baseUrl + '/api/programme_types/',
    method: 'GET'
  },
};
