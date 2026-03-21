// constants/trainingData.js
// Vatecian App — Pet Training Static Data

export const TRAINING_CATEGORIES = [
  {
    id: '1',
    name: 'Basic Obedience',
    description: 'Core commands for everyday life',
    icon: 'paw',
  },
  {
    id: '2',
    name: 'Puppy Training',
    description: 'Early learning for young pets',
    icon: 'dog',
  },
  {
    id: '3',
    name: 'Behavior Correction',
    description: 'Fix unwanted habits effectively',
    icon: 'shield-check',
  },
  {
    id: '4',
    name: 'Advanced Training',
    description: 'Complex commands and discipline',
    icon: 'star-circle',
  },
  {
    id: '5',
    name: 'Guard / Protection',
    description: 'Safety and protection instincts',
    icon: 'security',
  },
  {
    id: '6',
    name: 'Leash Training',
    description: 'Calm and controlled walks',
    icon: 'walk',
  },
];

export const FEATURED_TRAINER = {
  id: 't1',
  name: 'Rahul Sharma',
  experience: 6,
  rating: 4.8,
  reviews: 128,
  description:
    'Certified animal behaviorist specializing in positive reinforcement techniques for dogs and cats of all breeds.',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  specializations: ['Obedience', 'Behavior Correction', 'Puppy Training'],
};

export const TRAINING_PROGRAMS = [
  {
    id: 'p1',
    name: 'Basic Obedience Program',
    duration: '4 weeks',
    focus: 'Commands: Sit, Stay, Come, Heel',
    price: 2499,
    sessions: 8,
    level: 'Beginner',
  },
  {
    id: 'p2',
    name: 'Puppy Starter Program',
    duration: '3 weeks',
    focus: 'Socialization & basic behavior',
    price: 1999,
    sessions: 6,
    level: 'Puppy',
  },
  {
    id: 'p3',
    name: 'Advanced Discipline Training',
    duration: '6 weeks',
    focus: 'Off-leash control and advanced commands',
    price: 4499,
    sessions: 12,
    level: 'Advanced',
  },
];

export const PETS = [
  {
    id: 'pet1',
    name: 'Rocky',
    breed: 'Golden Retriever',
    age: '2 years',
    avatar: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg',
  },
  {
    id: 'pet2',
    name: 'Bella',
    breed: 'Persian Cat',
    age: '1.5 years',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/White_Persian_Cat.jpg/320px-White_Persian_Cat.jpg',
  },
];

export const TRAINERS = ['Rahul Sharma', 'Priya Mehta', 'Amit Verma'];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];
