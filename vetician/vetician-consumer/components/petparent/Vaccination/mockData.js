// constants/mockData.js

export const PETS = [
  { id: 1, name: 'Rocky',    breed: 'Labrador',         age: '3 yrs', icon: 'dog'      },
  { id: 2, name: 'Whiskers', breed: 'Persian Cat',      age: '2 yrs', icon: 'cat'      },
  { id: 3, name: 'Buddy',    breed: 'Golden Retriever', age: '5 yrs', icon: 'dog-side' },
];

export const VACCINE_LIST = [
  'Rabies Vaccine',
  'DHPP Booster',
  'Bordetella',
  'Leptospirosis',
  'Influenza',
  'Lyme Disease',
];

export const VETS = [
  { id: 1, name: 'Dr. Sharma', clinic: 'PetCare Clinic' },
  { id: 2, name: 'Dr. Meena',  clinic: 'Happy Paws Vet' },
  { id: 3, name: 'Dr. Kapoor', clinic: 'City Animal Hospital' },
];

export const INITIAL_UPCOMING = [
  { id: 'u1', name: 'Distemper',     due: '20 Jun, 2025', petName: 'Buddy',    scheduledTime: null },
  { id: 'u2', name: 'Leptospirosis', due: '01 Aug, 2025', petName: 'Rocky',    scheduledTime: null },
  { id: 'u3', name: 'Bordetella',    due: '15 Sep, 2025', petName: 'Whiskers', scheduledTime: null },
];

export const INITIAL_HISTORY = [
  { id: 'h1', name: 'Rabies',     date: '10 Jan, 2025', doctor: 'Dr. Priya Sharma', clinic: 'Vetician Clinic, Koramangala', notes: 'Annual rabies booster administered without complications.' },
  { id: 'h2', name: 'Parvovirus', date: '15 Mar, 2025', doctor: 'Dr. Arjun Mehta',  clinic: 'PetCare Centre, Indiranagar',  notes: 'Routine parvovirus vaccination. Pet responded well.' },
  { id: 'h3', name: 'Distemper',  date: '02 Nov, 2024', doctor: 'Dr. Sneha Reddy',  clinic: 'Animal Wellness, HSR Layout',  notes: 'Distemper combo vaccine administered. No adverse reactions.' },
  { id: 'h4', name: 'Bordetella', date: '18 Aug, 2024', doctor: 'Dr. Priya Sharma', clinic: 'Vetician Clinic, Koramangala', notes: 'Kennel cough vaccine given prior to boarding.' },
];
