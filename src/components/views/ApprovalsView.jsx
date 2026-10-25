import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'

export function ApprovalsView({
  posts,
  onApprovePost,
  onRequestChanges,
  onPublishPost,
  onOpenEditPost,
  onOpenCreatePost,
  previewMode,
  t,
}) {
  const [filter, setFilter] = useState('all') // all | review | ready | scheduled
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [feedbackNote, setFeedbackNote] = useState('')

  const reviewPosts = posts.filter((p) => {
    if (filter === 'all') {
      return p.status !== 'Published'
    }
    if (filter === 'review') return p.status === 'Needs review' || p.status === 'Changes requested'
    if (filter === 'ready') return p.status === 'Ready to publish'
    if (filter === 'scheduled') return p.status === 'Scheduled'
    return true
  })

  function handleSendFeedback(e) {
    e.preventDefault()
    if (!feedbackModal) return
    onRequestChanges(feedbackModal, feedbackNote || 'Please adjust caption and verify pricing.')
    setFeedbackModal(null)
    setFeedbackNote('')
  }

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.approvals}</h1>
          <p>Review content and verify pricing before anything reaches a customer’s feed.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={() => onOpenCreatePost()}
          >
            <Icon name="plus" size={16} />
            <span>Create Draft</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="approval-summary">
        <div onClick={() => setFilter('review')} role="button" tabIndex={0}>
          <span>Needs review</span>
          <strong>{posts.filter((p) => p.status === 'Needs review').length}</strong>
        </div>
        <div onClick={() => setFilter('ready')} role="button" tabIndex={0}>
          <span>Ready to publish</span>
          <strong>{posts.filter((p) => p.status === 'Ready to publish').length}</strong>
        </div>
        <div onClick={() => setFilter('scheduled')} role="button" tabIndex={0}>
          <span>Scheduled</span>
          <strong>{posts.filter((p) => p.status === 'Scheduled').length}</strong>
        </div>
      </div>

      {/* Review Queue Panel */}
      <section className="panel approval-table">
        <div className="panel-heading">
          <h2>
            <Icon name="file" size={18} />
            <span>Review Queue</span>
          </h2>
          <div className="filter-tabs">
            <button
              className={filter === 'all' ? 'selected' : ''}
              onClick={() => setFilter('all')}
            >
              All Pending ({posts.filter((p) => p.status !== 'Published').length})
            </button>
            <button
              className={filter === 'review' ? 'selected' : ''}
              onClick={() => setFilter('review')}
            >
              Needs Review
            </button>
            <button
              className={filter === 'ready' ? 'selected' : ''}
              onClick={() => setFilter('ready')}
            >
              Ready
            </button>
          </div>
        </div>

        {reviewPosts.length > 0 ? (
          reviewPosts.map((post) => (
            <div className="approval-row" key={post.id}>
              <img src={post.image} alt="" className="approval-row-img" />

              <div className="approval-row-content">
                <strong>{post.title}</strong>
                <small>
                  {post.type} · By {post.owner || 'Crew'} · Scheduled for{' '}
                  {post.date} at {post.time}
                </small>
                {post.feedback && (
                  <div className="row-feedback-alert">
                    <Icon name="clock" size={12} />
                    <span>Change note: {post.feedback}</span>
                  </div>
                )}
              </div>

              <div className="approval-platforms">
                {post.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size={20} />
                ))}
              </div>

              <StatusPill status={post.status} />

              <div className="approval-actions-cell">
                {post.status === 'Needs review' && (
                  <>
                    <button
                      className="button button-primary btn-sm"
                      disabled={previewMode}
                      onClick={() => onApprovePost(post)}
                      title="Approve for publishing"
                    >
                      <Icon name="check" size={13} />
                      <span>Approve</span>
                    </button>
                    <button
                      className="button button-outline btn-sm"
                      disabled={previewMode}
                      onClick={() => {
                        setFeedbackModal(post)
                        setFeedbackNote('')
                      }}
                      title="Request changes"
                    >
                      <span>Changes</span>
                    </button>
                  </>
                )}

                {post.status === 'Ready to publish' && (
                  <button
                    className="button button-primary btn-sm"
                    disabled={previewMode}
                    onClick={() => onPublishPost(post)}
                  >
                    <Icon name="send" size={13} />
                    <span>Publish Now</span>
                  </button>
                )}

                <button
                  className="button button-outline btn-sm"
                  disabled={previewMode}
                  onClick={() => onOpenEditPost(post)}
                >
                  <Icon name="edit" size={13} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="check" size={28} />
            <span>All approvals are cleared! No pending posts.</span>
          </div>
        )}
      </section>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setFeedbackModal(null)}
        >
          <form className="modal small-modal" onSubmit={handleSendFeedback}>
            <div className="modal-head">
              <div>
                <span className="section-kicker">APPROVAL WORKFLOW</span>
                <h2>Request Changes</h2>
                <p>Provide specific guidance to the content creator.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setFeedbackModal(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <label>
              Post: <strong>{feedbackModal.title}</strong>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="e.g. Please emphasize the secret sauce drizzle and verify dine-in vs delivery price."
                autoFocus
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setFeedbackModal(null)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Send Change Request
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
