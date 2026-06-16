/**
 * store.js — Dada Chanting App
 * ─────────────────────────────────────────
 * Centralised state store with localStorage
 * persistence.
 *
 * State shape:
 * {
 *   user:          { name, email } | null,
 *   activeMantraId: string,          // selected mantra id
 *   counts:         { [dateStr]: { [mantraId]: number } },
 *   history:        Array<{ mantra, icon, date, count }>,
 *   streakDays:     number,
 *   lastChantDate:  string | null,   // toDateString()
 *   target:         number,          // daily chant goal
 * }
 */

const STORAGE_KEY = 'dada_chant_state_v1';

/** Default/initial state */
const DEFAULT_STATE = {
  user:           null,
  activeMantraId: 'ram',
  counts:         {},
  history:        [],
  streakDays:     0,
  lastChantDate:  null,
  target:         108,
};

/** In-memory working copy */
let _state = { ...DEFAULT_STATE };

/* ─────────────────────────────────────────
   Public API
───────────────────────────────────────── */

const Store = {

  /**
   * Load persisted state from localStorage.
   * Merges saved values over the defaults so
   * new keys added later always have a fallback.
   */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        _state = { ...DEFAULT_STATE, ...saved };
      }
    } catch (err) {
      console.warn('[Store] Failed to load state:', err);
      _state = { ...DEFAULT_STATE };
    }
  },

  /** Persist current state to localStorage */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (err) {
      console.warn('[Store] Failed to save state:', err);
    }
  },

  /** Return a shallow copy of the current state (read-only outside store) */
  getState() {
    return { ..._state };
  },

  /** Merge a partial update into state and auto-save */
  setState(partial) {
    _state = { ..._state, ...partial };
    this.save();
  },

  /* ── Derived helpers ── */

  /** Today's date string key */
  todayKey() {
    return new Date().toDateString();
  },

  /** Count for a specific mantra today */
  getTodayCount(mantraId) {
    const day = _state.counts[this.todayKey()];
    return day ? (day[mantraId] || 0) : 0;
  },

  /** Sum of ALL chants across all days and all mantras */
  getTotalChants() {
    return Object.values(_state.counts)
      .flatMap(day => Object.values(day))
      .reduce((sum, n) => sum + n, 0);
  },

  /** Sum of chants across all mantras for today */
  getTodayTotal() {
    const day = _state.counts[this.todayKey()];
    if (!day) return 0;
    return Object.values(day).reduce((sum, n) => sum + n, 0);
  },

  /**
   * Increment count for a mantra today.
   * Also handles streak logic and history.
   * Returns the new count for that mantra today.
   */
  recordChant(mantraId, mantraName, mantraIcon) {
    const today = this.todayKey();

    // Ensure day bucket exists
    if (!_state.counts[today]) _state.counts[today] = {};

    // Increment
    const prev = _state.counts[today][mantraId] || 0;
    _state.counts[today][mantraId] = prev + 1;
    const newCount = _state.counts[today][mantraId];

    // Streak logic
    if (_state.lastChantDate !== today) {
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      if (_state.lastChantDate === yesterday) {
        _state.streakDays += 1;            // consecutive day
      } else if (!_state.lastChantDate) {
        _state.streakDays = 1;             // first ever chant
      } else {
        _state.streakDays = 1;             // streak broken, restart
      }
      _state.lastChantDate = today;
    }

    // History — update or prepend entry for this mantra today
    const existingIdx = _state.history.findIndex(
      h => h.date === today && h.mantraId === mantraId
    );
    if (existingIdx !== -1) {
      _state.history[existingIdx].count = newCount;
    } else {
      _state.history.unshift({ mantraId, mantra: mantraName, icon: mantraIcon, date: today, count: newCount });
    }
    // Keep history to 100 entries max
    _state.history = _state.history.slice(0, 100);

    this.save();
    return newCount;
  },

  /** Reset today's count for one mantra */
  resetTodayCount(mantraId) {
    const today = this.todayKey();
    if (_state.counts[today]) {
      _state.counts[today][mantraId] = 0;
    }
    this.save();
  },

  /** Get counts map for the last N days (for calendar) */
  getCountsForDays(numDays) {
    const result = {};
    const now = Date.now();
    for (let i = 0; i < numDays; i++) {
      const d = new Date(now - i * 86_400_000).toDateString();
      const day = _state.counts[d];
      result[d] = day
        ? Object.values(day).reduce((s, v) => s + v, 0)
        : 0;
    }
    return result;
  },
};
