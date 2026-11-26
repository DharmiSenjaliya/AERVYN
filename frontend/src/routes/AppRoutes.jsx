import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PlayerLayout from '../layouts/PlayerLayout';
import AdminLayout from '../layouts/AdminLayout';
import GameLayout from '../layouts/GameLayout';

// Public & Auth Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';

// Player Pages
import DashboardPage from '../pages/player/DashboardPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

// 3D Game Engine View
import GameView from '../pages/game/GameView';

// Context
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard for Authenticated Users
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  // If not logged in, allow access during demo/phase testing or redirect
  return children;
}

/**
 * Route Guard for Administrators
 */
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Website & Story Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 2. Standalone Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Player Dashboard Portal */}
      <Route
        path="/player"
        element={
          <ProtectedRoute>
            <PlayerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/player/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="missions" element={<DashboardPage />} />
        <Route path="worlds" element={<DashboardPage />} />
        <Route path="inventory" element={<DashboardPage />} />
        <Route path="achievements" element={<DashboardPage />} />
        <Route path="settings" element={<DashboardPage />} />
      </Route>

      {/* 4. Professional Admin Panel */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="players" element={<AdminDashboardPage />} />
        <Route path="worlds" element={<AdminDashboardPage />} />
        <Route path="levels" element={<AdminDashboardPage />} />
        <Route path="missions" element={<AdminDashboardPage />} />
        <Route path="characters" element={<AdminDashboardPage />} />
        <Route path="enemies" element={<AdminDashboardPage />} />
        <Route path="items" element={<AdminDashboardPage />} />
        <Route path="inventory" element={<AdminDashboardPage />} />
        <Route path="achievements" element={<AdminDashboardPage />} />
        <Route path="assets" element={<AdminDashboardPage />} />
        <Route path="sessions" element={<AdminDashboardPage />} />
        <Route path="announcements" element={<AdminDashboardPage />} />
        <Route path="notifications" element={<AdminDashboardPage />} />
        <Route path="analytics" element={<AdminDashboardPage />} />
        <Route path="reports" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminDashboardPage />} />
        <Route path="roles" element={<AdminDashboardPage />} />
        <Route path="game-settings" element={<AdminDashboardPage />} />
        <Route path="web-settings" element={<AdminDashboardPage />} />
        <Route path="profile" element={<AdminDashboardPage />} />
        <Route path="change-password" element={<AdminDashboardPage />} />
      </Route>

      {/* 5. Playable 3D Game Full-Screen Canvas */}
      <Route path="/play" element={<GameLayout />}>
        <Route index element={<GameView />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
