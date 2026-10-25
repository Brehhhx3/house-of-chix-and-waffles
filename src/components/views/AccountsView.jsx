import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'
import { PLATFORMS } from '../../constants/data'

export function AccountsView({
  connected,
  onToggleConnection,
  previewMode,
  t,
}) {
  const [connectingModal, setConnectingModal] = useState(null)

  function handleConnectAction(platform) {
    if (connected[platform.key]) {
      onToggleConnection(platform.key)
    } else {
      setConnectingModal(platform)
    }
  }

  function handleConfirmOAuth(platformKey) {
    onToggleConnection(platformKey)
    setConnectingModal(null)
  }

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.accounts}</h1>
          <p>
            Secure API connections to Providence social feeds. No raw passwords are ever stored.
          </p>
        </div>
      </div>

      <section className="account-grid">
        {PLATFORMS.map((platform) => {
          const isConnected = connected[platform.key]
          return (
            <article className="account-card" key={platform.key}>
              <div className="account-card-head">
                <PlatformIcon platform={platform.key} size={40} />
                <StatusPill status={isConnected ? 'Connected' : 'Not connected'} />
              </div>

              <h2>{platform.name}</h2>
              <p className="account-handle">{platform.handle}</p>
              <div className="account-meta">
                <small className="account-audience">{platform.audience}</small>
                <small className="account-note">{platform.roleNote}</small>
              </div>

              <div className="account-permission">
                <Icon name="check" size={14} />
                <span>
                  {isConnected
                    ? 'Publishing, Insights & Token active'
                    : 'OAuth authorization required'}
                </span>
              </div>

              <button
                className={`button ${isConnected ? 'button-outline' : 'button-primary'} full`}
                disabled={previewMode}
                title={previewMode ? 'Disabled in boss preview' : undefined}
                onClick={() => handleConnectAction(platform)}
              >
                {isConnected ? 'Disconnect Account' : 'Connect with OAuth'}
              </button>
            </article>
          )
        })}
      </section>

      <div className="account-footnote">
        <Icon name="lock" size={18} />
        <div>
          <strong>Enterprise Security Boundary</strong>
          <p>
            Connections utilize platform-authorized OAuth 2.0 bearer tokens stored in encrypted environment vaults.
            Teammates can draft and schedule content freely without ever needing access to your raw social credentials.
          </p>
        </div>
      </div>

      {/* Simulated OAuth Modal */}
      {connectingModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setConnectingModal(null)}
        >
          <div className="modal small-modal oauth-modal">
            <div className="oauth-header">
              <PlatformIcon platform={connectingModal.key} size={44} />
              <h3>Connect to {connectingModal.name}</h3>
              <p>Authorize House of Chix & Waffles Social Hub to manage content</p>
            </div>

            <div className="oauth-permissions-box">
              <span className="oauth-subhead">PERMISSIONS REQUESTED:</span>
              <ul>
                <li>✓ Read profile statistics & insights</li>
                <li>✓ Publish approved video, photo & stories</li>
                <li>✓ Respond to comments and customer tags</li>
              </ul>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setConnectingModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => handleConfirmOAuth(connectingModal.key)}
              >
                Authorize & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
