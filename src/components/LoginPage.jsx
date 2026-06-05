import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = () => setError('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Please enter your username.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { username: username.trim(), password }
        : { username: username.trim(), password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      localStorage.setItem('authToken', data.token);
      onLogin(data.user);
    } catch {
      setError('Cannot reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">📅</span>
          <h1 className="login-brand-name">Class Event Planner</h1>
          <p className="login-brand-sub">Design Patterns Demo</p>
        </div>

        <div className="login-mode-tabs">
          <button
            type="button"
            className={`mode-tab ${mode === 'login' ? 'mode-tab-active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`mode-tab ${mode === 'register' ? 'mode-tab-active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'register' && (
          <>
            <div className="login-role-label">Register as</div>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`}
                onClick={() => setRole('student')}
              >
                <span className="role-icon">🎓</span>
                <span className="role-name">Student</span>
                <span className="role-desc">View events</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'teacher' ? 'role-btn-active' : ''}`}
                onClick={() => setRole('teacher')}
              >
                <span className="role-icon">👩‍🏫</span>
                <span className="role-name">Teacher</span>
                <span className="role-desc">Manage events</span>
              </button>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); clearError(); }}
              placeholder="Enter your username"
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); clearError(); }}
              placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
              disabled={loading}
            />
          </div>

          {error && <p className="login-error">⚠️ {error}</p>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="login-hint">
            Demo: <code>teacher1 / teacher123</code> or <code>student1 / student123</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
