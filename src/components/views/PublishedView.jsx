import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { StatusPill } from '../common/StatusBadge'

export function PublishedView({ posts, onRepost, previewMode, t }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const publishedPosts = posts.filter((p) => p.status === 'Published')

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.publishedNav}</h1>
          <p>A permanent record of live content, engagement metrics, and past promotions.</p>
        </div>
      </div>

      <section className="panel empty-page">
        {publishedPosts.length > 0 ? (
          publishedPosts.map((post) => (
            <div className="approval-row published-row" key={post.id}>
              <img src={post.image} alt="" className="approval-row-img" />

              <div className="approval-row-content">
                <strong>{post.title}</strong>
                <small>{post.type} · Published by {post.owner || 'Jasmine'}</small>
                <div className="published-metrics-chips">
                  <span><Icon name="users" size={11} /> {post.metrics?.reach || '4.2K'} reach</span>
                  <span><Icon name="heart" size={11} /> {post.metrics?.likes || '180'} likes</span>
                  <span><Icon name="bookmark" size={11} /> {post.metrics?.saves || '42'} saves</span>
                </div>
              </div>

              <div className="approval-platforms">
                {post.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size={20} />
                ))}
              </div>

              <StatusPill status="Published" />

              <div className="approval-actions-cell">
                <button
                  className="button button-outline btn-sm"
                  onClick={() => setSelectedPost(post)}
                >
                  <Icon name="spark" size={12} />
                  <span>View Metrics</span>
                </button>
                <button
                  className="button button-outline btn-sm"
                  disabled={previewMode}
                  onClick={() => onRepost && onRepost(post)}
                  title="Reshare or duplicate draft"
                >
                  <Icon name="refresh" size={12} />
                  <span>Repost</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="send" size={28} />
            <span>Published posts will appear here once you approve and publish your first post.</span>
          </div>
        )}
      </section>

      {/* Post Performance Viewer Modal */}
      {selectedPost && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setSelectedPost(null)}
        >
          <div className="modal small-modal">
            <div className="modal-head">
              <div>
                <span className="section-kicker">POST PERFORMANCE</span>
                <h2>{selectedPost.title}</h2>
                <p>Live engagement signals across Providence feeds</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setSelectedPost(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="published-detail-card">
              <img src={selectedPost.image} alt="" />
              <div className="metric-grid-2x2">
                <div className="metric-card-mini">
                  <small>Total Reach</small>
                  <strong>{selectedPost.metrics?.reach || '12.4K'}</strong>
                </div>
                <div className="metric-card-mini">
                  <small>Saved by Customers</small>
                  <strong>{selectedPost.metrics?.saves || '482'}</strong>
                </div>
                <div className="metric-card-mini">
                  <small>Likes & Reactions</small>
                  <strong>{selectedPost.metrics?.likes || '620'}</strong>
                </div>
                <div className="metric-card-mini">
                  <small>Comments & Tags</small>
                  <strong>{selectedPost.metrics?.comments || '48'}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => setSelectedPost(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
