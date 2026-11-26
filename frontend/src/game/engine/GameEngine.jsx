import React, { useState, useEffect } from 'react';
import GameState from './GameState';
import DesktopControls from '../controls/DesktopControls';
import MobileControls from '../controls/MobileControls';
import LostKingdomScene from '../scenes/LostKingdomScene';
import BrokenPresentScene from '../scenes/BrokenPresentScene';
import FracturedFutureScene from '../scenes/FracturedFutureScene';
import LastTimelineScene from '../scenes/LastTimelineScene';
import MainMenuScene from '../scenes/MainMenuScene';
import GameHUD from '../ui/GameHUD';
import PauseMenu from '../ui/PauseMenu';
import VictoryScreen from '../ui/VictoryScreen';
import GameOverScreen from '../ui/GameOverScreen';
import IntroCinematic from '../ui/IntroCinematic';
import DialogueOverlay from '../ui/DialogueOverlay';
import StoryJournalModal from '../ui/StoryJournalModal';
import FinalDecisionModal from '../ui/FinalDecisionModal';
import CampaignEndingScreen from '../ui/CampaignEndingScreen';
import SaveSystem from '../systems/SaveSystem';

/**
 * AERVYN 3D Game Engine - Multi-World Scene & State Orchestrator
 * Seamlessly loads World 1 (The Lost Kingdom) or World 2 (The Broken Present)
 * with dedicated environments, missions, hazards, and state persistence.
 */
export default function GameEngine() {
  const [currentScene, setCurrentScene] = useState(GameState.getState().currentScene);
  const [worldId, setWorldId] = useState(GameState.getState().worldId);
  const [damageFlash, setDamageFlash] = useState(false);
  const [mobileInput, setMobileInput] = useState({ x: 0, y: 0, jump: false, sprint: false });
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showFinalDecision, setShowFinalDecision] = useState(false);
  const [showStoryJournal, setShowStoryJournal] = useState(false);
  const [campaignEndingActive, setCampaignEndingActive] = useState(false);

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

    // 3. Campaign Events Listeners
    const handleOpenDecision = () => setShowFinalDecision(true);
    const handleToggleJournal = () => setShowStoryJournal((prev) => !prev);
    const handleKeyDown = (e) => {
      if ((e.key === 'j' || e.key === 'J') && !e.ctrlKey && !e.metaKey) {
        setShowStoryJournal((prev) => !prev);
      }
    };

    window.addEventListener('OPEN_FINAL_DECISION_MODAL', handleOpenDecision);
    window.addEventListener('aervyn:toggle-journal', handleToggleJournal);
    window.addEventListener('keydown', handleKeyDown);

    // 4. Subscribe to GameState changes
    const unsub = GameState.subscribe((state) => {
      setCurrentScene(state.currentScene);
      setWorldId(state.worldId);
      setDamageFlash(state.damageFlash);
      if (state.campaignCompleted && state.endingSelected && !campaignEndingActive) {
        setCampaignEndingActive(true);
      }
    });

    // 5. Start automatic telemetry save system (every 25 seconds)
    SaveSystem.startAutoSave(25000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('OPEN_FINAL_DECISION_MODAL', handleOpenDecision);
      window.removeEventListener('aervyn:toggle-journal', handleToggleJournal);
      window.removeEventListener('keydown', handleKeyDown);
      DesktopControls.destroy();
      SaveSystem.stopAutoSave();
      unsub();
    };
  }, [campaignEndingActive]);

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

  const startNewGameWithCinematic = () => {
    setShowIntro(true);
    GameState.setScene('playing');
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
      {/* Red Edge Damage Flash Indicator when player takes damage from hazards */}
      {damageFlash && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 999,
            boxShadow: 'inset 0 0 60px rgba(239, 68, 68, 0.85)',
            border: '3px solid rgba(239, 68, 68, 0.6)'
          }}
        />
      )}

      {/* 1. SCENE: Main Menu */}
      {currentScene === 'menu' && (
        <MainMenuScene
          onStartGame={startNewGameWithCinematic}
          onContinueGame={() => {
            setShowIntro(false);
            GameState.setScene('playing');
          }}
        />
      )}

      {/* 2. SCENE: Active Gameplay (World 1 or World 2) */}
      {(currentScene === 'playing' || currentScene === 'paused' || currentScene === 'victory' || currentScene === 'gameover') && (
        <>
          {/* Active World 3D Canvas Scene */}
          {worldId === 'world_final' ? (
            <LastTimelineScene mobileInput={mobileInput} />
          ) : worldId === 'world_3' ? (
            <FracturedFutureScene mobileInput={mobileInput} />
          ) : worldId === 'world_2' ? (
            <BrokenPresentScene mobileInput={mobileInput} />
          ) : (
            <LostKingdomScene mobileInput={mobileInput} />
          )}

          {/* Cinematic Introduction Cutscene Overlay (when starting New Game) */}
          {showIntro && currentScene === 'playing' && (
            <IntroCinematic
              worldId={worldId}
              onComplete={() => setShowIntro(false)}
            />
          )}

          {/* Interactive Dialogue System Overlay */}
          <DialogueOverlay />

          {/* Story Journal Modal [J] */}
          <StoryJournalModal
            isOpen={showStoryJournal}
            onClose={() => setShowStoryJournal(false)}
          />

          {/* Final Decision Modal at Zero Horizon */}
          <FinalDecisionModal
            isOpen={showFinalDecision}
            onClose={() => setShowFinalDecision(false)}
            onCompleteEnding={() => {
              setCampaignEndingActive(true);
            }}
          />

          {/* Campaign Grand Finale & Ending Screen */}
          {campaignEndingActive && (
            <CampaignEndingScreen
              endingKey={GameState.getState().endingSelected || 'ending_a'}
              onReplay={(targetWorld) => {
                setCampaignEndingActive(false);
                if (targetWorld) {
                  GameState.setWorld(targetWorld);
                }
                GameState.setScene('menu');
              }}
            />
          )}

          {/* Real-Time Gameplay HUD (hidden during intro) */}
          {!showIntro && (
            <GameHUD
              onPause={() => GameState.setScene('paused')}
              isMobile={isMobile}
            />
          )}

          {/* Mobile On-Screen Touch Controls (shown on touch/mobile displays) */}
          {isMobile && currentScene === 'playing' && !showIntro && (
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
              onExitToMenu={() => {
                setShowIntro(false);
                GameState.setScene('menu');
              }}
            />
          )}

          {/* Victory Modal Overlay */}
          {currentScene === 'victory' && (
            <VictoryScreen
              worldId={worldId}
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
              onExit={() => {
                setShowIntro(false);
                GameState.setScene('menu');
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
