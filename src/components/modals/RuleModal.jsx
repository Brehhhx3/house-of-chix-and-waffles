import React, { useState } from 'react'
import { Icon } from '../common/Icon'

export function RuleModal({ initialRules, onClose, onSave }) {
  const [rules, setRules] = useState(initialRules)

  function handleSubmit(e) {
    e.preventDefault()
    onSave(rules)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">OPERATIONAL GUARDRAILS</span>
            <h2>House Rewards Program Rules</h2>
            <p>Keep loyalty simple, margin-safe, and easy to explain at the counter.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <label>
          Qualifying Purchase Definition
          <input
            type="text"
            value={rules.stampRequirement}
            onChange={(e) =>
              setRules({ ...rules, stampRequirement: e.target.value })
            }
          />
          <small className="field-hint">
            Recommended: 1 whole visit per qualifying entrée or meal purchase.
          </small>
        </label>

        <div className="form-row">
          <label>
            3-Stamp Milestone Perk
            <input
              type="text"
              value={rules.perk3Stamps}
              onChange={(e) =>
                setRules({ ...rules, perk3Stamps: e.target.value })
              }
            />
          </label>

          <label>
            6-Stamp Reward
            <input
              type="text"
              value={rules.reward6Stamps}
              onChange={(e) =>
                setRules({ ...rules, reward6Stamps: e.target.value })
              }
            />
          </label>
        </div>

        <div className="guardrail-switches">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rules.allowDeliveryStamps}
              onChange={(e) =>
                setRules({ ...rules, allowDeliveryStamps: e.target.checked })
              }
            />
            <span>Allow 3rd-party delivery orders (DoorDash/UberEats) to earn stamps</span>
          </label>

          <div className="strict-guardrail-notice">
            <Icon name="lock" size={16} />
            <div>
              <strong>Strict Integrity Rule: No Paid/Incentivized Reviews</strong>
              <p>
                Reviews on Google, Yelp, or Facebook must always remain voluntary
                and un-incentivized. Never offer stamps or discounts for 5-star reviews.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="button button-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            Save Rule Guardrails
          </button>
        </div>
      </form>
    </div>
  )
}
