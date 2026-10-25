import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'

export function SocialPreview({
  post,
  previewMode = false,
  onPublish,
  onEdit,
  customCaption = null,
}) {
  const [activePlatform, setActivePlatform] = useState(
    post?.platforms?.[0] || 'instagram'
  )
  const [isPlaying, setIsPlaying] = useState(false)

  if (!post) {
    return (
      <div className="panel preview-panel empty-preview">
        <Icon name="image" size={32} />
        <p>Select a post from the queue to preview</p>
      </div>
    )
  }

  const platforms = post.platforms || ['instagram']
  const caption =
    customCaption ||
    post.platformCaptions?.[activePlatform] ||
    post.caption ||
    'Nothing hits like crispy chicken and a golden waffle. See you soon!'

  return (
    <div className="panel preview-panel">
      {/* Platform Switcher Tabs */}
      <div className="preview-platform-bar">
        <span className="preview-label">PREVIEW AS:</span>
        <div className="preview-tabs">
          {platforms.map((p) => (
            <button
              key={p}
              className={`preview-tab-btn ${activePlatform === p ? 'active' : ''}`}
              onClick={() => setActivePlatform(p)}
            >
              <PlatformIcon platform={p} size={16} />
              <span>{p === 'google' ? 'Google' : p.charAt(0).toUpperCase() + p.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="preview-card-body">
        {/* Visual Frame */}
        <div className={`mockup-viewport mockup-${activePlatform}`}>
          {activePlatform === 'instagram' && (
            <div className="ig-mockup">
              <div className="ig-header">
                <span className="ig-avatar">🧇</span>
                <div>
                  <strong>houseofchixandwaffles</strong>
                  <small>Providence, Rhode Island</small>
                </div>
                <Icon name="dots" size={16} className="ig-more" />
              </div>
              <div className="media-screen" onClick={() => setIsPlaying(!isPlaying)}>
                <img src={post.image} alt={post.title} />
                <button className={`video-play-btn ${isPlaying ? 'playing' : ''}`}>
                  <Icon name={isPlaying ? 'spark' : 'play'} size={16} />
                </button>
                <div className="reel-sound-tag">
                  <Icon name="spark" size={12} />
                  <span>Original Audio · House of Chix Beats</span>
                </div>
              </div>
              <div className="ig-footer">
                <div className="ig-actions">
                  <Icon name="heart" size={18} />
                  <Icon name="message" size={18} />
                  <Icon name="share" size={18} />
                  <span className="spacer" />
                  <Icon name="bookmark" size={18} />
                </div>
                <div className="ig-likes">
                  <strong>624 likes</strong>
                </div>
                <div className="ig-caption">
                  <strong>houseofchixandwaffles</strong> <span>{caption}</span>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'facebook' && (
            <div className="fb-mockup">
              <div className="fb-header">
                <span className="fb-avatar">🧇</span>
                <div>
                  <strong>House of Chix & Waffles <span className="verified-check">✓</span></strong>
                  <small>Sponsored · Providence, RI · <Icon name="globe" size={10} /></small>
                </div>
                <Icon name="dots" size={16} />
              </div>
              <div className="fb-caption">{caption}</div>
              <div className="fb-media" onClick={() => setIsPlaying(!isPlaying)}>
                <img src={post.image} alt={post.title} />
              </div>
              <div className="fb-stats">
                <span>👍 ❤️ 248</span>
                <span>48 comments · 19 shares</span>
              </div>
              <div className="fb-actions-bar">
                <button><Icon name="heart" size={14} /> Like</button>
                <button><Icon name="message" size={14} /> Comment</button>
                <button><Icon name="share" size={14} /> Share</button>
              </div>
            </div>
          )}

          {activePlatform === 'tiktok' && (
            <div className="tt-mockup">
              <div className="tt-media" onClick={() => setIsPlaying(!isPlaying)}>
                <img src={post.image} alt={post.title} />
                <div className="tt-overlay-sidebar">
                  <div className="tt-sidebar-btn"><Icon name="heart" size={20} /><span>12.4K</span></div>
                  <div className="tt-sidebar-btn"><Icon name="message" size={20} /><span>319</span></div>
                  <div className="tt-sidebar-btn"><Icon name="bookmark" size={20} /><span>842</span></div>
                  <div className="tt-sidebar-btn"><Icon name="share" size={20} /><span>Share</span></div>
                  <div className="tt-disc">🧇</div>
                </div>
                <div className="tt-bottom-overlay">
                  <strong>@houseofchixandwaffles</strong>
                  <p>{caption}</p>
                  <div className="tt-music-row">
                    <Icon name="spark" size={12} />
                    <marquee scrollamount="3">Original Kitchen ASMR Crunch · House of Chix</marquee>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'google' && (
            <div className="gbp-mockup">
              <div className="gbp-header">
                <span className="gbp-g">G</span>
                <div>
                  <strong>House of Chix & Waffles</strong>
                  <small>Update from Business · Today</small>
                </div>
              </div>
              <div className="gbp-media">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="gbp-body">
                <p>{caption}</p>
                <div className="gbp-buttons">
                  <a href="#call" className="gbp-btn primary" onClick={(e) => e.preventDefault()}>
                    <Icon name="bell" size={13} /> Call now
                  </a>
                  <a href="#order" className="gbp-btn outline" onClick={(e) => e.preventDefault()}>
                    <Icon name="link" size={13} /> Order Online
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="preview-action-details">
          <div className="preview-meta-row">
            <StatusPill status={post.status} />
            <span className="preview-time-tag">
              <Icon name="clock" size={13} /> {post.date || 'Today'} at {post.time || '10:00 AM'}
            </span>
          </div>

          <div className="preview-button-group">
            <button
              className="button button-primary full"
              disabled={previewMode}
              title={previewMode ? 'Disabled in boss preview' : undefined}
              onClick={() => onPublish && onPublish(post)}
            >
              <Icon name="send" size={15} />
              <span>{post.status === 'Published' ? 'Published' : 'Publish / Schedule'}</span>
            </button>

            <button
              className="button button-outline full"
              disabled={previewMode}
              title={previewMode ? 'Disabled in boss preview' : undefined}
              onClick={() => onEdit && onEdit(post)}
            >
              <Icon name="edit" size={15} />
              <span>Edit content & captions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
