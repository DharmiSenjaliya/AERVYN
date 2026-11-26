import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './styles/theme.css';
import './index.css';

/**
 * AERVYN: Echoes of Time - Root Application Component
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AudioProvider>
            <AppRoutes />
          </AudioProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
