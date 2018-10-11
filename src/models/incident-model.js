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
  longitude: '',
  primary_person: {
    first_name: '',
    last_name: '',
    type_of_contract: ''
  }
};

export const getIncidentModel = () => JSON.parse(JSON.stringify(IncidentModel));
