export const loginUser = (state, type, credentials) => {
  if (type === 'FARMER') {
    const farmer = state.farmers.find(f => f.mobile === credentials.mobile);
    if (farmer && credentials.otp === '123456') { // Mock OTP check
      return { success: true, user: { ...farmer, role: 'FARMER' } };
    }
    return { success: false, message: 'Invalid mobile or OTP' };
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
