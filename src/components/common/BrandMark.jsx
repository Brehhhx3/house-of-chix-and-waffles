import React from 'react'

export function BrandMark({ size = 'normal', showSubtitle = true, onClick }) {
  return (
    <div
      className={`brand-mark ${size === 'small' ? 'brand-mark-small' : ''}`}
      aria-label="House of Chicken & Waffles Social Hub"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="brand-mark-logo-wrap">
        <span className="brand-crest">🧇</span>
      </div>
      <div className="brand-text-stack">
        <span className="brand-sub">HOUSE OF</span>
        <strong className="brand-title">Chicken & Waffles</strong>
        {showSubtitle && <small className="brand-hub">SOCIAL HUB · PROVIDENCE</small>}
      </div>
    </div>
  )
}
