'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BUDGETS, budgetFor, probeLevel, type FxBudget, type FxLevel } from './fx';

interface FxState {
  level: FxLevel;
  budget: FxBudget;
  /** False until the client-side probe has run. */
  ready: boolean;
}

const FxContext = createContext<FxState>({ level: 'off', budget: BUDGETS.off, ready: false });

export function FxProvider({ children }: { children: ReactNode }) {
  // Server and first client render agree on `off`, which is the plain-HTML
  // layout. That is deliberate: the prerendered markup shipped to crawlers and
  // JS-disabled readers is the fully accessible version, and the world is an
  // upgrade applied after hydration rather than a prerequisite for reading.
  const [level, setLevel] = useState<FxLevel>('off');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLevel(probeLevel());
    setReady(true);

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setLevel(probeLevel());
    motion.addEventListener('change', onChange);
    return () => motion.removeEventListener('change', onChange);
  }, []);

  const value = useMemo<FxState>(
    () => ({ level, budget: budgetFor(level), ready }),
    [level, ready],
  );

  return (
    <FxContext.Provider value={value}>
      <div data-fx={level} data-fx-ready={ready ? 'true' : 'false'}>
        {children}
      </div>
    </FxContext.Provider>
  );
}

export function useFx(): FxState {
  return useContext(FxContext);
}
