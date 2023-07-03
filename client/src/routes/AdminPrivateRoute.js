import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoutes = () => {
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const userRole = useSelector((state) => state.employee.role);
console.log('role from private route',userRole)
  const isAdmin = isLoggedIn && userRole === 'admin';
  console.log('admin private route',isAdmin)

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminPrivateRoutes;
