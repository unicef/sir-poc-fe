const baseUrl = window.location.origin;

export const Endpoints = {
  myKey: {
    url: baseUrl + '/api/profile/key/',
    method: 'GET'
  },
  myProfile: {
    url: baseUrl + '/api/profile/',
    method: 'GET'
  },
  requestAccess: {
    url: baseUrl + '/api/register/',
    method: 'POST'
  },
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
  exportIncidentsList: {
    url: baseUrl + '/api/incidents/?<%=queryString%>',
    method: 'GET',
    handleAs: 'blob'
  },
  newIncident: {
    url: baseUrl + '/api/incidents/',
    method: 'POST'
  },
  getIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/',
    method: 'GET'
  },
  exportSingleIncident: {
    url: baseUrl + '/api/incidents/?format=<%=docType%>&id=<%=id%>',
    method: 'GET',
    handleAs: 'blob'
  },
  getIncidentHistory: {
    url: baseUrl + '/api/incidents/<%=id%>/history/',
    method: 'GET'
  },
  notifySpecificUser: {
    url: baseUrl + '/api/incident/<%=incidentId%>/alert/user/<%=userId%>/',
    method: 'GET'
  },
  editIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/',
    method: 'PATCH'
  },
  deleteIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/',
    method: 'DELETE'
  },
  submitIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/submit/',
    method: 'PUT'
  },
  rejectIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/reject/',
    method: 'PUT'
  },
  approveIncident: {
    url: baseUrl + '/api/incidents/<%=id%>/approve/',
    method: 'PUT'
  },
  reviewIncidentEOD: {
    url: baseUrl + '/api/incidents/<%=id%>/eod_review/',
    method: 'PUT'
  },
  reviewIncidentDHR: {
    url: baseUrl + '/api/incidents/<%=id%>/dhr_review/',
    method: 'PUT'
  },
  reviewIncidentDFAM: {
    url: baseUrl + '/api/incidents/<%=id%>/dfam_review/',
    method: 'PUT'
  },
  reviewIncidentLegal: {
    url: baseUrl + '/api/incidents/<%=id%>/legal_review/',
    method: 'PUT'
  },
  reviewIncidentStaffWellbeing: {
    url: baseUrl + '/api/incidents/<%=id%>/staff_wellbeing_review/',
    method: 'PUT'
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
  getIncidentEvacuationHistory: {
    url: baseUrl + '/api/incident_evacuations/<%=id%>/history/',
    method: 'GET'
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
  getIncidentPropertyHistory: {
    url: baseUrl + '/api/incident_properties/<%=id%>/history/',
    method: 'GET'
  },
  incidentPropertiesList: {
    url: baseUrl + '/api/incident_properties/',
    method: 'GET'
  },
  addIncidentAttachments: {
    url: baseUrl + '/api/incident_attachments/',
    method: 'POST'
  },
  editIncidentAttachments: {
    url: baseUrl + '/api/incident_attachments/<%=id%>/',
    method: 'PATCH'
  },
  deleteIncidentAttachment: {
    url: baseUrl + '/api/incident_attachments/<%=id%>/',
    method: 'DELETE'
  },
  addIncidentPremise: {
    url: baseUrl + '/api/incident_premises/',
    method: 'POST'
  },
  editIncidentPremise: {
    url: baseUrl + '/api/incident_premises/<%=id%>/',
    method: 'PATCH'
  },
  getIncidentPremiseHistory: {
    url: baseUrl + '/api/incident_premises/<%=id%>/history/',
    method: 'GET'
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
  getIncidentProgrammeHistory: {
    url: baseUrl + '/api/incident_programmes/<%=id%>/history/',
    method: 'GET'
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
  getIncidentPersonnelHistory: {
    url: baseUrl + '/api/incident_involved/<%=id%>/history/',
    method: 'GET'
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
    method: 'GET',
    cachingPeriod: 60000
  },
  countries: {
    url: baseUrl + '/api/countries/',
    method: 'GET',
    cachingPeriod: 60000
  },
  teams: {
    url: baseUrl + '/api/teams/',
    method: 'GET'
  },
  usersSearch: {
    url: baseUrl + '/api/users/?q=<%=search%>',
    method: 'GET'
  },
  getUsers: {
    url: baseUrl + '/api/users/?user_id__inlist=<%=id%>'
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
  injuries: {
    url: baseUrl + '/api/injuries_sustained/',
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
  changeIncidentsToDraft: {
    url: baseUrl + '/api/incidents/mark_as_draft/?id__inlist=<%=id%>',
    method: 'PUT'
  },
  changeOwnerShip: {
    url: baseUrl + '/api/incidents/change_ownership/<%=profId%>/?id__inlist=<%=id%>',
    method: 'PUT'
  },
  reportingList: {
    url: baseUrl + '/api/users/in_country_by_teams/<%=id%>/?user__is_active=True',
    method: 'GET'
  }
};
