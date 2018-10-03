const IncidentModel = {
  description: null,
  incident_date: null,
  incident_time: null,
  injuries: null,
  on_duty: false,
  region: null,
  street: '',
  note: '',
  reported: false,
  weapons_used: [],
  latitude: null,
  longitude: null,
  primary_person: {
    first_name: '',
    last_name: '',
    gender: '',
    type_of_contract: ''
  }
};

export const getIncidentModel = () => JSON.parse(JSON.stringify(IncidentModel));
