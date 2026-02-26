import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';

// Mock other pages for now
const MockPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen text-white">
    <h1 className="text-2xl font-bold uppercase tracking-widest">{title}</h1>
    <button onClick={() => window.history.back()} className="ml-4 text-blue-500 font-bold underline">Volver</button>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/operator" element={<MockPage title="Módulo de Pedidos" />} />
          <Route path="/settings" element={<MockPage title="Configuración" />} />
          <Route path="/roles" element={<MockPage title="Gestión de Roles" />} />
          <Route path="/login" element={<MockPage title="Acceso de Usuario" />} />
          <Route path="/new-order" element={<MockPage title="Nuevo Pedido" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
