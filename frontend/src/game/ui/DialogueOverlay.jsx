import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowRight, FastForward } from 'lucide-react';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import Badge from '../../components/common/Badge';

/**
 * Story Campaign Interactive Dialogue Overlay
 * Provides cinematic narrative presentation with character portrait badges,
 * dynamic typewriting effect, acoustic dialogue blips, and intuitive keyboard navigation.
 */
export default function DialogueOverlay() {
  const [dialogue, setDialogue] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimerRef = useRef(null);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      if (state.activeDialogue && state.activeDialogue !== dialogue) {
        setDialogue(state.activeDialogue);
        setCurrentLineIndex(0);
      } else if (!state.activeDialogue && dialogue) {
        setDialogue(null);
        setCurrentLineIndex(0);
        setDisplayedText('');
      }
    });
    return unsub;
  }, [dialogue]);

  const currentLine = dialogue?.lines?.[currentLineIndex] || null;

  // Typewriting effect
  useEffect(() => {
    if (!currentLine) {
      setDisplayedText('');
      return;
    }

    const fullText = currentLine.text || '';
    setDisplayedText('');
    setIsTyping(true);

    let charIdx = 0;
    clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx % 3 === 0) {
        AudioSystem.playDialogueBlip();
      }

      if (charIdx >= fullText.length) {
        clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 24);

    return () => clearInterval(typingTimerRef.current);
  }, [currentLine]);

  const handleNext = () => {
    if (!dialogue || !dialogue.lines) return;

    if (isTyping) {
      // Instant finish current line
      clearInterval(typingTimerRef.current);
      setDisplayedText(currentLine.text || '');
      setIsTyping(false);
      return;
    }

    if (currentLineIndex < dialogue.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // End dialogue sequence
      if (dialogue.onComplete) {
        dialogue.onComplete();
      }
      GameState.closeDialogue();
    }
  };

  const handleSkip = () => {
    clearInterval(typingTimerRef.current);
    if (dialogue?.onComplete) {
      dialogue.onComplete();
    }
    GameState.closeDialogue();
  };

  // Keyboard navigation: Space/Enter = Next, Escape = Skip
  useEffect(() => {
    if (!dialogue) return;

    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogue, isTyping, currentLineIndex]);

  if (!dialogue || !currentLine) return null;

  const speakerName = currentLine.speaker || dialogue.speaker || 'Narrator';
  const speakerTitle = currentLine.title || dialogue.title || 'Echo of Time';
  const speakerColor = currentLine.color || dialogue.color || '#F5B942';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(92vw, 840px)',
        zIndex: 550,
        pointerEvents: 'auto',
        animation: 'fadeInUp 0.35s ease'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-md)',
          borderColor: speakerColor,
          boxShadow: `0 0 25px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(${speakerColor === '#F5B942' ? '245, 185, 66' : '0, 217, 255'}, 0.08)`,
          background: 'rgba(8, 10, 20, 0.94)'
        }}
      >
        {/* Header: Speaker Badge and Progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: speakerColor,
                boxShadow: `0 0 10px ${speakerColor}`
              }}
            />
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: speakerColor,
                textTransform: 'uppercase'
              }}
            >
              {speakerName}
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.02em'
              }}
            >
              // {speakerTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              {currentLineIndex + 1} / {dialogue.lines.length}
            </span>
            <button
              onClick={handleSkip}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}
              title="Skip dialogue [ESC]"
            >
              <FastForward size={12} /> Skip
            </button>
          </div>
        </div>

        {/* Text Body */}
        <div
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.65,
            color: '#F1F5F9',
            minHeight: '4.2rem',
            marginBottom: '1rem',
            fontFamily: 'inherit'
          }}
        >
          {displayedText}
          {isTyping && (
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '1.1rem',
                background: speakerColor,
                marginLeft: '4px',
                verticalAlign: 'text-bottom',
                animation: 'pulseGlow 0.6s infinite alternate'
              }}
            />
          )}
        </div>

        {/* Action Prompt */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${speakerColor}`,
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{isTyping ? 'Reveal All' : currentLineIndex < dialogue.lines.length - 1 ? 'Continue' : 'Close'}</span>
            <span style={{ fontSize: '0.68rem', color: speakerColor }}>[Space]</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
