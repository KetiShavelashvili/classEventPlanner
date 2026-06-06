import React, { useState, useMemo } from 'react';
import { translations } from '../i18n/translations';
import './LoginPage.css';

const PASSWORD_TESTS = [
  p => p.length >= 8,
  p => /[A-Z]/.test(p),
  p => /[a-z]/.test(p),
  p => /[0-9]/.test(p),
  p => /[^A-Za-z0-9]/.test(p),
];

const Field = ({ id, label, children, error }) => (
  <div className="login-field">
    <label htmlFor={id}>
      {label} <span className="field-required">*</span>
    </label>
    {children}
    {error && <span className="field-error">⚠ {error}</span>}
  </div>
);

const THEME_CYCLE = [
  { value: 'light',  icon: '☀️', next: 'dark'   },
  { value: 'dark',   icon: '🌙', next: 'system' },
  { value: 'system', icon: '💻', next: 'light'  },
];

const LoginPage = ({ onLogin, themeMode, setThemeMode, lang, setLang }) => {
  const t = translations[lang] ?? translations.en;

  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [year, setYear] = useState('');
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const pwRuleLabels = [t.pwRule1, t.pwRule2, t.pwRule3, t.pwRule4, t.pwRule5];
  const pwChecks = useMemo(
    () => PASSWORD_TESTS.map((test, i) => ({ label: pwRuleLabels[i], passed: test(password) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password, lang]
  );
  const pwValid = pwChecks.every(c => c.passed);
  const passwordsMatch = password === confirmPassword;

  const fieldErrors = useMemo(() => ({
    username:        !username.trim()  ? t.errUsernameRequired : null,
    password:        !password         ? t.errPasswordRequired
                   : mode === 'register' && !pwValid ? t.errPasswordWeak : null,
    confirmPassword: !confirmPassword  ? t.errConfirmRequired
                   : !passwordsMatch   ? t.errConfirmMismatch : null,
    subject:         !subject.trim()   ? t.errSubjectRequired : null,
    room:            !room.trim()      ? t.errRoomRequired    : null,
    year:            !year             ? t.errYearRequired    : null,
  }), [username, password, confirmPassword, subject, room, year, mode, pwValid, passwordsMatch, t]);

  const showError = (field) => touched[field] && fieldErrors[field];

  const touchAll = () => {
    const fields = { username: true, password: true };
    if (mode === 'register') {
      fields.confirmPassword = true;
      if (role === 'teacher') { fields.subject = true; fields.room = true; }
      if (role === 'student') { fields.year = true; }
    }
    setTouched(fields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();

    const relevant = [
      'username', 'password',
      ...(mode === 'register' ? ['confirmPassword'] : []),
      ...(mode === 'register' && role === 'teacher' ? ['subject', 'room'] : []),
      ...(mode === 'register' && role === 'student'  ? ['year'] : []),
    ];
    if (relevant.some(f => fieldErrors[f])) return;

    setLoading(true);
    setServerError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { username: username.trim(), password }
        : { username: username.trim(), password, confirmPassword, role, subject, room, year };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setServerError(data.error || 'Something went wrong.'); return; }

      if (mode === 'register') {
        switchMode('login');
        setSuccessMessage(`${t.accountCreated} ${data.user.username}.`);
        return;
      }

      localStorage.setItem('authToken', data.token);
      onLogin(data.user);
    } catch {
      setServerError(t.errServer);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setUsername(''); setPassword(''); setConfirmPassword('');
    setSubject(''); setRoom(''); setYear('');
    setTouched({}); setServerError(''); setSuccessMessage('');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setSubject(''); setRoom(''); setYear('');
    setTouched(prev => { const n = { ...prev }; delete n.subject; delete n.room; delete n.year; return n; });
  };


  return (
    <div className="login-page">
      {/* Top controls bar */}
      <div className="login-controls-bar">
        <div className="lang-switcher">
          <button
            className={`lang-btn ${lang === 'en' ? 'lang-btn-active' : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            className={`lang-btn ${lang === 'ka' ? 'lang-btn-active' : ''}`}
            onClick={() => setLang('ka')}
          >KA</button>
        </div>

        {(() => {
          const current = THEME_CYCLE.find(o => o.value === themeMode) ?? THEME_CYCLE[1];
          const label = t[`theme${current.value.charAt(0).toUpperCase() + current.value.slice(1)}`];
          return (
            <button
              className="theme-cycle-btn"
              onClick={() => setThemeMode(current.next)}
              title={label}
            >
              {current.icon} <span className="theme-btn-label">{label}</span>
            </button>
          );
        })()}
      </div>

      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">📅</span>
          <h1 className="login-brand-name">{t.brandName}</h1>
          <p className="login-brand-sub">{t.brandSub}</p>
        </div>

        <div className="login-mode-tabs">
          <button type="button" className={`mode-tab ${mode === 'login' ? 'mode-tab-active' : ''}`} onClick={() => switchMode('login')}>
            {t.signIn}
          </button>
          <button type="button" className={`mode-tab ${mode === 'register' ? 'mode-tab-active' : ''}`} onClick={() => switchMode('register')}>
            {t.register}
          </button>
        </div>

        {mode === 'register' && (
          <>
            <div className="login-role-label">{t.registerAs}</div>
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`} onClick={() => switchRole('student')}>
                <span className="role-icon">🎓</span>
                <span className="role-name">{t.student}</span>
                <span className="role-desc">{t.viewEvents}</span>
              </button>
              <button type="button" className={`role-btn ${role === 'teacher' ? 'role-btn-active' : ''}`} onClick={() => switchRole('teacher')}>
                <span className="role-icon">👩‍🏫</span>
                <span className="role-name">{t.teacher}</span>
                <span className="role-desc">{t.manageEvents}</span>
              </button>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Field id="username" label={t.username} error={showError('username')}>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setServerError(''); }}
              onBlur={() => touch('username')}
              placeholder={t.usernamePlaceholder}
              autoFocus
              disabled={loading}
              className={showError('username') ? 'input-error' : ''}
            />
          </Field>

          <Field id="password" label={t.password} error={showError('password')}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setServerError(''); }}
              onBlur={() => touch('password')}
              placeholder={mode === 'register' ? t.passwordPlaceholderCreate : t.passwordPlaceholderEnter}
              disabled={loading}
              className={showError('password') ? 'input-error' : ''}
            />
          </Field>

          {mode === 'register' && password.length > 0 && (
            <ul className="pw-checklist">
              {pwChecks.map(c => (
                <li key={c.label} className={c.passed ? 'pw-check-pass' : 'pw-check-fail'}>
                  {c.passed ? '✓' : '✗'} {c.label}
                </li>
              ))}
            </ul>
          )}

          {mode === 'register' && (
            <Field id="confirmPassword" label={t.confirmPassword} error={showError('confirmPassword')}>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setServerError(''); }}
                onBlur={() => touch('confirmPassword')}
                placeholder={t.confirmPasswordPlaceholder}
                disabled={loading}
                className={
                  showError('confirmPassword') ? 'input-error' :
                  confirmPassword.length > 0 && passwordsMatch ? 'input-match' : ''
                }
              />
              {!showError('confirmPassword') && confirmPassword.length > 0 && passwordsMatch && (
                <span className="field-hint field-hint-ok">{t.passwordsMatch}</span>
              )}
            </Field>
          )}

          {mode === 'register' && role === 'teacher' && (
            <>
              <Field id="subject" label={t.subject} error={showError('subject')}>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  onBlur={() => touch('subject')}
                  placeholder={t.subjectPlaceholder}
                  disabled={loading}
                  className={showError('subject') ? 'input-error' : ''}
                />
              </Field>
              <Field id="room" label={t.room} error={showError('room')}>
                <input
                  id="room"
                  type="text"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  onBlur={() => touch('room')}
                  placeholder={t.roomPlaceholder}
                  disabled={loading}
                  className={showError('room') ? 'input-error' : ''}
                />
              </Field>
            </>
          )}

          {mode === 'register' && role === 'student' && (
            <Field id="year" label={t.year} error={showError('year')}>
              <select
                id="year"
                value={year}
                onChange={e => setYear(e.target.value)}
                onBlur={() => touch('year')}
                disabled={loading}
                className={`login-select${showError('year') ? ' input-error' : ''}`}
              >
                <option value="">{t.yearPlaceholder}</option>
                {t.yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          )}

          {successMessage && <p className="login-success">✓ {successMessage}</p>}
          {serverError   && <p className="login-error">⚠️ {serverError}</p>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? t.pleaseWait : mode === 'login' ? t.signInBtn : t.createAccountBtn}
          </button>
        </form>

        {mode === 'login' && (
          <p className="login-hint">
            {t.demoHint} <code>teacher1 / teacher123</code> {lang === 'ka' ? 'ან' : 'or'} <code>student1 / student123</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
