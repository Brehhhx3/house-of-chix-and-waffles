import React, { useState } from 'react'
import { Icon } from '../common/Icon'
import { PlatformIcon } from '../common/PlatformBadge'
import { PLATFORMS, CONTENT_CATEGORIES, AI_PRESETS, WEEKLY_CADENCE } from '../../constants/data'
import { generatePlatformCopy } from '../../utils/aiGenerator'

export function PostModal({
  initial,
  mediaLibrary = [],
  onClose,
  onSave,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState('compose') // compose | ai | preview
  const [title, setTitle] = useState(initial?.title || '')
  const [category, setCategory] = useState(initial?.category || 'food')
  const [platforms, setPlatforms] = useState(
    initial?.platforms || ['facebook', 'instagram']
  )
  const [format, setFormat] = useState(
    initial?.type?.split(' · ')[0] || 'Photo'
  )
  const [date, setDate] = useState(initial?.date || 'Today')
  const [time, setTime] = useState(initial?.time || '10:00 AM')
  const [status, setStatus] = useState(initial?.status || 'Needs review')
  const [image, setImage] = useState(initial?.image || '/assets/food-platter.png')
  const [owner, setOwner] = useState(initial?.owner || 'Jasmine Carter')

  // Platform specific captions
  const [captions, setCaptions] = useState(
    initial?.platformCaptions || {
      facebook: initial?.caption || 'Crispy chicken & golden waffles in Providence! Tag a friend 👇',
      instagram: initial?.caption || 'Crispy chicken. Fresh waffle. Providence, this is your sign. ✨ #ProvidenceEats',
      tiktok: 'POV: You found the crunchiest chicken and waffle spot in Rhode Island 🤤🧇',
      google: 'Fresh chicken and waffles made to order in Providence, RI. Order online or visit us today!',
    }
  )

  const [aiPrompt, setAiPrompt] = useState('')
  const [activeCaptionTab, setActiveCaptionTab] = useState(platforms[0] || 'instagram')
  const [validationError, setValidationError] = useState('')

  // Toggle platform
  function togglePlatform(key) {
    setPlatforms((current) =>
      current.includes(key)
        ? current.length > 1
          ? current.filter((k) => k !== key)
          : current
        : [...current, key]
    )
  }

  // Handle AI Auto-generation
  function handleGenerateAI(preset = null) {
    const textToUse = preset ? preset.hook : aiPrompt || title || 'Crispy chicken and waffles'
    const catToUse = preset ? preset.category : category

    const result = generatePlatformCopy({
      title: title || preset?.name || 'House Special',
      promptText: textToUse,
      category: catToUse,
      dayOfWeek: date === 'Today' ? 'Monday' : date,
    })

    setCaptions(result.platformCaptions)
    if (!title && preset) {
      setTitle(preset.name.replace(/^[^\s]+\s/, ''))
    }
    setActiveTab('compose')
  }

  // Apply cadence suggestion
  function applyCadenceSuggestion(dayName) {
    const match = WEEKLY_CADENCE.find((c) => c.day === dayName)
    if (match) {
      setTime(match.time)
      if (!platforms.includes(match.bestPlatform)) {
        setPlatforms((p) => [...p, match.bestPlatform])
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setValidationError('Please give this post a title.')
      return
    }

    const payload = {
      ...(initial || { id: Date.now() }),
      title: title.trim(),
      category,
      platforms,
      type: `${format} · ${platforms.includes('tiktok') ? 'Reel/TikTok' : 'Feed'}`,
      date,
      time,
      status,
      image,
      owner,
      caption: captions[platforms[0]] || captions.instagram || '',
      platformCaptions: captions,
    }

    onSave(payload)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal post-modal-wide">
        {/* Modal Header */}
        <div className="modal-head">
          <div>
            <span className="section-kicker">CONTENT STUDIO</span>
            <h2>{initial ? 'Edit post & captions' : 'Create new post'}</h2>
            <p>One restaurant capture, tailored for all 4 social platforms.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tab-nav">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => setActiveTab('compose')}
          >
            <Icon name="edit" size={15} />
            <span>Compose & Media</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Icon name="spark" size={15} />
            <span>⚡ AI Social Copywriter</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Icon name="image" size={15} />
            <span>Platform Mockup</span>
          </button>
        </div>

        {validationError && (
          <div className="form-error-banner">
            <Icon name="close" size={14} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TAB 1: COMPOSE */}
          {activeTab === 'compose' && (
            <div className="modal-scroll-body">
              <label>
                Post Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setValidationError('')
                  }}
                  placeholder="e.g. Saturday Hot Honey Crispy Special"
                  autoFocus
                />
              </label>

              <div className="form-row">
                <label>
                  Content Category (from 90-Day Plan)
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CONTENT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Format
                  <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="Photo">High-Res Photo</option>
                    <option value="Video">Vertical Video (9:16)</option>
                    <option value="Carousel">Photo Carousel</option>
                    <option value="Graphic">Announcement Graphic</option>
                  </select>
                </label>
              </div>

              {/* Target Platforms */}
              <div className="platform-picker-section">
                <span className="picker-label">Target Platforms</span>
                <div className="platform-chips">
                  {PLATFORMS.map((p) => {
                    const isChecked = platforms.includes(p.key)
                    return (
                      <button
                        type="button"
                        key={p.key}
                        className={`platform-chip ${isChecked ? 'selected' : ''}`}
                        onClick={() => togglePlatform(p.key)}
                      >
                        <PlatformIcon platform={p.key} size={20} />
                        <span>{p.name}</span>
                        {isChecked && <Icon name="check" size={14} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Media Picker */}
              <div className="media-selector-group">
                <span className="picker-label">Select Media Asset</span>
                <div className="media-thumb-strip">
                  {mediaLibrary.map((m) => (
                    <div
                      key={m.id}
                      className={`media-select-card ${image === m.image ? 'selected' : ''}`}
                      onClick={() => setImage(m.image)}
                    >
                      <img src={m.image} alt={m.name} />
                      <span className="thumb-title">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Specific Captions Editor */}
              <div className="caption-editor-section">
                <div className="caption-tab-row">
                  <span className="editor-subhead">Tailored Captions:</span>
                  <div className="subtab-buttons">
                    {platforms.map((p) => (
                      <button
                        type="button"
                        key={p}
                        className={`subtab-btn ${activeCaptionTab === p ? 'active' : ''}`}
                        onClick={() => setActiveCaptionTab(p)}
                      >
                        <PlatformIcon platform={p} size={15} />
                        <span>{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="caption-box">
                  <textarea
                    rows={4}
                    value={captions[activeCaptionTab] || ''}
                    onChange={(e) =>
                      setCaptions({
                        ...captions,
                        [activeCaptionTab]: e.target.value,
                      })
                    }
                    placeholder={`Write tailored caption for ${activeCaptionTab}...`}
                  />
                  <div className="caption-foot">
                    <small>
                      {captions[activeCaptionTab]?.length || 0} characters
                    </small>
                    <button
                      type="button"
                      className="text-link-btn"
                      onClick={() => handleGenerateAI()}
                    >
                      <Icon name="spark" size={13} /> Re-generate with AI
                    </button>
                  </div>
                </div>
              </div>

              {/* Scheduling and Status */}
              <div className="form-row-3">
                <label>
                  Publish Date
                  <select
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                      applyCadenceSuggestion(e.target.value)
                    }}
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Monday">Monday (Food Focus)</option>
                    <option value="Tuesday">Tuesday (Kitchen BTS)</option>
                    <option value="Wednesday">Wednesday (Crew Feature)</option>
                    <option value="Thursday">Thursday (Menu Highlight)</option>
                    <option value="Friday">Friday (Boss Reel)</option>
                    <option value="Saturday">Saturday (Brunch Vibe)</option>
                    <option value="Sunday">Sunday (Community)</option>
                  </select>
                </label>

                <label>
                  Time
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 5:30 PM"
                  />
                </label>

                <label>
                  Workflow Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Needs review">Needs review</option>
                    <option value="Ready to publish">Ready to publish</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: AI COPYWRITER */}
          {activeTab === 'ai' && (
            <div className="modal-scroll-body ai-suite-body">
              <div className="ai-intro-banner">
                <div className="ai-icon-bubble">
                  <Icon name="spark" size={24} />
                </div>
                <div>
                  <strong>Automatic Platform Adapter</strong>
                  <p>
                    Applies the exact rules from your Social Media Game Plan:
                    Facebook gets conversation, Instagram gets aesthetics,
                    TikTok gets curiosity hooks, and Google gets local search CTAs.
                  </p>
                </div>
              </div>

              <div className="ai-presets-block">
                <span className="picker-label">Quick Concept Starters</span>
                <div className="preset-grid">
                  {AI_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      className="preset-card-btn"
                      onClick={() => handleGenerateAI(preset)}
                    >
                      <strong>{preset.name}</strong>
                      <p>{preset.hook}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-ai-prompt-area">
                <label>
                  Or enter your own dish / event description:
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Red velvet waffle with fried chicken wings and cream cheese maple glaze..."
                  />
                </label>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => handleGenerateAI()}
                >
                  <Icon name="spark" size={16} />
                  <span>Generate Platform-Tailored Copy</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MOCKUP PREVIEW */}
          {activeTab === 'preview' && (
            <div className="modal-scroll-body preview-scroll-body">
              <div className="preview-selector-strip">
                {platforms.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`preview-chip ${activeCaptionTab === p ? 'active' : ''}`}
                    onClick={() => setActiveCaptionTab(p)}
                  >
                    <PlatformIcon platform={p} size={16} />
                    <span>{p}</span>
                  </button>
                ))}
              </div>

              <div className="mockup-centered-wrap">
                <div className="simple-mockup-card">
                  <div className="mockup-img-holder">
                    <img src={image} alt={title} />
                  </div>
                  <div className="mockup-text-holder">
                    <span className="mockup-plat-tag">
                      <PlatformIcon platform={activeCaptionTab} size={16} />
                      <strong>{activeCaptionTab.toUpperCase()} PREVIEW</strong>
                    </span>
                    <p className="mockup-caption-text">
                      {captions[activeCaptionTab] || captions.instagram}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-actions-bar">
            {initial && onDelete && (
              <button
                type="button"
                className="button button-danger"
                onClick={() => onDelete(initial.id)}
              >
                <Icon name="trash" size={15} /> Delete
              </button>
            )}
            <div className="spacer" />
            <button
              type="button"
              className="button button-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              <Icon name="check" size={15} />
              {initial ? 'Save changes' : 'Create post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
