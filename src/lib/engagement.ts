// Engagement and Gamified Investor Sentiment State Manager
export interface EngagementState {
  viewedSpecs: boolean;
  viewedSim: boolean;
  simSteps: number[]; // e.g. [0, 1, 2, 3]
  inspectedComponents: string[]; // e.g. ['ballistic-shield', 'structural-framing', ...]
}

export interface SentimentLevel {
  score: number;
  label: string;
  color: string; // text-color class
  bgClass: string; // background class
  borderClass: string; // border class
  glowClass: string; // shadow/glow colors
  description: string;
  emoji: string;
}

const STORAGE_KEY = 'safemart_investor_engagement';

const DEFAULT_STATE: EngagementState = {
  viewedSpecs: false,
  viewedSim: false,
  simSteps: [],
  inspectedComponents: []
};

// Dispatch standard window event so all listeners can update state in real-time
const dispatchUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('safemart_engagement_updated'));
  }
};

export const getEngagementState = (): EngagementState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STATE;
  } catch (e) {
    console.error('Failed to load engagement state', e);
    return DEFAULT_STATE;
  }
};

export const saveEngagementState = (state: EngagementState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    dispatchUpdate();
  } catch (e) {
    console.error('Failed to save engagement state', e);
  }
};

export const trackSpecViewed = () => {
  const state = getEngagementState();
  if (!state.viewedSpecs) {
    state.viewedSpecs = true;
    saveEngagementState(state);
  }
};

export const trackSimOpened = () => {
  const state = getEngagementState();
  if (!state.viewedSim) {
    state.viewedSim = true;
    saveEngagementState(state);
  }
};

export const trackSimStep = (step: number) => {
  const state = getEngagementState();
  if (!state.simSteps.includes(step)) {
    state.simSteps.push(step);
    saveEngagementState(state);
  }
};

export const trackComponentInspected = (id: string) => {
  const state = getEngagementState();
  if (!state.inspectedComponents.includes(id)) {
    state.inspectedComponents.push(id);
    saveEngagementState(state);
  }
};

export const resetEngagement = () => {
  saveEngagementState(DEFAULT_STATE);
};

export const calculateSentiment = (state: EngagementState): SentimentLevel => {
  let score = 0;

  // 1. Tech Specs View = 25 pts
  if (state.viewedSpecs) score += 25;

  // 2. Lockdown Sim View = 25 pts
  if (state.viewedSim) score += 25;

  // 3. Sim steps (max 4 steps) = 5 pts each (max 20)
  score += Math.min(20, state.simSteps.length * 5);

  // 4. 3D Components inspected (max 5) = 6 pts each (max 30)
  score += Math.min(30, state.inspectedComponents.length * 6);

  if (score <= 15) {
    return {
      score: Math.max(10, score),
      label: 'Skeptical Reviewer',
      color: 'text-red-400',
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/20',
      glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      emoji: '🧐',
      description: 'Investor is skeptical of overnight continuous operations. Open the "Safe-Window Solutions" Specs and try the "Lockdown Sim" to demonstrate automated security risk mitigation.'
    };
  } else if (score <= 50) {
    return {
      score,
      label: 'Intrigued Analyst',
      color: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/20',
      glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      emoji: '🤔',
      description: 'Investor is intrigued by the security model. Continue exploring the 3D architecture layout components and running the step-by-step security incident simulator stages.'
    };
  } else if (score <= 85) {
    return {
      score,
      label: 'Bullish Supporter',
      color: 'text-sky-400',
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/20',
      glowClass: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]',
      emoji: '🚀',
      description: 'Investor is highly bullish on the defensive operations advantage. Finish interacting with all 5 3D window details and complete all lockdown simulator stages to lock in funding committed status.'
    };
  } else {
    return {
      score,
      label: 'Committed Funding partner',
      color: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/20',
      glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      emoji: '💎',
      description: 'Funding Approved! All security metrics have been stress-tested and certified. Investor is 100% committed to underwriting the requested credit line.'
    };
  }
};
