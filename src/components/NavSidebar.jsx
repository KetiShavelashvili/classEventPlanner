import React from 'react';
import './NavSidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📋' },
  { id: 'past',      label: 'Past Events', icon: '🗂️' },
];

const NavSidebar = ({ currentPage, onNavigate, user, upcomingCount, pastCount, onLogout, theme, onToggleTheme }) => {
  const counts = { dashboard: upcomingCount, past: pastCount };

  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar-inner">
        {/* Logo */}
        <div className="nav-logo">
          <span className="nav-logo-icon">📅</span>
          <div className="nav-logo-text">
            <span className="nav-logo-title">EventPlanner</span>
            <span className="nav-logo-sub">Class Schedule</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="nav-items">
          <p className="nav-section-label">Navigation</p>
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

        {/* User + Logout */}
        <div className="nav-footer">
          <div className="nav-user">
            <span className="nav-user-avatar">
              {user.role === 'teacher' ? '👩‍🏫' : '🎓'}
            </span>
            <div className="nav-user-info">
              <span className="nav-user-name">{user.username}</span>
              <span className="nav-user-role">
                {user.role === 'teacher' ? 'Teacher' : 'Student'}
              </span>
            </div>
          </div>
          <button className="nav-theme-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="nav-logout-btn" onClick={onLogout} title="Log out">
            🚪 Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavSidebar;
