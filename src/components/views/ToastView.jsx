import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { StatusPill } from '../common/StatusBadge'

export function ToastView({
  members = [],
  toastLogs = [],
  onSimulateOrder,
  onApplyRewardAndCloseCheck,
  previewMode,
  t,
}) {
  const [phoneLookup, setPhoneLookup] = useState('401')
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedItem, setSelectedItem] = useState({
    name: 'Boss Box Chicken & Waffle Combo',
    price: 24.5,
  })
  const [rewardApplied, setRewardApplied] = useState(false)
  const [activeTab, setActiveTab] = useState('register') // register | webhooks | config
  const [setupRequested, setSetupRequested] = useState(false)

  const matchingMembers = phoneLookup.trim()
    ? members.filter(
        (m) =>
          m.phone.includes(phoneLookup.trim()) ||
          m.name.toLowerCase().includes(phoneLookup.toLowerCase().trim())
      )
    : []

  const discount = rewardApplied ? (selectedMember?.stamps >= 6 ? 12.0 : 3.5) : 0
  const subtotal = Math.max(0, selectedItem.price - discount)
  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + tax).toFixed(2))

  function handleProcessCheckout() {
    if (!selectedMember) return

    onApplyRewardAndCloseCheck({
      member: selectedMember,
      itemName: selectedItem.name,
      originalPrice: selectedItem.price,
      discount,
      finalTotal: total,
      rewardWasRedeemed: rewardApplied,
    })

    // Reset simulator
    setRewardApplied(false)
    setSelectedMember(null)
    setPhoneLookup('')
  }

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.toast}</h1>
          <p>
            Connect restaurant transactions to social reporting and House Rewards without copying sales by hand.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-gold"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={() => onSimulateOrder()}
          >
            <Icon name="spark" size={15} />
            <span>⚡ Simulate Live POS Order</span>
          </button>
        </div>
      </div>

      {/* Toast Hero */}
      <section className="toast-hero">
        <div className="toast-brand">
          <span className="toast-logo">T</span>
          <div>
            <span className="section-kicker">TRANSACTION SOURCE OF TRUTH</span>
            <h2>Toast POS Integration</h2>
            <p>
              Direct bridge between counter checkouts, guest phone identifiers, and visit stamps.
            </p>
          </div>
        </div>

        <div className="toast-status">
          <StatusPill status="Toast Sandbox Active" />
          <small>Listening to Providence register events</small>
        </div>
      </section>

      {/* Integration Spec Cards */}
      <div className="integration-grid">
        <article className="integration-card">
          <div className="integration-icon">
            <Icon name="chart" size={19} />
          </div>
          <h3>Transaction Sync</h3>
          <p>Pulls completed orders into the dashboard to correlate social campaigns with actual meal revenue.</p>
          <span className="integration-status"><span className="status-dot" />Active Webhook</span>
        </article>

        <article className="integration-card">
          <div className="integration-icon">
            <Icon name="users" size={19} />
          </div>
          <h3>House Rewards Sync</h3>
          <p>Cashier looks up phone number on Toast POS screen; available perks display instantly before payment.</p>
          <span className="integration-status"><span className="status-dot" />2-Way Protocol</span>
        </article>

        <article className="integration-card">
          <div className="integration-icon">
            <Icon name="link" size={19} />
          </div>
          <h3>Location GUID Mapping</h3>
          <p>Maps Providence restaurant GUID (<code>hocw-pvd-downtown-01</code>) to this workspace.</p>
          <span className="integration-status"><span className="status-dot" />Mapped</span>
        </article>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="toast-subnav">
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          <Icon name="toast" size={15} />
          <span>Interactive Register Checkout</span>
        </button>
        <button
          className={activeTab === 'webhooks' ? 'active' : ''}
          onClick={() => setActiveTab('webhooks')}
        >
          <Icon name="spark" size={15} />
          <span>Live Webhook Feed ({toastLogs.length})</span>
        </button>
        <button
          className={activeTab === 'config' ? 'active' : ''}
          onClick={() => setActiveTab('config')}
        >
          <Icon name="lock" size={15} />
          <span>API Credentials & Setup</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE REGISTER LOOKUP */}
      {activeTab === 'register' && (
        <section className="toast-workflow">
          <div className="panel-heading">
            <h2>
              <Icon name="users" size={18} />
              <span>Simulate Toast Terminal at Checkout</span>
            </h2>
            <span className="demo-label">INTERACTIVE TERMINAL MOCKUP</span>
          </div>

          <div className="workflow-body">
            {/* Step Explanation */}
            <div className="workflow-steps">
              <div className="workflow-step active">
                <span>1</span>
                <div>
                  <strong>Guest provides phone number</strong>
                  <small>Marcus enters the 10-digit number into Toast POS.</small>
                </div>
              </div>

              <div className="workflow-step active">
                <span>2</span>
                <div>
                  <strong>Toast queries House Rewards API</strong>
                  <small>Server returns active punch count (e.g. 4/6 stamps) and unlocked perks.</small>
                </div>
              </div>

              <div className="workflow-step active">
                <span>3</span>
                <div>
                  <strong>Discount applies to the bill</strong>
                  <small>If redeeming, Toast deducts the approved food perk before card swipe.</small>
                </div>
              </div>

              <div className="workflow-step active">
                <span>4</span>
                <div>
                  <strong>Visit stamp automatically posts</strong>
                  <small>Payment triggers a webhook event; member's card is credited asynchronously.</small>
                </div>
              </div>
            </div>

            {/* POS Screen Simulation */}
            <div className="pos-terminal-box">
              <div className="pos-terminal-header">
                <span className="pos-badge">TOAST TERMINAL 01</span>
                <strong>Check #4105</strong>
              </div>

              {/* Order Item Selector */}
              <div className="pos-item-select">
                <label>Active Order Entree:</label>
                <select
                  value={selectedItem.name}
                  onChange={(e) => {
                    if (e.target.value.includes('Boss Box')) {
                      setSelectedItem({ name: 'Boss Box Chicken & Waffle Combo', price: 24.5 })
                    } else if (e.target.value.includes('Tenders Basket')) {
                      setSelectedItem({ name: 'Crispy Tenders Basket & Fries', price: 16.0 })
                    } else {
                      setSelectedItem({ name: 'Classic Golden Belgian Waffle', price: 12.0 })
                    }
                  }}
                >
                  <option value="Boss Box Chicken & Waffle Combo">Boss Box Chicken & Waffle Combo ($24.50)</option>
                  <option value="Crispy Tenders Basket & Fries">Crispy Tenders Basket & Fries ($16.00)</option>
                  <option value="Classic Golden Belgian Waffle">Classic Golden Belgian Waffle ($12.00)</option>
                </select>
              </div>

              {/* Phone Lookup Field */}
              <div className="lookup-field-wrap">
                <label>Guest Loyalty Phone Lookup:</label>
                <div className="pos-input-group">
                  <Icon name="search" size={15} />
                  <input
                    type="text"
                    value={phoneLookup}
                    onChange={(e) => {
                      setPhoneLookup(e.target.value)
                      setSelectedMember(null)
                      setRewardApplied(false)
                    }}
                    placeholder="Enter phone or name (e.g. 401 or James)"
                  />
                </div>
              </div>

              {/* Search Results */}
              {matchingMembers.length > 0 && !selectedMember && (
                <div className="pos-member-results">
                  {matchingMembers.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="pos-member-chip"
                      onClick={() => setSelectedMember(m)}
                    >
                      <span className="avatar avatar-orange">{m.initials}</span>
                      <div>
                        <strong>{m.name}</strong>
                        <small>{m.phone} · {m.stamps}/6 stamps</small>
                      </div>
                      <span className="pos-select-pill">Select</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Member Details */}
              {selectedMember && (
                <div className="pos-selected-member-card">
                  <div className="pos-card-top">
                    <div>
                      <strong>{selectedMember.name}</strong>
                      <small>{selectedMember.phone}</small>
                    </div>
                    <span className="pos-stamp-count">{selectedMember.stamps} / 6 STAMPS</span>
                  </div>

                  <p className="pos-reward-hint">
                    <Icon name="spark" size={13} />
                    <span>{selectedMember.nextReward}</span>
                  </p>

                  {selectedMember.stamps >= 3 && (
                    <label className="pos-apply-toggle">
                      <input
                        type="checkbox"
                        checked={rewardApplied}
                        onChange={(e) => setRewardApplied(e.target.checked)}
                      />
                      <span>
                        Apply {selectedMember.stamps >= 6 ? 'Free Waffle (-$12.00)' : 'Drink/Side (-$3.50)'} to Check
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Order Receipt Summary */}
              <div className="pos-receipt">
                <div className="receipt-line">
                  <span>{selectedItem.name}</span>
                  <span>${selectedItem.price.toFixed(2)}</span>
                </div>
                {rewardApplied && (
                  <div className="receipt-line discount-line">
                    <span>House Rewards Perk Applied</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="receipt-line">
                  <span>RI Meals Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="receipt-line total-line">
                  <strong>Total Due:</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>

              {/* POS Action */}
              <button
                className="button button-primary full"
                disabled={previewMode || !selectedMember}
                onClick={handleProcessCheckout}
              >
                <Icon name="check" size={16} />
                <span>
                  {selectedMember
                    ? `Close Check & Award +1 Visit Stamp to ${selectedMember.name.split(' ')[0]}`
                    : 'Search Guest to Complete POS Sync'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: LIVE WEBHOOK STREAM */}
      {activeTab === 'webhooks' && (
        <section className="panel webhook-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="spark" size={18} />
              <span>Toast Webhook Event Stream (JSON)</span>
            </h2>
            <button
              className="button button-outline btn-sm"
              onClick={() => onSimulateOrder()}
            >
              <Icon name="plus" size={13} />
              <span>Trigger Test Event</span>
            </button>
          </div>

          <div className="webhook-log-list">
            {toastLogs.map((log) => (
              <div className="webhook-log-row" key={log.id}>
                <span className={`log-badge log-${log.status.toLowerCase()}`}>
                  {log.status}
                </span>
                <div className="log-info">
                  <strong>{log.type} · {log.id}</strong>
                  <p>{log.guest} · {log.table} · {log.amount}</p>
                  <small>{log.action}</small>
                </div>
                <time className="log-time">{log.timestamp}</time>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: CONFIGURATION */}
      {activeTab === 'config' && (
        <section className="panel config-panel">
          <div className="panel-heading">
            <h2>
              <Icon name="lock" size={18} />
              <span>Production Toast Setup Checklist</span>
            </h2>
          </div>

          <div className="config-checklist">
            <div className="check-item done">
              <Icon name="check" size={16} />
              <div>
                <strong>Sandbox API Authentication</strong>
                <p>Configured with mock Toast loyalty endpoints.</p>
              </div>
            </div>

            <div className="check-item">
              <Icon name="clock" size={16} />
              <div>
                <strong>Restaurant GUID Provisioning</strong>
                <p>Requires Toast Partner Portal access to generate production GUID for <code>House of Chix & Waffles</code>.</p>
              </div>
            </div>

            <div className="check-item">
              <Icon name="clock" size={16} />
              <div>
                <strong>Webhook Security Secret</strong>
                <p>Generate an HMAC SHA256 secret in Toast backend to sign incoming order payloads.</p>
              </div>
            </div>

            <button
              className="button button-primary"
              disabled={previewMode}
              onClick={() => setSetupRequested(true)}
            >
              {setupRequested ? '✓ Setup Requirements Saved' : 'Save Toast Credentials'}
            </button>
          </div>
        </section>
      )}
    </>
  )
}
