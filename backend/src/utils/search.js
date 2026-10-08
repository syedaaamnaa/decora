/** Escape user input before building a RegExp (prevents ReDoS / syntax errors). */
export function escapeRegex(text = '') {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build a case-insensitive RegExp from user input, or null when empty. */
export function searchRegex(text) {
  if (!text) return null;
  return new RegExp(escapeRegex(text), 'i');
}
