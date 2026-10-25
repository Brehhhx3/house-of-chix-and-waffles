import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { StatusPill } from '../common/StatusBadge'

export function HouseRewardsView({
  members,
  rules,
  onAddMember,
  onUpdateMember,
  onOpenAddMemberModal,
  onOpenRuleModal,
  onActivateGoldenWaffleDay,
  goldenWaffleActive = false,
  previewMode,
  t,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // all | founding | ready
  const [selectedMember, setSelectedMember] = useState(members[0] || null)

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q || m.name.toLowerCase().includes(q) || m.phone.includes(q)

    if (!matchesQuery) return false
    if (activeTab === 'founding') return m.foundingMember
    if (activeTab === 'ready') return m.stamps >= 3
    return true
  })

  function handleAddStamp(member) {
    const multiplier = goldenWaffleActive ? 2 : 1
    const nextStamps = Math.min(6, member.stamps + multiplier)
    const nextVisits = (member.totalVisits || 0) + 1

    let nextReward = ''
    if (nextStamps >= 6) {
      nextReward = 'REWARD READY: Free Classic Waffle ($12.00 value)!'
    } else if (nextStamps >= 3) {
      nextReward = `${6 - nextStamps} more stamps to free classic waffle`
    } else {
      nextReward = `${3 - nextStamps} more stamps to free drink or side`
    }

    const updated = {
      ...member,
      stamps: nextStamps,
      totalVisits: nextVisits,
      lastVisit: 'Just now',
      nextReward,
    }

    onUpdateMember(updated)
    setSelectedMember(updated)
  }

  function handleRedeem(member) {
    if (member.stamps < 3) return
    const isFullReward = member.stamps >= 6

    const updated = {
      ...member,
      stamps: isFullReward ? 0 : member.stamps - 3,
      rewardsRedeemed: (member.rewardsRedeemed || 0) + 1,
      lastVisit: 'Just now (Reward Redeemed)',
      nextReward: isFullReward
        ? 'Card reset: 3 stamps to next perk'
        : '3 more stamps to free classic waffle',
    }

    onUpdateMember(updated)
    setSelectedMember(updated)
  }

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.club}</h1>
          <p>
            Simple visit rewards: 1 stamp per entree, 3 stamps = small perk, 6 stamps = free waffle.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className={`button ${goldenWaffleActive ? 'button-gold' : 'button-outline'}`}
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={onActivateGoldenWaffleDay}
          >
            <Icon name="spark" size={15} />
            <span>
              {goldenWaffleActive
                ? '🌟 Golden Waffle Day Active (2x Stamps)'
                : 'Trigger Golden Waffle Day (2x Stamps)'}
            </span>
          </button>

          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={onOpenAddMemberModal}
          >
            <Icon name="plus" size={16} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="club-hero">
        <div className="club-hero-left">
          <span className="section-kicker">COMMUNITY LOYALTY ENGINE</span>
          <h2>House Rewards</h2>
          <p>
            Diners earn stamps for real meals. No complex point math, no required app download.
            Marcus looks them up by phone at the Toast checkout in under 3 seconds.
          </p>
          <div className="club-hero-tags">
            <span className="hero-tag">✓ 1 Stamp = 1 Qualifying Meal</span>
            <span className="hero-tag">✓ 3 Stamps = Free Drink / Side</span>
            <span className="hero-tag">✓ 6 Stamps = Free Classic Waffle</span>
          </div>
        </div>

        <div className="club-hero-stat-circle">
          <strong>{members.length + 1245}</strong>
          <span>Enrolled Regulars</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="club-cards">
        <div>
          <span>Rewards Redeemed This Month</span>
          <strong>186</strong>
          <small>↑ 37% vs last month</small>
        </div>
        <div>
          <span>Repeat Visit Rate</span>
          <strong>68%</strong>
          <small>↑ 9% average diner retention</small>
        </div>
        <div>
          <span>Bonus Stamp Days</span>
          <strong>{goldenWaffleActive ? 'Active Today!' : '2 Scheduled'}</strong>
          <small>{goldenWaffleActive ? 'Double stamps on every entree' : 'Next: Golden Waffle Friday'}</small>
        </div>
      </div>

      {/* Main Interactive Loyalty Split: Member Directory + Digital Punch Card */}
      <section className="rewards-workspace-grid">
        {/* Left Column: Member Directory */}
        <div className="panel member-directory-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="users" size={18} />
              <span>Diner Directory ({members.length})</span>
            </h2>
            <div className="directory-search">
              <Icon name="search" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or phone..."
              />
            </div>
          </div>

          <div className="filter-tabs">
            <button
              className={activeTab === 'all' ? 'selected' : ''}
              onClick={() => setActiveTab('all')}
            >
              All Members
            </button>
            <button
              className={activeTab === 'founding' ? 'selected' : ''}
              onClick={() => setActiveTab('founding')}
            >
              Founding Members
            </button>
            <button
              className={activeTab === 'ready' ? 'selected' : ''}
              onClick={() => setActiveTab('ready')}
            >
              Reward Ready (3+ Stamps)
            </button>
          </div>

          <div className="member-list-scroll">
            {filteredMembers.map((member) => {
              const isSelected = selectedMember?.id === member.id
              return (
                <div
                  key={member.id}
                  className={`member-row-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMember(member)}
                >
                  <span className="avatar avatar-orange">{member.initials}</span>
                  <div className="member-row-info">
                    <div className="member-name-line">
                      <strong>{member.name}</strong>
                      {member.foundingMember && (
                        <span className="founding-badge">FOUNDING</span>
                      )}
                    </div>
                    <small>{member.phone} · {member.email}</small>
                  </div>
                  <div className="member-stamp-badge">
                    <strong>{member.stamps} / 6</strong>
                    <small>stamps</small>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Live Digital Punch Card & Actions */}
        <div className="panel digital-card-panel">
          {selectedMember ? (
            <div className="punch-card-wrapper">
              <div className="punch-card-header">
                <div>
                  <span className="section-kicker">MEMBER PUNCH CARD</span>
                  <h3>{selectedMember.name}</h3>
                  <small>{selectedMember.phone} · Joined {selectedMember.joinedDate}</small>
                </div>
                {selectedMember.foundingMember && (
                  <span className="founding-pill">🌟 Founding Member</span>
                )}
              </div>

              {/* Digital Punch Card Graphic */}
              <div className="punch-card-graphic">
                <div className="punch-card-brand">
                  <span>HOUSE OF CHICKEN & WAFFLES</span>
                  <strong>HOUSE PASS</strong>
                </div>

                <div className="stamps-grid-6">
                  {[1, 2, 3, 4, 5, 6].map((slot) => {
                    const isEarned = slot <= selectedMember.stamps
                    const isMilestone = slot === 3 || slot === 6
                    return (
                      <div
                        key={slot}
                        className={`stamp-slot ${isEarned ? 'earned' : ''} ${
                          isMilestone ? 'milestone' : ''
                        }`}
                      >
                        {isEarned ? (
                          <span className="stamp-mark">🧇</span>
                        ) : (
                          <span className="stamp-number">{slot}</span>
                        )}
                        {slot === 3 && <small className="slot-perk">Perk</small>}
                        {slot === 6 && <small className="slot-perk">FREE WAFFLE</small>}
                      </div>
                    )
                  })}
                </div>

                <div className="punch-card-foot">
                  <p className="reward-status-text">
                    <Icon name="spark" size={14} />
                    <span>{selectedMember.nextReward}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="punch-card-actions">
                <button
                  className="button button-primary full"
                  disabled={previewMode}
                  title={previewMode ? 'Disabled in boss preview' : undefined}
                  onClick={() => handleAddStamp(selectedMember)}
                >
                  <Icon name="plus" size={15} />
                  <span>
                    Add {goldenWaffleActive ? 'Double Stamp (2x)' : 'Visit Stamp (+1)'}
                  </span>
                </button>

                {selectedMember.stamps >= 3 && (
                  <button
                    className="button button-gold full"
                    disabled={previewMode}
                    title={previewMode ? 'Disabled in boss preview' : undefined}
                    onClick={() => handleRedeem(selectedMember)}
                  >
                    <Icon name="check" size={15} />
                    <span>
                      Redeem {selectedMember.stamps >= 6 ? 'Free Classic Waffle' : 'Drink/Side Perk'}
                    </span>
                  </button>
                )}
              </div>

              <div className="member-lifetime-stats">
                <div>
                  <small>Total Visits</small>
                  <strong>{selectedMember.totalVisits || selectedMember.stamps}</strong>
                </div>
                <div>
                  <small>Rewards Redeemed</small>
                  <strong>{selectedMember.rewardsRedeemed || 0}</strong>
                </div>
                <div>
                  <small>Last Visit</small>
                  <span>{selectedMember.lastVisit || 'Today'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="users" size={32} />
              <p>Select a member from the directory to view their punch card</p>
            </div>
          )}
        </div>
      </section>

      {/* Program Guardrails Section */}
      <section className="panel guardrail-panel">
        <div className="panel-heading">
          <h2>
            <Icon name="lock" size={18} />
            <span>Program Guardrails & Cost Protection</span>
          </h2>
          <button
            className="button button-outline btn-sm"
            disabled={previewMode}
            onClick={onOpenRuleModal}
          >
            <Icon name="edit" size={13} />
            <span>Edit Rules</span>
          </button>
        </div>
        <p>
          Qualifying rule: {rules.stampRequirement}. 3 stamps unlock: {rules.perk3Stamps}.
          6 stamps unlock: {rules.reward6Stamps}.
        </p>
        <div className="guardrail-list">
          <span>
            <Icon name="check" size={15} /> Owner-Approved Reward Values (Food cost safe)
          </span>
          <span>
            <Icon name="check" size={15} /> Whole-Visit Stamps (No percentage confusion)
          </span>
          <span>
            <Icon name="lock" size={15} /> Reviews Must Remain Voluntary (Never incentivize public reviews)
          </span>
          <span>
            <Icon name="check" size={15} /> Physical or Phone Lookup at Register (No forced app download)
          </span>
        </div>
      </section>
    </>
  )
}
