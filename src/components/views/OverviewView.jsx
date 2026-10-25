import React from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'
import { SocialPreview } from '../previews/SocialPreview'
import { PLATFORMS } from '../../constants/data'

export function OverviewView({
  posts,
  allPosts,
  selectedPost,
  selectedPostId,
  onSelectPost,
  platformFilter,
  setPlatformFilter,
  activity,
  connected,
  onOpenCreatePost,
  onOpenEditPost,
  onPublishPost,
  onNavigate,
  previewMode,
  membersCount = 1248,
  t,
}) {
  return (
    <>
      {/* Page Heading Banner */}
      <div className="page-heading">
        <div>
          <h1>{t.goodMorning}</h1>
          <p>{t.goodMorningSub}</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={onOpenCreatePost}
          >
            <Icon name="plus" size={16} />
            <span>{t.createPost}</span>
          </button>
          <button
            className="button button-outline"
            onClick={() => onNavigate('calendar')}
          >
            <Icon name="calendar" size={15} />
            <span>{t.viewCalendar}</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Queue + Social Live Mockup */}
      <section className="overview-grid top-grid">
        {/* Left Column: Today's Publishing Queue */}
        <div className="panel queue-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="calendar" size={20} />
              <span>{t.todayQueue}</span>
            </h2>
            <button className="text-button" onClick={() => onNavigate('calendar')}>
              {t.viewAll} <Icon name="arrow" size={12} />
            </button>
          </div>

          {/* Platform Filters */}
          <div className="filter-tabs">
            <button
              className={platformFilter === 'all' ? 'selected' : ''}
              onClick={() => setPlatformFilter('all')}
            >
              All ({allPosts.length})
            </button>
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                className={platformFilter === p.key ? 'selected' : ''}
                onClick={() => setPlatformFilter(p.key)}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Table Header */}
          <div className="queue-table">
            <div className="queue-header">
              <span />
              <span>Content</span>
              <span>Platform</span>
              <span>Time</span>
              <span>Status</span>
              <span />
            </div>

            {posts.length ? (
              posts.map((post) => {
                const isSelected = post.id === selectedPostId
                return (
                  <div
                    key={post.id}
                    className={`queue-row ${isSelected ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectPost(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                    <div
                      className={`queue-content ${previewMode ? 'preview-disabled-content' : ''}`}
                      onClick={() => onSelectPost(post.id)}
                    >
                      <img src={post.image} alt="" />
                      <div>
                        <strong>{post.title}</strong>
                        <small>{post.type}</small>
                      </div>
                    </div>
                    <div className="platform-stack">
                      {post.platforms.map((platform) => (
                        <PlatformIcon key={platform} platform={platform} size={20} />
                      ))}
                    </div>
                    <span className="row-time">
                      {post.date} · {post.time}
                    </span>
                    <StatusPill status={post.status} />
                    <button
                      className="row-menu"
                      disabled={previewMode}
                      title={previewMode ? 'Disabled in boss preview' : undefined}
                      onClick={() => onOpenEditPost(post)}
                      aria-label={`Edit ${post.title}`}
                    >
                      <Icon name="edit" size={15} />
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <Icon name="image" size={24} />
                <span>No posts found matching this filter.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Multi-Platform Live Preview */}
        <SocialPreview
          post={selectedPost}
          previewMode={previewMode}
          onPublish={onPublishPost}
          onEdit={onOpenEditPost}
        />
      </section>

      {/* Lower Grid: Activity, Metrics, Platform Health */}
      <section className="overview-grid lower-grid">
        {/* Activity Panel */}
        <div className="panel activity-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="clock" size={18} />
              <span>{t.approvalActivity}</span>
            </h2>
            <button className="text-button" onClick={() => onNavigate('approvals')}>
              Approvals
            </button>
          </div>
          <div className="activity-list">
            {activity.slice(0, 4).map((item, index) => (
              <div className="activity-row" key={`${item.person}-${index}`}>
                <span className={`activity-mark ${item.kind}`}>
                  <Icon
                    name={
                      item.kind === 'comment'
                        ? 'message'
                        : item.kind === 'review'
                        ? 'spark'
                        : 'check'
                    }
                    size={12}
                  />
                </span>
                <span className={`avatar avatar-${index + 1}`}>
                  {item.initial}
                </span>
                <div>
                  <strong>{item.person}</strong>
                  <span>{item.text}</span>
                </div>
                <time>{item.when}</time>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Metrics Panel */}
        <div className="panel metrics-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="chart" size={18} />
              <span>{t.thisWeek}</span>
            </h2>
            <button className="select-button" onClick={() => onNavigate('analytics')}>
              View analytics
            </button>
          </div>
          <div className="metric-list">
            {[
              ['Total Reach', '24.8K', '12%', 'orange', 'users'],
              ['Shares & Saves', '1.2K', '28%', 'gold', 'bookmark'],
              ['Profile Visits', '3.6K', '18%', 'charcoal', 'home'],
              ['Calls / Directions', '284', '35%', 'muted', 'bell'],
            ].map(([label, value, change, tone, icon]) => (
              <div className="metric-row" key={label}>
                <span className={`metric-icon ${tone}`}>
                  <Icon name={icon} size={15} />
                </span>
                <span>{label}</span>
                <strong>{value}</strong>
                <em>↑ {change}</em>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Platforms Health */}
        <div className="panel platforms-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="link" size={18} />
              <span>{t.connectedPlatforms}</span>
            </h2>
            <button className="text-button" onClick={() => onNavigate('accounts')}>
              Manage
            </button>
          </div>
          <div className="platform-list">
            {PLATFORMS.map((platform) => (
              <div className="platform-row" key={platform.key}>
                <PlatformIcon platform={platform.key} size={28} />
                <div>
                  <strong>{platform.name}</strong>
                  <small>{platform.handle}</small>
                </div>
                <StatusPill
                  status={connected[platform.key] ? 'Connected' : 'Not connected'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* House Rewards Quick Strip */}
      <section className="panel club-strip">
        <div className="club-title">
          <h2>{t.houseRewards}</h2>
          <p>Providence diners are returning for stamps</p>
        </div>
        <div className="club-stat">
          <span className="metric-icon orange">
            <Icon name="users" size={18} />
          </span>
          <div>
            <small>{t.activeMembers}</small>
            <strong>
              {membersCount.toLocaleString()} <em>↑ 22%</em>
            </strong>
          </div>
        </div>
        <div className="club-divider" />
        <div className="club-stat">
          <span className="metric-icon gold">
            <Icon name="spark" size={18} />
          </span>
          <div>
            <small>{t.rewardsRedeemed}</small>
            <strong>
              186 <em>↑ 37%</em>
            </strong>
          </div>
        </div>
        <button
          className="circle-button"
          onClick={() => onNavigate('club')}
          aria-label="View House Rewards"
        >
          <Icon name="arrow" size={17} />
        </button>
      </section>
    </>
  )
}
