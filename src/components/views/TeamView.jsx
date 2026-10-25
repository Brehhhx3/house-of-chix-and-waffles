import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { StatusPill } from '../common/StatusBadge'

export function TeamView({
  team,
  onOpenInviteModal,
  onDeleteMember,
  previewMode,
  t,
}) {
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredTeam = team.filter((member) => {
    if (roleFilter === 'all') return true
    return member.role.toLowerCase().includes(roleFilter.toLowerCase())
  })

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.team}</h1>
          <p>
            Give every staff member their own login while keeping social passwords completely hidden.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={onOpenInviteModal}
          >
            <Icon name="plus" size={16} />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="security-note">
        <Icon name="lock" size={20} />
        <div>
          <strong>Role-Based Workspace Security</strong>
          <span>
            Staff members connect directly to their delegated roles. Creator accounts can draft and upload media,
            reviewers approve, and only authorized owners publish or modify connected accounts.
          </span>
        </div>
        <StatusPill status="Protected" />
      </div>

      {/* Workspace Members Table */}
      <section className="panel team-table">
        <div className="panel-heading">
          <h2>
            <Icon name="team" size={18} />
            <span>Workspace Staff ({team.length})</span>
          </h2>
          <div className="filter-tabs">
            <button
              className={roleFilter === 'all' ? 'selected' : ''}
              onClick={() => setRoleFilter('all')}
            >
              All Roles
            </button>
            <button
              className={roleFilter === 'creator' ? 'selected' : ''}
              onClick={() => setRoleFilter('creator')}
            >
              Creators
            </button>
            <button
              className={roleFilter === 'reviewer' ? 'selected' : ''}
              onClick={() => setRoleFilter('reviewer')}
            >
              Reviewers
            </button>
            <button
              className={roleFilter === 'cashier' ? 'selected' : ''}
              onClick={() => setRoleFilter('cashier')}
            >
              Cashiers / POS
            </button>
          </div>
        </div>

        {filteredTeam.map((member) => (
          <div className="team-row" key={member.id || member.email}>
            <span className={`avatar avatar-${member.tone || 'orange'}`}>
              {member.initials}
            </span>
            <div className="team-info">
              <strong>{member.name}</strong>
              <small>{member.email}</small>
            </div>
            <span className="role-label">{member.role}</span>
            <div className="permission-note">
              <small>{member.permissions || 'Standard Access'}</small>
            </div>
            <StatusPill status={member.status || 'Active'} />

            {onDeleteMember && member.role !== 'Owner & Executive Chef' && (
              <button
                className="row-menu"
                disabled={previewMode}
                onClick={() => {
                  if (window.confirm(`Revoke workspace access for ${member.name}?`)) {
                    onDeleteMember(member.id)
                  }
                }}
                title="Revoke access"
              >
                <Icon name="trash" size={15} />
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Permissions Breakdown Matrix */}
      <section className="panel permissions-matrix-panel">
        <div className="panel-heading">
          <h2>
            <Icon name="lock" size={18} />
            <span>Permissions Matrix</span>
          </h2>
        </div>
        <div className="matrix-table">
          <div className="matrix-header">
            <span>Role</span>
            <span>Upload Media</span>
            <span>Create Drafts</span>
            <span>Approve & Schedule</span>
            <span>Publish to Feeds</span>
            <span>House Rewards & Toast</span>
          </div>
          <div className="matrix-row">
            <strong>Owner</strong>
            <span>✓</span><span>✓</span><span>✓</span><span>✓</span><span>✓</span>
          </div>
          <div className="matrix-row">
            <strong>Content Creator</strong>
            <span>✓</span><span>✓</span><span>—</span><span>—</span><span>View only</span>
          </div>
          <div className="matrix-row">
            <strong>Kitchen Lead / Reviewer</strong>
            <span>✓</span><span>✓</span><span>✓</span><span>✓</span><span>View only</span>
          </div>
          <div className="matrix-row">
            <strong>Cashier / Front of House</strong>
            <span>—</span><span>—</span><span>—</span><span>—</span><span>Full POS Lookup & Stamp</span>
          </div>
        </div>
      </section>
    </>
  )
}
