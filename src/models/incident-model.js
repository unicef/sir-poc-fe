const IncidentModel = {
  description: '',
  status: 'new',
  incident_date: null,
  incident_time: null,
  injuries: '',
  on_duty: false,
  street: '',
  note: '',
  reported: false,
  weapons_used: [],
  attachments: [],
  latitude: '',
  longitude: ''
};

export const getIncidentModel = () => JSON.parse(JSON.stringify(IncidentModel));
