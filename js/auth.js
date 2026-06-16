/**
 * auth.js — Dada Chanting App
 * ─────────────────────────────────────────
 * Handles login, signup, and logout.
 *
 * NOTE: This is a client-side simulation.
 * In production, replace doAuth() with a
 * real API call (Firebase Auth, Supabase,
 * your own backend, etc.) and store only
 * a JWT/session token — never a raw password.
 */

const Auth = (() => {

  /** Current form mode: 'login' | 'signup' */
  let _mode = 'login';

  /* ── DOM helpers ── */
  const $ = id => document.getElementById(id);

  function _setMode(mode) {
    _mode = mode;

    if (mode === 'signup') {
      $('auth-title').textContent       = 'Create account';
      $('auth-sub').textContent         = 'Join Dada Chanting App & never lose your progress';
      $('auth-name-field').style.display = 'block';
      $('auth-submit-btn').textContent   = 'Create account';
      $('auth-switch').innerHTML =
        'Already have an account? <a href="#" onclick="Auth.toggleMode(); return false;">Sign in</a>';
    } else {
      $('auth-title').textContent       = 'Sign in';
      $('auth-sub').textContent         = 'Login to sync & backup your chanting data';
      $('auth-name-field').style.display = 'none';
      $('auth-submit-btn').textContent   = 'Sign in';
      $('auth-switch').innerHTML =
        "Don't have an account? <a href=\"#\" onclick=\"Auth.toggleMode(); return false;\">Create one</a>";
    }
  }

  /* ── Validation ── */
  function _validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ══════════════════════════════════
     Public API
  ══════════════════════════════════ */
  return {

    /** Switch between login and signup forms */
    toggleMode() {
      _setMode(_mode === 'login' ? 'signup' : 'login');
    },

    /** Reset the form back to login mode (called when entering auth screen) */
    resetForm() {
      _setMode('login');
      $('auth-email').value = '';
      $('auth-pass').value  = '';
      $('auth-name').value  = '';
    },

    /**
     * Handle form submission.
     * Validates inputs, creates/finds user,
     * stores in state, and redirects home.
     *
     * ⚠️  Replace this with a real API call
     *     before going to production.
     */
    doAuth() {
      const email = $('auth-email').value.trim();
      const pass  = $('auth-pass').value;
      const name  = $('auth-name').value.trim();

      // ── Basic validation ──
      if (!email) {
        UI.showToast('Please enter your email');
        return;
      }
      if (!_validateEmail(email)) {
        UI.showToast('Please enter a valid email');
        return;
      }
      if (!pass || pass.length < 6) {
        UI.showToast('Password must be at least 6 characters');
        return;
      }
      if (_mode === 'signup' && !name) {
        UI.showToast('Please enter your name');
        return;
      }

      // ── Simulate auth (replace with real API) ──
      const displayName = _mode === 'signup'
        ? name
        : email.split('@')[0];   // derive name from email on login

      const user = { name: displayName, email };

      Store.setState({ user });
      UI.showToast(`🙏 Jai Shri Ram, ${displayName}! Welcome!`);
      UI.goScreen('home');
    },

    /** Log the current user out */
    doLogout() {
      Store.setState({ user: null });
      UI.showToast('Logged out successfully');
      UI.goScreen('home');
    },
  };

})();
