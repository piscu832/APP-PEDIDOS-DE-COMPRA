import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { OrdersProvider } from './context/OrdersContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import OperatorPage from './pages/OperatorPage';
import NewOrderPage from './pages/NewOrderPage';
import RolesPage from './pages/RolesPage';
import SettingsPage from './pages/SettingsPage';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <OrdersProvider>
          <AuthProvider>
            <AnimatePresence>
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>

            {!showSplash && (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/operator" element={<ProtectedRoute><OperatorPage /></ProtectedRoute>} />
                  <Route path="/new-order" element={<ProtectedRoute><NewOrderPage /></ProtectedRoute>} />
                  <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                </Routes>
              </BrowserRouter>
            )}
          </AuthProvider>
        </OrdersProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
