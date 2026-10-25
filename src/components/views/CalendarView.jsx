import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'
import { WEEKLY_CADENCE, PLATFORMS } from '../../constants/data'

export function CalendarView({
  posts,
  onOpenCreatePost,
  onOpenEditPost,
  previewMode,
  t,
}) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [platformFilter, setPlatformFilter] = useState('all')
  const [viewType, setViewType] = useState('week') // 'week' | 'month'

  const days = [
    { name: 'Monday', short: 'Mon 26', cadence: WEEKLY_CADENCE[0] },
    { name: 'Tuesday', short: 'Tue 27', cadence: WEEKLY_CADENCE[1] },
    { name: 'Wednesday', short: 'Wed 28', cadence: WEEKLY_CADENCE[2] },
    { name: 'Thursday', short: 'Thu 29', cadence: WEEKLY_CADENCE[3] },
    { name: 'Friday', short: 'Fri 30', cadence: WEEKLY_CADENCE[4] },
    { name: 'Saturday', short: 'Sat 31', cadence: WEEKLY_CADENCE[5] },
    { name: 'Sunday', short: 'Sun 1', cadence: WEEKLY_CADENCE[6] },
  ]

  const filteredPosts = posts.filter(
    (p) => platformFilter === 'all' || p.platforms.includes(platformFilter)
  )

  function getPostsForDay(dayName, index) {
    return filteredPosts.filter(
      (p) =>
        p.date === dayName ||
        (dayName === 'Monday' && p.date === 'Today') ||
        (dayName === 'Tuesday' && p.date === 'Tomorrow') ||
        p.dayIndex === index
    )
  }

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.calendar}</h1>
          <p>
            Scheduled posts mapped to your 7-day restaurant marketing rhythm.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={() => onOpenCreatePost()}
          >
            <Icon name="plus" size={16} />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls Toolbar */}
      <div className="calendar-toolbar">
        <div className="calendar-nav-buttons">
          <button
            className="button button-outline"
            onClick={() => setCurrentWeekOffset((c) => c - 1)}
            aria-label="Previous week"
          >
            ‹
          </button>
          <strong className="calendar-title-range">
            {currentWeekOffset === 0
              ? 'Current Week · Oct 26 – Nov 1, 2026'
              : currentWeekOffset > 0
              ? `Next Week (+${currentWeekOffset})`
              : `Past Week (${currentWeekOffset})`}
          </strong>
          <button
            className="button button-outline"
            onClick={() => setCurrentWeekOffset((c) => c + 1)}
            aria-label="Next week"
          >
            ›
          </button>
          {currentWeekOffset !== 0 && (
            <button
              className="text-button"
              onClick={() => setCurrentWeekOffset(0)}
            >
              Reset to Today
            </button>
          )}
        </div>

        <div className="toolbar-spacer" />

        {/* Filter by Platform */}
        <div className="calendar-filter-chips">
          <button
            className={`cal-filter-btn ${platformFilter === 'all' ? 'active' : ''}`}
            onClick={() => setPlatformFilter('all')}
          >
            All Platforms
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              className={`cal-filter-btn ${platformFilter === p.key ? 'active' : ''}`}
              onClick={() => setPlatformFilter(p.key)}
            >
              <PlatformIcon platform={p.key} size={14} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <div className="view-switch-btns">
          <button
            className={`view-btn ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => setViewType('week')}
          >
            Week
          </button>
          <button
            className={`view-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Interactive 7-Day Grid */}
      <section className="calendar-grid">
        {days.map((day, idx) => {
          const dayPosts = getPostsForDay(day.name, idx)
          const isToday = idx === 0 && currentWeekOffset === 0

          return (
            <div
              className={`calendar-day ${isToday ? 'today' : ''}`}
              key={day.name}
            >
              <div className="day-label">
                <div className="day-name-row">
                  <strong>{day.short}</strong>
                  {isToday && <span className="today-badge">Today</span>}
                </div>
                <small className="day-cadence-hint">
                  {day.cadence.category.split(' ')[0]} Focus
                </small>
              </div>

              <div className="day-slot">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="calendar-post-card"
                    onClick={() => onOpenEditPost(post)}
                  >
                    <div className="cal-post-img-wrap">
                      <img src={post.image} alt={post.title} />
                      <div className="cal-post-plat-icons">
                        {post.platforms.map((p) => (
                          <PlatformIcon key={p} platform={p} size={15} />
                        ))}
                      </div>
                    </div>
                    <strong>{post.title}</strong>
                    <div className="cal-post-meta">
                      <small>
                        <Icon name="clock" size={11} /> {post.time}
                      </small>
                      <StatusPill status={post.status} />
                    </div>
                  </div>
                ))}

                <button
                  className="calendar-add-btn"
                  disabled={previewMode}
                  title={previewMode ? 'Disabled in boss preview' : undefined}
                  onClick={() =>
                    onOpenCreatePost({
                      date: day.name,
                      time: day.cadence.time,
                      category: day.cadence.category.toLowerCase().includes('behind')
                        ? 'bts'
                        : day.cadence.category.toLowerCase().includes('staff')
                        ? 'staff'
                        : 'food',
                    })
                  }
                >
                  <Icon name="plus" size={14} />
                  <span>Add post</span>
                </button>
              </div>
            </div>
          )
        })}
      </section>

      {/* Cadence Explainer Footer */}
      <div className="cadence-footer-note">
        <Icon name="spark" size={16} />
        <div>
          <strong>Social Media Game Plan Cadence:</strong>
          <span> 3 short-form videos/week · 2 photos/week · Daily Stories · 1 Google Business update/week.</span>
        </div>
      </div>
    </>
  )
}
