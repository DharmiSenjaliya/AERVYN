import React, { useState, useEffect } from 'react';
import GameState from './GameState';
import DesktopControls from '../controls/DesktopControls';
import MobileControls from '../controls/MobileControls';
import LostKingdomScene from '../scenes/LostKingdomScene';
import MainMenuScene from '../scenes/MainMenuScene';
import GameHUD from '../ui/GameHUD';
import PauseMenu from '../ui/PauseMenu';
import VictoryScreen from '../ui/VictoryScreen';
import GameOverScreen from '../ui/GameOverScreen';
import LoadingScreen from '../../components/common/LoadingScreen';
import SaveSystem from '../systems/SaveSystem';

/**
 * AERVYN 3D Game Engine - Master Scene & State Orchestrator
 * Seamlessly manages scene transitions, desktop & mobile input blending, HUD rendering,
 * and background persistence.
 */
export default function GameEngine() {
  const [currentScene, setCurrentScene] = useState(GameState.getState().currentScene);
  const [mobileInput, setMobileInput] = useState({ x: 0, y: 0, jump: false, sprint: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Detect touch device / viewport width
    const checkMobile = () => {
      const touchAvailable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(touchAvailable || window.innerWidth <= 840);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 2. Initialize desktop keyboard/mouse listeners
    DesktopControls.init();

    // 3. Subscribe to GameState scene changes
    const unsub = GameState.subscribe((state) => {
      setCurrentScene(state.currentScene);
    });

    // 4. Start automatic telemetry save system
    SaveSystem.startAutoSave(25000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      DesktopControls.destroy();
      SaveSystem.stopAutoSave();
      unsub();
    };
  }, []);

  // Handle Mobile Controls Callbacks
  const handleMobileMove = (vec) => {
    setMobileInput((prev) => ({ ...prev, x: vec.x, y: vec.y }));
  };

  const handleMobileStop = () => {
    setMobileInput((prev) => ({ ...prev, x: 0, y: 0 }));
  };

  const handleMobileJump = () => {
    setMobileInput((prev) => ({ ...prev, jump: true }));
    setTimeout(() => {
      setMobileInput((prev) => ({ ...prev, jump: false }));
    }, 150);
  };

  const handleMobileSprintToggle = () => {
    setMobileInput((prev) => ({ ...prev, sprint: !prev.sprint }));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080B18',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 1. SCENE: Main Menu */}
      {currentScene === 'menu' && (
        <MainMenuScene
          onStartGame={() => GameState.setScene('playing')}
          onContinueGame={() => GameState.setScene('playing')}
        />
      )}

      {/* 2. SCENE: Active Gameplay (World 1: The Lost Kingdom) */}
      {(currentScene === 'playing' || currentScene === 'paused' || currentScene === 'victory' || currentScene === 'gameover') && (
        <>
          {/* 3D Canvas Scene */}
          <LostKingdomScene mobileInput={mobileInput} />

          {/* Real-Time Gameplay HUD */}
          <GameHUD
            onPause={() => GameState.setScene('paused')}
            isMobile={isMobile}
          />

          {/* Mobile On-Screen Touch Controls (shown on touch/mobile displays) */}
          {isMobile && currentScene === 'playing' && (
            <MobileControls
              onMobileMove={handleMobileMove}
              onMobileStop={handleMobileStop}
              onJump={handleMobileJump}
              onSprintToggle={handleMobileSprintToggle}
              isSprinting={mobileInput.sprint}
            />
          )}

          {/* Pause Menu Modal Overlay */}
          {currentScene === 'paused' && (
            <PauseMenu
              onResume={() => GameState.setScene('playing')}
              onExitToMenu={() => GameState.setScene('menu')}
            />
          )}

          {/* Victory Modal Overlay */}
          {currentScene === 'victory' && (
            <VictoryScreen
              onFreeRoam={() => GameState.setScene('playing')}
            />
          )}

          {/* Game Over Modal Overlay */}
          {currentScene === 'gameover' && (
            <GameOverScreen
              onRestart={() => {
                const cp = GameState.getState().checkpoint;
                GameState.setState({
                  currentScene: 'playing',
                  player: {
                    ...GameState.getState().player,
                    position: [...cp.position],
                    health: 100
                  }
                });
              }}
              onExit={() => GameState.setScene('menu')}
            />
          )}
        </>
      )}
    </div>
  );
}
