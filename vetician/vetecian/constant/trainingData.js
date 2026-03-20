// constant/trainingData.js
// Vatecian App — Static data for Pet Training screen

export const TRAINING_CATEGORIES = [
  { id: '1', name: 'Obedience',   description: 'Sit, stay, come & leash skills',      icon: 'paw',          color: '#558B2F' },
  { id: '2', name: 'Agility',     description: 'Speed, jumps & obstacle courses',      icon: 'run-fast',     color: '#7CB342' },
  { id: '3', name: 'Socialising', description: 'Confidence with people & other pets',  icon: 'dog',          color: '#33691E' },
  { id: '4', name: 'Puppy',       description: 'Potty, crate & bite inhibition',       icon: 'paw',          color: '#8BC34A' },
  { id: '5', name: 'Tricks',      description: 'Fun commands & advanced tricks',       icon: 'star-circle',  color: '#558B2F' },
];

export const FEATURED_TRAINER = {
  id: 't1',
  name: 'Arjun Mehta',
  description: 'Certified dog behaviourist with 8+ years helping pets build confidence, reduce anxiety and master obedience.',
  experience: '8',
  rating: 4.9,
  reviews: 214,
  avatar: 'https://i.pravatar.cc/150?img=12',
  specializations: ['Obedience', 'Behaviour', 'Puppy Training', 'Agility'],
};

export const TRAINING_PROGRAMS = [
  {
    id: 'p1',
    name: 'Basic Obedience',
    level: 'Beginner',
    duration: '4 Weeks',
    sessions: 12,
    price: 4999,
    focus: 'Sit, Stay, Come, Leash walking and basic impulse control.',
  },
  {
    id: 'p2',
    name: 'Puppy Starter Pack',
    level: 'Puppy',
    duration: '3 Weeks',
    sessions: 9,
    price: 3499,
    focus: 'Potty training, bite inhibition, crate training and socialisation.',
  },
  {
    id: 'p3',
    name: 'Advanced Behaviour',
    level: 'Advanced',
    duration: '6 Weeks',
    sessions: 18,
    price: 7999,
    focus: 'Off-leash control, aggression management and complex commands.',
  },
];

export const PETS = [
  { id: 'pet1', name: 'Bruno',  breed: 'Labrador',         avatar: 'https://i.pravatar.cc/80?img=1' },
  { id: 'pet2', name: 'Milo',   breed: 'Beagle',           avatar: 'https://i.pravatar.cc/80?img=2' },
  { id: 'pet3', name: 'Bella',  breed: 'Golden Retriever', avatar: 'https://i.pravatar.cc/80?img=3' },
];

export const TRAINERS = [
  'Arjun Mehta',
  'Priya Sharma',
  'Rohit Verma',
];

export const TIME_SLOTS = [
  '8:00 AM – 9:00 AM',
  '10:00 AM – 11:00 AM',
  '12:00 PM – 1:00 PM',
  '3:00 PM – 4:00 PM',
  '5:00 PM – 6:00 PM',
];
