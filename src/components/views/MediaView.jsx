import React, { useState } from 'react'
import { Icon } from '../common/Icon'

export function MediaView({
  media,
  onAddMedia,
  onUseInPost,
  onDeleteMedia,
  previewMode,
  t,
}) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)

  const categories = [
    'All',
    'Food',
    'Behind the scenes',
    'Staff & personality',
    'Customers & community',
    'Branding',
  ]

  const filteredMedia = media.filter((item) => {
    const matchCat =
      activeCategory === 'All' ||
      item.category.toLowerCase().includes(activeCategory.toLowerCase())
    const q = searchQuery.toLowerCase().trim()
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    return matchCat && matchQuery
  })

  return (
    <>
      <div className="page-heading compact">
        <div>
          <h1>{t.media}</h1>
          <p>
            Reusable food, staff, and behind-the-scenes content ready to post.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            disabled={previewMode}
            title={previewMode ? 'Disabled in boss preview' : undefined}
            onClick={() => document.getElementById('media-upload-input')?.click()}
          >
            <Icon name="upload" size={16} />
            <span>Upload New Media</span>
          </button>
          <input
            id="media-upload-input"
            className="visually-hidden"
            type="file"
            accept="image/*,video/*"
            onChange={onAddMedia}
          />
        </div>
      </div>

      {/* Media Toolbar */}
      <div className="media-toolbar">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? 'selected' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="media-search-box">
          <Icon name="search" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags or filenames..."
          />
          {searchQuery && (
            <button
              className="text-button"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      <section className="media-grid">
        {filteredMedia.map((item) => (
          <article className="media-card" key={item.id}>
            <div
              className="media-image"
              onClick={() => setSelectedAsset(item)}
              role="button"
              tabIndex={0}
            >
              <img src={item.image} alt={item.name} />
              <button
                className="media-more"
                disabled={previewMode}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedAsset(item)
                }}
                aria-label="View media details"
              >
                <Icon name="dots" size={16} />
              </button>
              <span className="media-type-tag">
                {item.type.includes('Video') ? 'VIDEO' : 'PHOTO'}
              </span>
            </div>

            <div className="media-card-copy">
              <strong>{item.name}</strong>
              <small>{item.type}</small>
              <div className="media-card-actions">
                <button
                  className="text-button"
                  disabled={previewMode}
                  onClick={() => onUseInPost(item)}
                >
                  <Icon name="plus" size={13} />
                  <span>Use in post</span>
                </button>
                <span className="media-dim-label">
                  {item.dimensions || 'High-Res'}
                </span>
              </div>
            </div>
          </article>
        ))}

        {filteredMedia.length === 0 && (
          <div className="empty-state grid-full-span">
            <Icon name="image" size={32} />
            <p>No media found for "{searchQuery || activeCategory}"</p>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedAsset && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setSelectedAsset(null)}
        >
          <div className="modal media-detail-modal">
            <div className="modal-head">
              <div>
                <span className="section-kicker">ASSET DETAILS</span>
                <h2>{selectedAsset.name}</h2>
                <p>{selectedAsset.type}</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedAsset(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="media-detail-preview">
              <img src={selectedAsset.image} alt={selectedAsset.name} />
            </div>

            <div className="media-detail-meta">
              <div>
                <strong>Dimensions:</strong> {selectedAsset.dimensions || 'Original High-Res'}
              </div>
              <div>
                <strong>Category:</strong> {selectedAsset.category}
              </div>
              <div>
                <strong>Uploaded:</strong> {selectedAsset.uploaded || 'Recently'}
              </div>
              {selectedAsset.tags && (
                <div className="detail-tags-row">
                  {selectedAsset.tags.map((t) => (
                    <span key={t} className="tag-chip">#{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {onDeleteMedia && (
                <button
                  type="button"
                  className="button button-danger"
                  disabled={previewMode}
                  onClick={() => {
                    onDeleteMedia(selectedAsset.id)
                    setSelectedAsset(null)
                  }}
                >
                  <Icon name="trash" size={14} /> Delete Asset
                </button>
              )}
              <div className="spacer" />
              <button
                type="button"
                className="button button-outline"
                onClick={() => setSelectedAsset(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="button button-primary"
                disabled={previewMode}
                onClick={() => {
                  onUseInPost(selectedAsset)
                  setSelectedAsset(null)
                }}
              >
                <Icon name="plus" size={14} />
                <span>Create Post with this Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
