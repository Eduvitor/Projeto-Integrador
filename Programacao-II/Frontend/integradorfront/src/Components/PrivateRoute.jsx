import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem('token'); // Verifique se o token está armazenado

    return isAuthenticated ? <Component /> : <Navigate to="/Login" />;
};

export default ProtectedRoute;
