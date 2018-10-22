const IncidentModel = {
  description: '',
  incident_date: null,
  incident_time: null,
  injuries: '',
  on_duty: false,
  street: '',
  note: '',
  reported: false,
  weapons_used: [],
  latitude: '',
  longitude: ''
};

export const getIncidentModel = () => JSON.parse(JSON.stringify(IncidentModel));
