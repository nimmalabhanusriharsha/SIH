import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/centre/live-queue', { replace: true });
  }, [navigate]);

  return null;
};

export default StaffVerification;
