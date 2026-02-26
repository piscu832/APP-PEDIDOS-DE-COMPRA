import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Secondary check: if info is in DB but email not verified (should be handled by login logic, but good as safety)
    if (!user.emailVerified) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
