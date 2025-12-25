import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Protected Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import FlockListPage from '../pages/farming/FlockListPage';
import FlockDetailPage from '../pages/farming/FlockDetailPage';
import FinancePage from '../pages/finance/FinancePage';
import MasterDataPage from '../pages/master-data/MasterDataPage';

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES (Auth Layout) ========== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ========== PRIVATE ROUTES (Protected + Main Layout) ========== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Inventory */}
            <Route path="/inventory" element={<InventoryPage />} />

            {/* Farming (Flocks) */}
            <Route path="/flocks" element={<FlockListPage />} />
            <Route path="/flocks/:id" element={<FlockDetailPage />} />

            {/* Finance */}
            <Route path="/finance" element={<FinancePage />} />

            {/* Master Data */}
            <Route path="/master-data" element={<MasterDataPage />} />
          </Route>
        </Route>

        {/* ========== 404 ========== */}
        <Route path="*" element={<div style={{padding:'40px',textAlign:'center'}}><h1>404 Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}
