import React from 'react'
import { PLATFORMS } from '../../constants/data'

export function PlatformIcon({ platform, size = 26, showLabel = false }) {
  const data = PLATFORMS.find((p) => p.key === platform) || {
    key: platform,
    name: platform,
    icon: '•',
    tone: 'muted',
  }

  return (
    <div className="platform-badge-container">
      <span
        className={`platform-icon ${data.tone}`}
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.5) }}
        title={data.name}
      >
        {data.icon}
      </span>
      {showLabel && <span className="platform-label">{data.name}</span>}
    </div>
  )
}
