export const isProfileComplete = (parentData) => {
  if (!parentData) return false;
  
  const requiredFields = ['name', 'email', 'phone', 'address'];
  return requiredFields.every(field => 
    parentData[field] && parentData[field].trim().length > 0
  );
};

export const getMissingFields = (parentData) => {
  if (!parentData) return ['name', 'email', 'phone', 'address'];
  
  const requiredFields = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Address'
  };
  
  return Object.entries(requiredFields)
    .filter(([key]) => !parentData[key] || parentData[key].trim().length === 0)
    .map(([, value]) => value);
};
