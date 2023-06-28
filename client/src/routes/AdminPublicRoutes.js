import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPublicRoutes = () => {
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const userRole = useSelector((state) => state.employee.role);

  const isAdmin = isLoggedIn && userRole === 'admin';
  const isEmployee = isLoggedIn && userRole === 'employee';
  const isTeamLead = isLoggedIn && userRole === 'teamlead';

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (isEmployee) {
    return <Navigate to="/dashboard" replace />;
  } else if (isTeamLead) {
    return <Navigate to="/teamlead/dashboard" replace />;
  } else {
    return <Outlet />;
  }
};

export default AdminPublicRoutes;
