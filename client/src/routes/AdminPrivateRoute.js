import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoutes = () => {
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const userRole = useSelector((state) => state.employee.user?.role);

  const isAdmin = isLoggedIn && userRole === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
}

export default AdminPrivateRoutes