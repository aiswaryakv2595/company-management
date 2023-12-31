import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const TlPrivateRoute = () => {
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const userRole = useSelector((state) => state.employee.role);

  const isTeamlead = isLoggedIn && userRole === 'teamlead';

  return isTeamlead ? <Outlet /> : <Navigate to="/" replace />;
}

export default TlPrivateRoute