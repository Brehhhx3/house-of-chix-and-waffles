import React from 'react'

export function StatusPill({ status }) {
  let tone = 'info'
  if (
    status === 'Ready to publish' ||
    status === 'Approved' ||
    status === 'Connected' ||
    status === 'Active' ||
    status === 'Published'
  ) {
    tone = 'success'
  } else if (
    status === 'Needs review' ||
    status === 'Pending' ||
    status === 'Changes requested'
  ) {
    tone = 'warning'
  } else if (status === 'Scheduled') {
    tone = 'purple'
  } else if (status === 'Not connected' || status === 'Inactive') {
    tone = 'muted'
  }

  return (
    <span className={`status-pill ${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  )
}
