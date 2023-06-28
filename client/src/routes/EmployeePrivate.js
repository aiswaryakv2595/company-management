import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const EmployeePrivate = () => {
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const userRole = useSelector((state) => state.employee.role);

  const isEmployee = isLoggedIn && userRole === 'employee';

  return isEmployee ? <Outlet /> : <Navigate to="/" replace />;
}

export default EmployeePrivate