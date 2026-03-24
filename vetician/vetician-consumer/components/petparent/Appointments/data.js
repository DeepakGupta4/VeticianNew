// constants/data.js

export const SERVICES = [
  { id: 'vet',        label: 'Vet Visit',    icon: 'local-hospital' },
  { id: 'grooming',   label: 'Grooming',     icon: 'content-cut'    },
  { id: 'training',   label: 'Training',     icon: 'fitness-center' },
  { id: 'vaccination',label: 'Vaccination',  icon: 'vaccines'       },
];

export const PETS = [
  { id: '1', name: 'Rocky',    breed: 'Labrador',         icon: 'dog'      },
  { id: '2', name: 'Whiskers', breed: 'Persian Cat',      icon: 'cat'      },
  { id: '3', name: 'Buddy',    breed: 'Golden Retriever', icon: 'dog-side' },
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

export const MOCK_APPOINTMENTS = [
  {
    id:          'a1',
    service:     'Grooming',
    serviceIcon: 'content-cut',
    pet:         'Rocky',
    petIcon:     'dog',
    date:        '12 March, 2025',
    time:        '11:00 AM',
    status:      'upcoming',
    address:     '24 Green Paws Clinic, MG Road',
    assignedTo:  'Dr. Priya Sharma',
    notes:       'Full body grooming + nail trim',
  },
  {
    id:          'a2',
    service:     'Vet Visit',
    serviceIcon: 'local-hospital',
    pet:         'Whiskers',
    petIcon:     'cat',
    date:        '05 Feb, 2025',
    time:        '10:00 AM',
    status:      'completed',
    address:     '24 Green Paws Clinic, MG Road',
    assignedTo:  'Dr. Arjun Mehta',
    notes:       'Annual health checkup',
  },
  {
    id:          'a3',
    service:     'Vaccination',
    serviceIcon: 'vaccines',
    pet:         'Buddy',
    petIcon:     'dog-side',
    date:        '20 Jan, 2025',
    time:        '02:00 PM',
    status:      'cancelled',
    address:     '24 Green Paws Clinic, MG Road',
    assignedTo:  'Dr. Priya Sharma',
    notes:       '',
  },
];
