import React, { useState } from 'react'
import { Icon } from '../common/Icon'

export function TeamModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Content Creator')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    let tone = 'blue'
    let permissions = 'Drafts & Media'
    if (role === 'Owner') {
      tone = 'orange'
      permissions = 'Full Administrator'
    } else if (role === 'Reviewer') {
      tone = 'green'
      permissions = 'Content Approval & Publishing'
    } else if (role === 'Cashier / Front of House') {
      tone = 'blue'
      permissions = 'Toast POS & House Rewards Lookup'
    } else if (role === 'Analyst') {
      tone = 'purple'
      permissions = 'Analytics & Insights'
    }

    onSave({
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      initials: initials || 'HC',
      tone,
      status: 'Active',
      permissions,
    })
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="modal small-modal" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">TEAM & ACCESS</span>
            <h2>Invite team member</h2>
            <p>They will receive a secure workspace sign-in invite.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {error && (
          <div className="form-error-banner">
            <Icon name="close" size={14} />
            <span>{error}</span>
          </div>
        )}

        <label>
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g. Maya Rivers"
            autoFocus
          />
        </label>

        <label>
          Work Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="name@houseofchix.com"
          />
        </label>

        <label>
          Assigned Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Content Creator">Content Creator (Drafts & Media)</option>
            <option value="Reviewer">Reviewer (Approve & Schedule)</option>
            <option value="Cashier / Front of House">Cashier / Front of House (Toast POS & Loyalty)</option>
            <option value="Analyst">Analyst (Metrics & Insights)</option>
            <option value="Owner">Co-Owner (Full Access)</option>
          </select>
        </label>

        <div className="modal-note">
          <Icon name="lock" size={15} />
          <span>Teammates never see or share raw social media passwords.</span>
        </div>

        <div className="modal-actions">
          <button type="button" className="button button-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            Send Invitation
          </button>
        </div>
      </form>
    </div>
  )
}
