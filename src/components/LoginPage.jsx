import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    onLogin({ username: username.trim(), role });
  };

  const clearError = () => setError('');

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">📅</span>
          <h1 className="login-brand-name">Class Event Planner</h1>
          <p className="login-brand-sub">Design Patterns Demo</p>
        </div>

        <div className="login-role-label">Sign in as</div>
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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); clearError(); }}
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); clearError(); }}
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="login-error">⚠️ {error}</p>}

          <button type="submit" className="login-submit-btn">
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
