import React from 'react'
import { Icon } from './Icon'

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-alert toast-${toast.type || 'info'}`}
          role="status"
        >
          <div className="toast-icon">
            <Icon
              name={
                toast.type === 'success'
                  ? 'check'
                  : toast.type === 'warning'
                  ? 'clock'
                  : toast.type === 'error'
                  ? 'close'
                  : 'spark'
              }
              size={16}
            />
          </div>
          <div className="toast-text">
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>
          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
