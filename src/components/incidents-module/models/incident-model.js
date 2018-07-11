export const IncidentModel = {
  description: '',
  incident_date: '',
  incident_time: '',
  injuries: '',
  note: '',
  primary_person: {
  contact: '',
  date_of_birth: '',
  first_name: '',
  job_title: '',
  last_name: '',
  nationality: '',
  type_of_contract: '',
  un_employer: ''
  },
  region: '',
  reported_to: '',
  responsible: '',
  status: '',
  street: '',
  weapons_used: [],
  //TOOD
  last_modify_user: 1,
  primary_person: {
    date_of_birth: '1970-01-01',
    nationality: '-',
    gender: 'male',
    un_employer: '-',
    job_title: '-',
    type_of_contract: '-',
    contact: '-'
  },
  reported: false,
  submitted_by: 1,
  status: 'submitted'
}
