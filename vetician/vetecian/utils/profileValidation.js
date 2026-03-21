export const isProfileComplete = (parentData) => {
  console.log('\n🔍 ========== PROFILE VALIDATION START ==========');
  console.log('📋 Raw parentData type:', typeof parentData);
  console.log('📋 Raw parentData value:', parentData);
  console.log('📋 Full Parent data JSON:', JSON.stringify(parentData, null, 2));
  
  if (!parentData) {
    console.log('❌ VALIDATION FAILED: No parent data found');
    console.log('🔍 ========== PROFILE VALIDATION END ==========\n');
    return false;
  }
  
  const requiredFields = ['name', 'email', 'phone'];
  const missingOrInvalid = [];
  
  console.log('\n📝 Checking required fields:');
  requiredFields.forEach(field => {
    const value = parentData[field];
    const valueType = typeof value;
    console.log(`\n  Field: ${field}`);
    console.log(`    - Type: ${valueType}`);
    console.log(`    - Value: "${value}"`);
    console.log(`    - Is null/undefined: ${value == null}`);
    
    if (!value) {
      console.log(`    ❌ FAILED: ${field} is missing`);
      missingOrInvalid.push(`${field} (missing)`);
    } else if (typeof value === 'string' && value.trim().length === 0) {
      console.log(`    ❌ FAILED: ${field} is empty string`);
      missingOrInvalid.push(`${field} (empty)`);
    } else if (value === 'Not provided') {
      console.log(`    ❌ FAILED: ${field} is 'Not provided'`);
      missingOrInvalid.push(`${field} (not provided)`);
    } else {
      console.log(`    ✅ PASSED: ${field} is valid`);
    }
  });
  
  // Check address separately - can be string or object
  const address = parentData.address;
  console.log(`\n  Field: address`);
  console.log(`    - Type: ${typeof address}`);
  console.log(`    - Value:`, address);
  console.log(`    - Is null/undefined: ${address == null}`);
  
  if (!address) {
    console.log(`    ❌ FAILED: address is missing`);
    missingOrInvalid.push('address (missing)');
  } else if (typeof address === 'string') {
    console.log(`    - String length: ${address.length}`);
    console.log(`    - Trimmed length: ${address.trim().length}`);
    if (address.trim().length === 0 || address === 'Not provided') {
      console.log(`    ❌ FAILED: address is empty or 'Not provided'`);
      missingOrInvalid.push('address (empty or not provided)');
    } else {
      console.log(`    ✅ PASSED: address is valid string`);
    }
  } else if (typeof address === 'object') {
    console.log(`    - Object keys:`, Object.keys(address));
    console.log(`    - street: "${address.street}"`);
    console.log(`    - city: "${address.city}"`);
    console.log(`    - state: "${address.state}"`);
    const hasValidAddress = address.street || address.city || address.state;
    if (!hasValidAddress) {
      console.log(`    ❌ FAILED: address object has no valid data`);
      missingOrInvalid.push('address (incomplete)');
    } else {
      console.log(`    ✅ PASSED: address object is valid`);
    }
  }
  
  console.log('\n📊 VALIDATION SUMMARY:');
  if (missingOrInvalid.length > 0) {
    console.log('❌ VALIDATION FAILED');
    console.log('❌ Missing/Invalid fields (' + missingOrInvalid.length + '):');
    missingOrInvalid.forEach((field, index) => {
      console.log(`   ${index + 1}. ${field}`);
    });
    console.log('🔍 ========== PROFILE VALIDATION END ==========\n');
    return false;
  }
  
  console.log('✅ VALIDATION PASSED: Profile is complete!');
  console.log('🔍 ========== PROFILE VALIDATION END ==========\n');
  return true;
};

export const getMissingFields = (parentData) => {
  if (!parentData) return ['Name', 'Email', 'Phone Number', 'Address'];
  
  const requiredFields = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number'
  };
  
  const missing = Object.entries(requiredFields)
    .filter(([key]) => {
      const value = parentData[key];
      return !value || (typeof value === 'string' && (value.trim().length === 0 || value === 'Not provided'));
    })
    .map(([, value]) => value);
  
  // Check address separately
  const address = parentData.address;
  if (!address) {
    missing.push('Address');
  } else if (typeof address === 'string') {
    if (address.trim().length === 0 || address === 'Not provided') {
      missing.push('Address');
    }
  } else if (typeof address === 'object') {
    const hasValidAddress = address.street || address.city || address.state;
    if (!hasValidAddress) {
      missing.push('Address');
    }
  }
  
  return missing;
};
