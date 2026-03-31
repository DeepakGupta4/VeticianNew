export const INITIAL_DATA = {
  points: 1200,

  availableRewards: [
    {
      id: 1,
      title: '10% OFF on Grooming',
      description: 'Get 10% discount on your next grooming session',
      pointsRequired: 200,
      redeemed: false,
      icon: 'content-cut',
    },
    {
      id: 2,
      title: '₹200 OFF on Vet Visit',
      description: 'Flat ₹200 off on any vet consultation',
      pointsRequired: 400,
      redeemed: false,
      icon: 'medical-bag',
    },
    {
      id: 3,
      title: 'Free Checkup',
      description: 'One free health checkup for your pet',
      pointsRequired: 800,
      redeemed: false,
      icon: 'stethoscope',
    },
    {
      id: 4,
      title: '15% OFF on Hostel',
      description: '15% discount on pet hostel stay',
      pointsRequired: 600,
      redeemed: false,
      icon: 'home-heart',
    },
  ],

  myRewards: [
    {
      id: 101,
      title: '5% OFF on Grooming',
      code: 'VET5GROOM',
      expiry: '15 Apr 2025',
      status: 'Active',
    },
  ],

  activityHistory: [
    { id: 1, label: 'Grooming booked → +100 pts', points: 100, date: '22 Mar 2025' },
    { id: 2, label: 'Vet Consultation → +80 pts', points: 80, date: '18 Mar 2025' },
    { id: 3, label: 'Coupon redeemed → -200 pts', points: -200, date: '10 Mar 2025' },
    { id: 4, label: 'Vaccination → +120 pts', points: 120, date: '02 Mar 2025' },
    { id: 5, label: 'Referral Bonus → +300 pts', points: 300, date: '25 Feb 2025' },
  ],

  earnMethods: [
    { id: 1, label: 'Book Grooming', points: 100, icon: 'content-cut' },
    { id: 2, label: 'Vet Consultation', points: 80, icon: 'medical-bag' },
    { id: 3, label: 'Vaccination', points: 120, icon: 'needle' },
    { id: 4, label: 'Pet Hostel', points: 200, icon: 'home-heart' },
    { id: 5, label: 'Referral', points: 300, icon: 'account-multiple-plus' },
  ],
};
