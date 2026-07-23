'use client';

import { useEffect, useState } from 'react';
import { useFx } from '@/world/FxProvider';
import { play, subscribePlay } from '@/world/playStore';
import { readTrailerPref } from '@/world/trailerPrefs';
import { requestTrailerPlay } from '@/world/worldGate';

/**
 * Hero CTA for the platform trailer. Hidden when FX is off, reduced-motion,
 * or the visitor already finished/skipped once.
 */
export function TrailerCTA() {
  const { level, ready } = useFx();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready || level === 'off') {
      setVisible(false);
      return;
    }
    if (readTrailerPref()) {
      setVisible(false);
      return;
    }
    setVisible(play.mode === 'idle');
    return subscribePlay(() => {
      setVisible(play.mode === 'idle' && !readTrailerPref());
    });
  }, [ready, level]);

  if (!visible) return null;

  return (
    <button type="button" onClick={requestTrailerPlay} className="btn btn-ghost">
      Watch platform flight
    </button>
  );
}
