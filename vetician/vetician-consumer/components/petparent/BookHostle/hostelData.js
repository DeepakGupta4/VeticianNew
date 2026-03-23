export const PETS = [
  { id: 'rocky', name: 'Rocky', breed: 'Golden Retriever', icon: 'dog'    },
  { id: 'bella', name: 'Bella', breed: 'Persian Cat',      icon: 'cat'    },
  { id: 'milo',  name: 'Milo',  breed: 'Dutch Bunny',      icon: 'rabbit' },
];

export const HOSTELS = [
  {
    id: 'green-paw', name: 'Green Paw Hostel', rating: 4.7,
    distance: '1.2 km', price: 499, rooms: 12, tag: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80',
  },
  {
    id: 'happy-tails', name: 'Happy Tails Haven', rating: 4.5,
    distance: '2.4 km', price: 399, rooms: 8, tag: null,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  },
  {
    id: 'paws-relax', name: 'Paws & Relax', rating: 4.9,
    distance: '3.1 km', price: 699, rooms: 20, tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
  },
];

export const ROOMS = [
  { id: 'standard', name: 'Standard Kennel', desc: 'Shared play area, feeding included.',           price: 499,  icon: 'home-outline' },
  { id: 'private',  name: 'Private Room',    desc: 'Private space with personal feeding schedule.', price: 799,  icon: 'bed-outline'  },
  { id: 'luxury',   name: 'Luxury Suite',    desc: 'Live camera, grooming & vet check included.',   price: 1299, icon: 'star-outline'  },
];

export const FACILITIES = [
  { id: 'supervision', icon: 'eye-outline',           label: '24/7 Watch'  },
  { id: 'play',        icon: 'soccer-field',           label: 'Play Area'   },
  { id: 'vet',         icon: 'stethoscope',            label: 'Vet on Call' },
  { id: 'walks',       icon: 'walk',                   label: 'Daily Walks' },
  { id: 'feeding',     icon: 'food-drumstick-outline', label: 'Feeding'     },
  { id: 'cameras',     icon: 'cctv',                   label: 'Pet Cameras' },
  { id: 'grooming',    icon: 'shower-head',            label: 'Grooming'    },
];

export const SAFETY = [
  'Trained staff on duty 24/7',
  'CCTV across all areas',
  'Daily health checks',
  'Separate zones by pet size',
  'Emergency vet on call',
];

export const TIMES = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

export const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtDay  = (d) => d.toLocaleDateString('en-IN', { weekday: 'short' });
