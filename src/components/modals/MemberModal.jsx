import React, { useState } from 'react'
import { Icon } from '../common/Icon'

export function MemberModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [stamps, setStamps] = useState(initial?.stamps || 0)
  const [foundingMember, setFoundingMember] = useState(
    initial ? initial.foundingMember : true
  )
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide the customer name.')
      return
    }
    if (!phone.trim()) {
      setError('Please provide a phone number for Toast POS lookup.')
      return
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    let nextReward = '1 more stamp to small perk'
    if (stamps >= 6) {
      nextReward = 'REWARD READY: Free Classic Waffle ($12.00 value)!'
    } else if (stamps >= 3) {
      nextReward = `${6 - stamps} more stamps to free classic waffle`
    } else {
      nextReward = `${3 - stamps} more stamps to free drink/side perk`
    }

    onSave({
      ...(initial || { id: Date.now() }),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      stamps: Number(stamps),
      foundingMember,
      initials: initials || 'CL',
      totalVisits: initial?.totalVisits || (stamps > 0 ? stamps : 1),
      rewardsRedeemed: initial?.rewardsRedeemed || 0,
      joinedDate: initial?.joinedDate || 'Today',
      lastVisit: initial?.lastVisit || 'Today at register',
      nextReward,
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
            <span className="section-kicker">HOUSE REWARDS</span>
            <h2>{initial ? 'Edit member' : 'Add loyalty member'}</h2>
            <p>One-sentence signup: "1 stamp per meal, unlock rewards at 3 & 6 visits."</p>
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
          Customer Name
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g. Aaliyah Brown"
            autoFocus
          />
        </label>

        <div className="form-row">
          <label>
            Phone Number (for Toast Lookup)
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setError('')
              }}
              placeholder="(401) 555-0142"
            />
          </label>

          <label>
            Email (Optional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Initial Stamps (0 to 6)
            <select
              value={stamps}
              onChange={(e) => setStamps(Number(e.target.value))}
            >
              <option value={0}>0 / 6 stamps (New card)</option>
              <option value={1}>1 / 6 stamps (1st meal)</option>
              <option value={2}>2 / 6 stamps</option>
              <option value={3}>3 / 6 stamps (Drink/side unlocked!)</option>
              <option value={4}>4 / 6 stamps</option>
              <option value={5}>5 / 6 stamps</option>
              <option value={6}>6 / 6 stamps (Free Waffle ready!)</option>
            </select>
          </label>

          <label className="checkbox-label" style={{ marginTop: 24 }}>
            <input
              type="checkbox"
              checked={foundingMember}
              onChange={(e) => setFoundingMember(e.target.checked)}
            />
            <span>Founding Member Badge (First 200 regulars)</span>
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="button button-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            {initial ? 'Save Member' : 'Enroll Member'}
          </button>
        </div>
      </form>
    </div>
  )
}
