export const loginUser = (state, type, credentials) => {
  if (type === 'FARMER') {
    const cleanMobile = (credentials.mobile || '').trim();
    const farmer = (state.farmers || []).find(f => (f.mobile || '').trim() === cleanMobile);
    if (!farmer) {
      return { success: false, message: 'No registered farmer account was found for this mobile number.' };
    }
    const expected = credentials.expectedOtp || (credentials.isDemoMode ? '123456' : null);
    const isValidOtp = expected ? credentials.otp === expected : (credentials.isDemoMode && (credentials.otp === '123456' || credentials.otp === '1234'));
    if (isValidOtp) {
      const canonicalFarmerId = farmer.farmerId || farmer.id;
      return { 
        success: true, 
        user: { 
          ...farmer, 
          id: canonicalFarmerId, 
          farmerId: canonicalFarmerId, 
          role: 'FARMER' 
        } 
      };
    }
    return { success: false, message: 'Incorrect OTP. Please try again.' };
  }
  
  if (type === 'STAFF') {
    const staff = state.staff.find(s => s.id === credentials.id);
    if (staff && staff.password === credentials.password) {
      return { success: true, user: { ...staff, role: 'STAFF' } };
    }
    return { success: false, message: 'Invalid credentials' };
  }
  
  if (type === 'ADMIN') {
    const admin = state.admin.find(a => a.id === credentials.id);
    if (admin && admin.password === credentials.password) {
      return { success: true, user: { ...admin, role: 'ADMIN' } };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  return { success: false, message: 'Unknown role type' };
};
