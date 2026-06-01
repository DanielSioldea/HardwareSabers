import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/builder"  element={<BuilderPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      {/* Catch-all redirect to home */}
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}
