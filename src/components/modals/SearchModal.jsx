import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'

export function SearchModal({
  isOpen,
  onClose,
  posts = [],
  media = [],
  members = [],
  team = [],
  onSelectPost,
  onNavigate,
}) {
  const [query, setQuery] = useState('')

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const matchingPosts = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.caption?.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      )
    : posts.slice(0, 3)

  const matchingMedia = q
    ? media.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.tags?.some((t) => t.toLowerCase().includes(q))
      )
    : media.slice(0, 3)

  const matchingMembers = q
    ? members.filter(
        (mem) =>
          mem.name.toLowerCase().includes(q) || mem.phone.includes(q)
      )
    : members.slice(0, 3)

  const matchingTeam = q
    ? team.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q)
      )
    : []

  return (
    <div
      className="modal-backdrop search-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="search-palette">
        <div className="search-palette-input-wrap">
          <Icon name="search" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, media, loyalty members, or team..."
            autoFocus
          />
          <kbd className="esc-key" onClick={onClose}>ESC</kbd>
        </div>

        <div className="search-results-scroll">
          {/* Posts */}
          {matchingPosts.length > 0 && (
            <div className="search-group">
              <span className="search-group-title">
                <Icon name="file" size={13} /> Posts ({matchingPosts.length})
              </span>
              {matchingPosts.map((p) => (
                <div
                  key={p.id}
                  className="search-item"
                  onClick={() => {
                    onSelectPost(p)
                    onNavigate('overview')
                    onClose()
                  }}
                >
                  <img src={p.image} alt="" className="search-item-thumb" />
                  <div className="search-item-info">
                    <strong>{p.title}</strong>
                    <small>
                      {p.type} · <span className="status-highlight">{p.status}</span>
                    </small>
                  </div>
                  <div className="search-item-icons">
                    {p.platforms.map((plat) => (
                      <PlatformIcon key={plat} platform={plat} size={18} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* House Rewards Members */}
          {matchingMembers.length > 0 && (
            <div className="search-group">
              <span className="search-group-title">
                <Icon name="users" size={13} /> House Rewards ({matchingMembers.length})
              </span>
              {matchingMembers.map((m) => (
                <div
                  key={m.id}
                  className="search-item"
                  onClick={() => {
                    onNavigate('club')
                    onClose()
                  }}
                >
                  <span className="avatar avatar-orange">{m.initials}</span>
                  <div className="search-item-info">
                    <strong>{m.name}</strong>
                    <small>{m.phone} · {m.stamps}/6 stamps</small>
                  </div>
                  <span className="stamp-badge">{m.stamps} stamps</span>
                </div>
              ))}
            </div>
          )}

          {/* Media */}
          {matchingMedia.length > 0 && (
            <div className="search-group">
              <span className="search-group-title">
                <Icon name="image" size={13} /> Media Library ({matchingMedia.length})
              </span>
              {matchingMedia.map((m) => (
                <div
                  key={m.id}
                  className="search-item"
                  onClick={() => {
                    onNavigate('media')
                    onClose()
                  }}
                >
                  <img src={m.image} alt="" className="search-item-thumb" />
                  <div className="search-item-info">
                    <strong>{m.name}</strong>
                    <small>{m.type}</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team */}
          {matchingTeam.length > 0 && (
            <div className="search-group">
              <span className="search-group-title">
                <Icon name="team" size={13} /> Team Members ({matchingTeam.length})
              </span>
              {matchingTeam.map((t) => (
                <div
                  key={t.id}
                  className="search-item"
                  onClick={() => {
                    onNavigate('team')
                    onClose()
                  }}
                >
                  <span className={`avatar avatar-${t.tone}`}>{t.initials}</span>
                  <div className="search-item-info">
                    <strong>{t.name}</strong>
                    <small>{t.email} · {t.role}</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchingPosts.length === 0 &&
            matchingMembers.length === 0 &&
            matchingMedia.length === 0 &&
            matchingTeam.length === 0 && (
              <div className="search-empty-state">
                <Icon name="search" size={24} />
                <p>No results found for "{query}"</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
