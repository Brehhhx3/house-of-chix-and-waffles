import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'

export function AnalyticsView({ t }) {
  const [timeRange, setTimeRange] = useState('7d') // 7d | 30d | 90d
  const [selectedMetric, setSelectedMetric] = useState('reach')
  const [platformFilter, setPlatformFilter] = useState('all')

  const metricsData = {
    '7d': {
      reach: '24.8K',
      reachChange: '+12%',
      saves: '1,248',
      savesChange: '+28%',
      visits: '3,620',
      visitsChange: '+18%',
      calls: '284',
      callsChange: '+35%',
      bars: [35, 45, 60, 50, 85, 95, 75],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    '30d': {
      reach: '98.4K',
      reachChange: '+24%',
      saves: '4,890',
      savesChange: '+32%',
      visits: '14,210',
      visitsChange: '+21%',
      calls: '1,120',
      callsChange: '+40%',
      bars: [40, 55, 68, 72, 85, 90, 80],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
    '90d': {
      reach: '284.6K',
      reachChange: '+64%',
      saves: '14,100',
      savesChange: '+88%',
      visits: '42,500',
      visitsChange: '+52%',
      calls: '3,480',
      callsChange: '+75%',
      bars: [30, 42, 58, 65, 80, 88, 100],
      labels: ['Month 1 (Build)', 'Month 2 (Grow)', 'Month 3 (Convert)', 'Oct', 'Nov', 'Dec', 'Jan'],
    },
  }

  const current = metricsData[timeRange]

  const topContent = [
    {
      name: 'Crispy chicken close-up & hot honey drizzle',
      platform: 'facebook',
      reach: '12.4K',
      saves: '482',
      engagement: '6.4%',
      leads: '42 direction requests',
    },
    {
      name: 'Behind the waffle iron: 6:00 AM batter reveal',
      platform: 'tiktok',
      reach: '8.7K',
      saves: '319',
      engagement: '9.1%',
      leads: '18 menu clicks',
    },
    {
      name: 'Friday Boss Box meal feature & tenders',
      platform: 'instagram',
      reach: '6.2K',
      saves: '226',
      engagement: '5.8%',
      leads: '24 website orders',
    },
    {
      name: 'Golden Waffle Day (Double Stamps) Story',
      platform: 'google',
      reach: '4.5K',
      saves: '198',
      engagement: '8.2%',
      leads: '64 in-store redemptions',
    },
  ]

  const filteredContent = topContent.filter(
    (c) => platformFilter === 'all' || c.platform === platformFilter
  )

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.analytics}</h1>
          <p>
            Measure how social content converts into restaurant visits, calls, and House Rewards.
          </p>
        </div>
        <div className="heading-actions">
          <div className="time-range-toggle">
            <button
              className={timeRange === '7d' ? 'active' : ''}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button
              className={timeRange === '30d' ? 'active' : ''}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
            <button
              className={timeRange === '90d' ? 'active' : ''}
              onClick={() => setTimeRange('90d')}
            >
              90-Day Plan
            </button>
          </div>
        </div>
      </div>

      {/* Analytics 4-Card Overview */}
      <div className="analytics-overview">
        <div
          className={`analytics-lead ${selectedMetric === 'reach' ? 'selected' : ''}`}
          onClick={() => setSelectedMetric('reach')}
        >
          <span>Total Discovery Reach</span>
          <strong>{current.reach}</strong>
          <em>↑ {current.reachChange} vs previous period</em>

          {/* Interactive Sparkline / Bar visualization */}
          <div className="chart-bar-container">
            {current.bars.map((val, i) => (
              <div key={i} className="bar-wrapper" title={`${current.labels[i]}: ${val}%`}>
                <div
                  className="bar-fill"
                  style={{ height: `${val}%` }}
                />
                <small className="bar-label">{current.labels[i]}</small>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`analytics-stat ${selectedMetric === 'saves' ? 'selected' : ''}`}
          onClick={() => setSelectedMetric('saves')}
        >
          <span className="stat-icon-row">
            <Icon name="bookmark" size={14} /> Saves & Shares
          </span>
          <strong>{current.saves}</strong>
          <em>↑ {current.savesChange}</em>
          <p className="stat-subtext">High-intent customers saving for weekend dining.</p>
        </div>

        <div
          className={`analytics-stat ${selectedMetric === 'visits' ? 'selected' : ''}`}
          onClick={() => setSelectedMetric('visits')}
        >
          <span className="stat-icon-row">
            <Icon name="users" size={14} /> Profile & Menu Visits
          </span>
          <strong>{current.visits}</strong>
          <em>↑ {current.visitsChange}</em>
          <p className="stat-subtext">Providence diners checking hours & directions.</p>
        </div>

        <div
          className={`analytics-stat ${selectedMetric === 'calls' ? 'selected' : ''}`}
          onClick={() => setSelectedMetric('calls')}
        >
          <span className="stat-icon-row">
            <Icon name="bell" size={14} /> Phone Calls & Directions
          </span>
          <strong>{current.calls}</strong>
          <em>↑ {current.callsChange}</em>
          <p className="stat-subtext">Direct calls to (401) 555-CHICKEN from Google/Social.</p>
        </div>
      </div>

      {/* Top Performing Content Leaderboard */}
      <section className="panel analytics-table">
        <div className="panel-heading">
          <h2>
            <Icon name="spark" size={18} />
            <span>Top Performing Content</span>
          </h2>
          <div className="filter-tabs">
            <button
              className={platformFilter === 'all' ? 'selected' : ''}
              onClick={() => setPlatformFilter('all')}
            >
              All Platforms
            </button>
            <button
              className={platformFilter === 'facebook' ? 'selected' : ''}
              onClick={() => setPlatformFilter('facebook')}
            >
              Facebook
            </button>
            <button
              className={platformFilter === 'instagram' ? 'selected' : ''}
              onClick={() => setPlatformFilter('instagram')}
            >
              Instagram
            </button>
            <button
              className={platformFilter === 'tiktok' ? 'selected' : ''}
              onClick={() => setPlatformFilter('tiktok')}
            >
              TikTok
            </button>
            <button
              className={platformFilter === 'google' ? 'selected' : ''}
              onClick={() => setPlatformFilter('google')}
            >
              Google
            </button>
          </div>
        </div>

        {filteredContent.map((item, idx) => (
          <div className="analytics-row" key={idx}>
            <PlatformIcon platform={item.platform} size={24} />
            <div>
              <strong>{item.name}</strong>
              <small>{item.leads}</small>
            </div>
            <span>
              <small>Reach</small>
              {item.reach}
            </span>
            <span>
              <small>Saves</small>
              {item.saves}
            </span>
            <span>
              <small>Engage</small>
              {item.engagement}
            </span>
            <StatusPill status="Published" />
          </div>
        ))}
      </section>

      {/* Strategy Rule Reference */}
      <div className="strategy-quote-strip">
        <Icon name="spark" size={17} />
        <div>
          <strong>90-Day Conversion Focus:</strong>
          <span> "Compare social activity with calls, direction requests, menu clicks, and in-store loyalty redemptions. Keep what works, cut what doesn't."</span>
        </div>
      </div>
    </>
  )
}
