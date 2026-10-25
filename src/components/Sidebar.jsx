import React from 'react'
import { Icon } from './common/Icon'
import { BrandMark } from './common/BrandMark'

export function Sidebar({
  activeView,
  onNavigate,
  isOpen,
  onClose,
  approvalsCount = 0,
  publishedCount = 0,
  language = 'en',
  t,
}) {
  const navItems = [
    { id: 'overview', label: t.overview, icon: 'home' },
    { id: 'calendar', label: t.calendar, icon: 'calendar' },
    { id: 'media', label: t.media, icon: 'image' },
    {
      id: 'approvals',
      label: t.approvals,
      icon: 'file',
      badge: approvalsCount > 0 ? approvalsCount : null,
      badgeColor: 'warning',
    },
    {
      id: 'published',
      label: t.publishedNav,
      icon: 'send',
      badge: publishedCount > 0 ? publishedCount : null,
    },
    { id: 'analytics', label: t.analytics, icon: 'chart' },
    { id: 'club', label: t.club, icon: 'users', highlight: true },
    { id: 'team', label: t.team, icon: 'team' },
    { id: 'accounts', label: t.accounts, icon: 'link' },
    { id: 'toast', label: t.toast, icon: 'toast' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        <BrandMark onClick={() => onNavigate('overview')} />
        <button
          className="mobile-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="workspace-select">
        <span className="workspace-thumb">🍗</span>
        <div>
          <b>House of Chix & Waffles</b>
          <small>Providence Hub · Active</small>
        </div>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''} ${
              item.highlight ? 'nav-item-highlight' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`nav-count nav-count-${item.badgeColor || 'default'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-food" />
        <p>
          Great food
          <br />
          builds stronger
          <br />
          communities.
        </p>
        <span className="version">HOUSE HUB · v2.0 PRO</span>
      </div>
    </aside>
  )
}
