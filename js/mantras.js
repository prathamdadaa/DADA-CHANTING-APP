/**
 * mantras.js — Dada Chanting App
 * ─────────────────────────────────────────
 * Static data: all supported mantras.
 * Each mantra object is frozen so it cannot
 * be accidentally mutated at runtime.
 *
 * Fields:
 *   id      {string}  Unique key used in storage
 *   name    {string}  Display name
 *   icon    {string}  Emoji icon
 *   text    {string}  Sanskrit mantra text
 *   color   {string}  Accent hex (for future theming)
 */

const MANTRAS = Object.freeze([
  Object.freeze({
    id:    'ram',
    name:  'Ram Ram',
    icon:  '🚩',
    text:  'ॐ श्री राम जय राम जय जय राम',
    color: '#FF6B35',
  }),
  Object.freeze({
    id:    'radha',
    name:  'Radha Krishna',
    icon:  '🦚',
    text:  'राधे राधे श्री कृष्ण गोविन्द',
    color: '#6C5CE7',
  }),
  Object.freeze({
    id:    'hanuman',
    name:  'Hanuman',
    icon:  '🌀',
    text:  'ॐ हं हनुमते नमः',
    color: '#E17055',
  }),
  Object.freeze({
    id:    'gayatri',
    name:  'Gayatri',
    icon:  '☀️',
    text:  'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्',
    color: '#FDCB6E',
  }),
  Object.freeze({
    id:    'shiv',
    name:  'Shiv Shiv',
    icon:  '🔱',
    text:  'ॐ नमः शिवाय',
    color: '#74B9FF',
  }),
  Object.freeze({
    id:    'durga',
    name:  'Durga Maa',
    icon:  '🌸',
    text:  'ॐ दुं दुर्गायै नमः',
    color: '#FD79A8',
  }),
  Object.freeze({
    id:    'ganesh',
    name:  'Ganesh',
    icon:  '🐘',
    text:  'ॐ गं गणपतये नमः',
    color: '#55EFC4',
  }),
  Object.freeze({
    id:    'om',
    name:  'Om',
    icon:  '🕉️',
    text:  'ॐ ॐ ॐ — परमात्मा',
    color: '#A29BFE',
  }),
]);

/**
 * Look up a mantra by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
function getMantraById(id) {
  return MANTRAS.find(m => m.id === id);
}
