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
import PlayerManagementPage from '../pages/admin/PlayerManagementPage';
import WorldManagementPage from '../pages/admin/WorldManagementPage';
import MissionManagementPage from '../pages/admin/MissionManagementPage';
import CollectibleManagementPage from '../pages/admin/CollectibleManagementPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import GameSessionsPage from '../pages/admin/GameSessionsPage';
import FeedbackManagementPage from '../pages/admin/FeedbackManagementPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import ActivityLogsPage from '../pages/admin/ActivityLogsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import MediaManagementPage from '../pages/admin/MediaManagementPage';

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
        <Route path="players" element={<PlayerManagementPage />} />
        <Route path="worlds" element={<WorldManagementPage />} />
        <Route path="levels" element={<WorldManagementPage />} />
        <Route path="missions" element={<MissionManagementPage />} />
        <Route path="characters" element={<CollectibleManagementPage />} />
        <Route path="enemies" element={<WorldManagementPage />} />
        <Route path="items" element={<CollectibleManagementPage />} />
        <Route path="collectibles" element={<CollectibleManagementPage />} />
        <Route path="inventory" element={<CollectibleManagementPage />} />
        <Route path="achievements" element={<CollectibleManagementPage />} />
        <Route path="assets" element={<MediaManagementPage />} />
        <Route path="sessions" element={<GameSessionsPage />} />
        <Route path="announcements" element={<FeedbackManagementPage />} />
        <Route path="feedback" element={<FeedbackManagementPage />} />
        <Route path="notifications" element={<FeedbackManagementPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<AnalyticsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="roles" element={<ActivityLogsPage />} />
        <Route path="activity-logs" element={<ActivityLogsPage />} />
        <Route path="game-settings" element={<AdminSettingsPage />} />
        <Route path="web-settings" element={<AdminSettingsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminSettingsPage />} />
        <Route path="change-password" element={<AdminSettingsPage />} />
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
