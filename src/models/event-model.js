const EventModel = {
  description: '',
  end_date: '',
  location: '',
  note: '',
  start_date: ''
};

export const getEventModel = () => JSON.parse(JSON.stringify(EventModel));
