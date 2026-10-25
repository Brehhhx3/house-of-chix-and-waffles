import React, { useState } from 'react'
import { Icon } from './common/Icon'
import { BrandMark } from './common/BrandMark'

export function Header({
  previewMode,
  language,
  onToggleLanguage,
  onOpenMenu,
  onOpenSearch,
  activeUser,
  onChangeUser,
  onTogglePreview,
  activity = [],
  onResetData,
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const users = [
    { id: 'owner', name: 'Jasmine Carter', role: 'Owner & Executive Chef', initials: 'JC', tone: 'orange' },
    { id: 'creator', name: 'Maya Rivers', role: 'Content Creator', initials: 'MR', tone: 'purple' },
    { id: 'reviewer', name: 'Darnell King', role: 'Kitchen Lead & Reviewer', initials: 'DK', tone: 'green' },
    { id: 'cashier', name: 'Marcus Vance', role: 'Cashier & POS Lead', initials: 'MV', tone: 'blue' },
  ]

  const currentUser = users.find((u) => u.id === activeUser) || users[0]

  return (
    <header className="topbar">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu"
        onClick={onOpenMenu}
        aria-label="Open mobile navigation"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Mobile Brand Mark */}
      <div className="mobile-brand">
        <BrandMark size="small" showSubtitle={false} />
      </div>

      {/* Topbar Workspace Selector */}
      <div className="topbar-workspace">
        <span className="workspace-thumb">▥</span>
        <div>
          <b>House of Chicken & Waffles</b>
          <small>Downtown Providence, RI</small>
        </div>
      </div>

      {/* Search Input Trigger */}
      <div className="search-box" onClick={onOpenSearch} role="button" tabIndex={0}>
        <Icon name="search" size={16} />
        <span className="search-placeholder-text">
          {language === 'es'
            ? 'Buscar publicaciones, fotos o miembros...'
            : 'Search posts, media, or members...'}
        </span>
        <kbd className="search-kbd">⌘K</kbd>
      </div>

      <div className="topbar-right-actions">
        {/* Language Switcher */}
        <button
          className="lang-toggle-btn"
          onClick={onToggleLanguage}
          title="Cambiar idioma / Toggle language"
        >
          <Icon name="globe" size={14} />
          <span>{language === 'es' ? 'ESPAÑOL' : 'ENGLISH'}</span>
        </button>

        {/* Notifications Bell */}
        <div className="notification-wrap">
          <button
            className="icon-button notification-button"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="View notifications"
          >
            <Icon name="bell" size={19} />
            <span className="notification-dot" />
          </button>

          {notifOpen && (
            <div className="notification-dropdown">
              <div className="notif-head">
                <strong>Activity & Alerts</strong>
                <button
                  className="text-link-btn"
                  onClick={() => setNotifOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="notif-list">
                {activity.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="notif-item">
                    <span className={`notif-icon-dot ${act.kind}`} />
                    <div>
                      <strong>{act.person}</strong>
                      <p>{act.text}</p>
                      <small>{act.when}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-wrap">
          <button
            className="profile-button"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className={`avatar avatar-${currentUser.tone}`}>
              {currentUser.initials}
            </span>
            <div className="profile-text">
              <span className="profile-name">{currentUser.name.split(' ')[0]}</span>
              <span className="profile-role">{currentUser.role.split(' ')[0]}</span>
            </div>
            {previewMode && <span className="preview-badge">PREVIEW</span>}
            <Icon name="chevronDown" size={14} />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.role}</small>
              </div>

              <div className="dropdown-divider" />
              <div className="dropdown-section-label">SWITCH ACTIVE ROLE</div>

              {users.map((u) => (
                <button
                  key={u.id}
                  className={`user-switch-item ${u.id === activeUser ? 'active' : ''}`}
                  onClick={() => {
                    onChangeUser(u.id)
                    setProfileOpen(false)
                  }}
                >
                  <span className={`avatar avatar-${u.tone}`}>{u.initials}</span>
                  <div>
                    <strong>{u.name}</strong>
                    <small>{u.role}</small>
                  </div>
                  {u.id === activeUser && <Icon name="check" size={14} />}
                </button>
              ))}

              <div className="dropdown-divider" />

              {/* Boss Preview Toggle */}
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  onTogglePreview()
                  setProfileOpen(false)
                }}
              >
                <Icon name="lock" size={15} />
                <span>
                  {previewMode ? 'Exit Boss Preview' : 'Enable Boss Preview Mode'}
                </span>
              </button>

              {/* Reset Data */}
              <button
                className="dropdown-item-btn danger-item"
                onClick={() => {
                  if (window.confirm('Reset all posts, members, and settings to original state?')) {
                    onResetData()
                    setProfileOpen(false)
                  }
                }}
              >
                <Icon name="refresh" size={15} />
                <span>Reset Demo Workspace Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
