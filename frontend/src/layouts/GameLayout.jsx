import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Game Layout Route Wrapper
 * Full-screen viewport container for AERVYN 3D Game Engine
 */
export default function GameLayout() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080B18',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <Outlet />
    </div>
  );
}
