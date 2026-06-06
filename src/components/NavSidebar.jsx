import React from 'react';
import { translations } from '../i18n/translations';
import './NavSidebar.css';

const NavSidebar = ({ currentPage, onNavigate, user, upcomingCount, pastCount, onLogout, theme, onToggleTheme, lang, setLang }) => {
  const t = translations[lang] ?? translations.en;
  const counts = { dashboard: upcomingCount, past: pastCount };
  const NAV_ITEMS = [
    { id: 'dashboard', label: t.navDashboard, icon: '📋' },
    { id: 'past',      label: t.navPastEvents, icon: '🗂️' },
  ];

  const themeLabel = theme === 'light' ? t.navLightMode : theme === 'system' ? t.navSystemMode : t.navDarkMode;

  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar-inner">
        <div className="nav-logo">
          <span className="nav-logo-icon">📅</span>
          <div className="nav-logo-text">
            <span className="nav-logo-title">{t.navLogoTitle}</span>
            <span className="nav-logo-sub">{t.navLogoSub}</span>
          </div>
        </div>

        <nav className="nav-items">
          <p className="nav-section-label">{t.navSection}</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
              {counts[item.id] > 0 && (
                <span className="nav-item-count">{counts[item.id]}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="nav-footer">
          <div className="nav-user">
            <span className="nav-user-avatar">
              {user.role === 'teacher' ? '👩‍🏫' : '🎓'}
            </span>
            <div className="nav-user-info">
              <span className="nav-user-name">{user.username}</span>
              <span className="nav-user-role">
                {user.role === 'teacher' ? t.navRoleTeacher : t.navRoleStudent}
              </span>
            </div>
          </div>
          <div className="nav-lang-row">
            <button
              className={`nav-lang-btn ${lang === 'en' ? 'nav-lang-active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
            <button
              className={`nav-lang-btn ${lang === 'ka' ? 'nav-lang-active' : ''}`}
              onClick={() => setLang('ka')}
            >GEO</button>
          </div>
          <button className="nav-theme-btn" onClick={onToggleTheme}>
            {themeLabel}
          </button>
          <button className="nav-logout-btn" onClick={onLogout} title={t.navLogout}>
            {t.navLogout}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavSidebar;
