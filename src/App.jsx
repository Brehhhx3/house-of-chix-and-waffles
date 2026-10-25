import React, { useState, useEffect, useMemo } from 'react'
import { loadInitialState, saveStateToStorage, resetAllStorage } from './utils/storage'
import { TRANSLATIONS } from './utils/translations'
import { Icon } from './components/common/Icon'
import { ToastContainer } from './components/common/Toast'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'

// Views
import { OverviewView } from './components/views/OverviewView'
import { CalendarView } from './components/views/CalendarView'
import { MediaView } from './components/views/MediaView'
import { ApprovalsView } from './components/views/ApprovalsView'
import { PublishedView } from './components/views/PublishedView'
import { AnalyticsView } from './components/views/AnalyticsView'
import { HouseRewardsView } from './components/views/HouseRewardsView'
import { TeamView } from './components/views/TeamView'
import { AccountsView } from './components/views/AccountsView'
import { ToastView } from './components/views/ToastView'

// Modals
import { PostModal } from './components/modals/PostModal'
import { TeamModal } from './components/modals/TeamModal'
import { MemberModal } from './components/modals/MemberModal'
import { RuleModal } from './components/modals/RuleModal'
import { SearchModal } from './components/modals/SearchModal'

export function App() {
  const [state, setState] = useState(() => loadInitialState())
  const [activeView, setActiveView] = useState('overview')
  const [selectedPostId, setSelectedPostId] = useState(1)
  const [platformFilter, setPlatformFilter] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [goldenWaffleActive, setGoldenWaffleActive] = useState(false)

  // Modals
  const [postModal, setPostModal] = useState({ isOpen: false, initial: null })
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [ruleModalOpen, setRuleModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  // Floating Toasts
  const [toasts, setToasts] = useState([])

  // Boss Preview Mode (from query param ?preview=1 or profile toggle)
  const [previewMode, setPreviewMode] = useState(() => {
    return new URLSearchParams(window.location.search).get('preview') === '1'
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStateToStorage(state)
  }, [state])

  // Helper to trigger floating toast alerts
  function addToast({ title, message, type = 'success' }) {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, title, message, type }])
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 4000)
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((t) => t.id !== id))
  }

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setPostModal({ isOpen: false, initial: null })
        setTeamModalOpen(false)
        setMemberModalOpen(false)
        setRuleModalOpen(false)
        setSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const t = TRANSLATIONS[state.language] || TRANSLATIONS.en

  // Selected post for preview
  const selectedPost = useMemo(() => {
    return state.posts.find((p) => p.id === selectedPostId) || state.posts[0]
  }, [state.posts, selectedPostId])

  // Filtered posts for overview queue
  const filteredPosts = useMemo(() => {
    if (platformFilter === 'all') return state.posts
    return state.posts.filter((p) => p.platforms.includes(platformFilter))
  }, [state.posts, platformFilter])

  // Navigation handler
  function handleNavigate(view) {
    setActiveView(view)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // POST ACTIONS
  function handleSavePost(post) {
    const isNew = !state.posts.some((p) => p.id === post.id)
    if (isNew) {
      setState((s) => ({
        ...s,
        posts: [post, ...s.posts],
        activity: [
          {
            person: s.team.find((m) => m.role.includes('Owner'))?.name || 'Jasmine Carter',
            text: `Created draft "${post.title}"`,
            when: 'Just now',
            kind: 'approved',
            initial: 'J',
          },
          ...s.activity,
        ],
      }))
      setSelectedPostId(post.id)
      addToast({
        title: 'Post Created',
        message: `"${post.title}" saved to content queue.`,
        type: 'success',
      })
    } else {
      setState((s) => ({
        ...s,
        posts: s.posts.map((p) => (p.id === post.id ? post : p)),
      }))
      addToast({
        title: 'Post Updated',
        message: `Changes to "${post.title}" saved.`,
        type: 'info',
      })
    }
    setPostModal({ isOpen: false, initial: null })
  }

  function handleDeletePost(postId) {
    setState((s) => ({
      ...s,
      posts: s.posts.filter((p) => p.id !== postId),
    }))
    setPostModal({ isOpen: false, initial: null })
    addToast({
      title: 'Post Deleted',
      message: 'Post removed from publishing schedule.',
      type: 'warning',
    })
  }

  function handlePublishPost(post) {
    const updated = { ...post, status: 'Published' }
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => (p.id === post.id ? updated : p)),
      activity: [
        {
          person: 'Jasmine Carter',
          text: `Published "${post.title}" to ${post.platforms.join(', ')}`,
          when: 'Just now',
          kind: 'approved',
          initial: 'J',
        },
        ...s.activity,
      ],
    }))
    addToast({
      title: 'Post Published Live! 🚀',
      message: `"${post.title}" was published across feeds.`,
      type: 'success',
    })
  }

  function handleApprovePost(post) {
    const updated = { ...post, status: 'Ready to publish' }
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => (p.id === post.id ? updated : p)),
      activity: [
        {
          person: 'Darnell King',
          text: `Approved "${post.title}"`,
          when: 'Just now',
          kind: 'approved',
          initial: 'D',
        },
        ...s.activity,
      ],
    }))
    addToast({
      title: 'Post Approved',
      message: `"${post.title}" is ready to publish.`,
      type: 'success',
    })
  }

  function handleRequestChanges(post, note) {
    const updated = { ...post, status: 'Changes requested', feedback: note }
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => (p.id === post.id ? updated : p)),
      activity: [
        {
          person: 'Darnell King',
          text: `Requested adjustments on "${post.title}": ${note}`,
          when: 'Just now',
          kind: 'review',
          initial: 'D',
        },
        ...s.activity,
      ],
    }))
    addToast({
      title: 'Changes Requested',
      message: 'Creator will be notified to adjust the draft.',
      type: 'warning',
    })
  }

  // MEDIA ACTIONS
  function handleAddMedia(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const image = URL.createObjectURL(file)
    const isVideo = file.type.startsWith('video')

    const newMedia = {
      id: Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      category: isVideo ? 'Behind the scenes' : 'Food',
      type: isVideo ? 'Uploaded video · 9:16' : 'Uploaded image · High-Res',
      image,
      dimensions: isVideo ? '1080 × 1920 (9:16)' : 'Original',
      tags: ['upload', isVideo ? 'video' : 'photo'],
      uploaded: 'Just now',
    }

    setState((s) => ({
      ...s,
      media: [newMedia, ...s.media],
    }))

    addToast({
      title: 'Media Uploaded',
      message: `${file.name} added to your library.`,
      type: 'success',
    })
  }

  function handleDeleteMedia(mediaId) {
    setState((s) => ({
      ...s,
      media: s.media.filter((m) => m.id !== mediaId),
    }))
    addToast({
      title: 'Media Removed',
      message: 'Asset removed from library.',
      type: 'warning',
    })
  }

  function handleUseMediaInPost(mediaItem) {
    setPostModal({
      isOpen: true,
      initial: {
        title: mediaItem.name,
        category: mediaItem.category.toLowerCase().includes('behind') ? 'bts' : 'food',
        image: mediaItem.image,
        platforms: ['instagram', 'facebook'],
      },
    })
  }

  // LOYALTY & MEMBER ACTIONS
  function handleSaveMember(member) {
    const isNew = !state.members.some((m) => m.id === member.id)
    if (isNew) {
      setState((s) => ({
        ...s,
        members: [member, ...s.members],
        activity: [
          {
            person: 'Marcus Vance',
            text: `Enrolled new regular: ${member.name}`,
            when: 'Just now',
            kind: 'approved',
            initial: 'M',
          },
          ...s.activity,
        ],
      }))
      addToast({
        title: 'New Member Enrolled',
        message: `${member.name} registered for House Rewards!`,
        type: 'success',
      })
    } else {
      setState((s) => ({
        ...s,
        members: s.members.map((m) => (m.id === member.id ? member : m)),
      }))
      addToast({
        title: 'Member Profile Updated',
        message: `${member.name}'s punch card balance saved.`,
        type: 'info',
      })
    }
    setMemberModalOpen(false)
  }

  function handleActivateGoldenWaffleDay() {
    const nextState = !goldenWaffleActive
    setGoldenWaffleActive(nextState)

    if (nextState) {
      // Auto-schedule announcement draft for today
      const goldenDraft = {
        id: Date.now(),
        title: '🌟 Golden Waffle Day: Double Stamps Active Today!',
        category: 'specials',
        type: 'Graphic · Stories',
        date: 'Today',
        time: 'Immediate',
        platforms: ['instagram', 'facebook'],
        status: 'Ready to publish',
        image: './assets/food-platter.png',
        owner: 'Jasmine Carter',
        caption: 'GOLDEN WAFFLE DAY IS LIVE! 🌟 Earn 2x stamps on every qualifying entree today only. Hit your 6-stamp reward twice as fast! Ask Marcus at the register.',
        platformCaptions: {
          facebook: '🌟 DOUBLE STAMP ALERT: Today is Golden Waffle Day at House of Chicken & Waffles! Earn 2 stamps per entree instead of 1.',
          instagram: 'DOUBLE STAMPS ACTIVE TODAY! 🧇✨ Visit us in Providence and unlock your free waffle reward twice as fast. Link in bio!',
          tiktok: 'Golden Waffle Day is here! Double stamps all day in Providence RI 🏃💨',
          google: 'Special Event: Double loyalty stamps on all dine-in and takeout orders today at House of Chicken & Waffles.',
        },
      }

      setState((s) => ({
        ...s,
        posts: [goldenDraft, ...s.posts],
        activity: [
          {
            person: 'Jasmine Carter',
            text: 'Triggered Golden Waffle Day (Double Stamps) and created announcement draft',
            when: 'Just now',
            kind: 'approved',
            initial: 'J',
          },
          ...s.activity,
        ],
      }))

      addToast({
        title: '🌟 Golden Waffle Day Activated!',
        message: '2x stamp mode is ON & announcement draft is ready to publish.',
        type: 'success',
      })
    } else {
      addToast({
        title: 'Golden Waffle Day Ended',
        message: 'Normal 1-stamp schedule restored.',
        type: 'info',
      })
    }
  }

  // TOAST POS ACTIONS
  function handleSimulateIncomingOrder() {
    const randomMember = state.members[Math.floor(Math.random() * state.members.length)]
    const newLogId = `chk-${Math.floor(4100 + Math.random() * 900)}`
    const isDouble = goldenWaffleActive
    const stampAdd = isDouble ? 2 : 1
    const nextStamps = Math.min(6, randomMember.stamps + stampAdd)

    const updatedMember = {
      ...randomMember,
      stamps: nextStamps,
      totalVisits: (randomMember.totalVisits || 0) + 1,
      lastVisit: 'Just now',
      nextReward: nextStamps >= 6 ? 'REWARD READY: Free Classic Waffle!' : `${6 - nextStamps} more stamps to free waffle`,
    }

    const newLog = {
      id: newLogId,
      timestamp: 'Just now',
      type: 'CHECK_CLOSED',
      table: 'Register 1',
      amount: '$24.50',
      guest: `${randomMember.name} (${randomMember.phone})`,
      action: `${stampAdd} stamp${stampAdd > 1 ? 's' : ''} added (now ${nextStamps}/6)`,
      status: 'SUCCESS',
    }

    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === randomMember.id ? updatedMember : m)),
      toastLogs: [newLog, ...s.toastLogs.slice(0, 15)],
      activity: [
        {
          person: 'Toast POS Webhook',
          text: `Processed ${newLogId}: awarded ${stampAdd} stamp(s) to ${randomMember.name}`,
          when: 'Just now',
          kind: 'approved',
          initial: 'T',
        },
        ...s.activity,
      ],
    }))

    addToast({
      title: 'Toast POS Sync: Check Closed',
      message: `${stampAdd} stamp(s) awarded to ${randomMember.name} (${newLogId})`,
      type: 'success',
    })
  }

  function handleApplyRewardAndCloseCheck({ member, itemName, originalPrice, discount, finalTotal, rewardWasRedeemed }) {
    const isFullReward = rewardWasRedeemed && member.stamps >= 6
    const nextStamps = rewardWasRedeemed ? (isFullReward ? 0 : member.stamps - 3) : Math.min(6, member.stamps + 1)
    const newLogId = `chk-${Math.floor(4100 + Math.random() * 900)}`

    const updatedMember = {
      ...member,
      stamps: nextStamps,
      rewardsRedeemed: rewardWasRedeemed ? (member.rewardsRedeemed || 0) + 1 : member.rewardsRedeemed,
      totalVisits: (member.totalVisits || 0) + 1,
      lastVisit: 'Just now at register',
      nextReward: nextStamps >= 6 ? 'REWARD READY: Free Classic Waffle!' : `${6 - nextStamps} stamps to free waffle`,
    }

    const newLog = {
      id: newLogId,
      timestamp: 'Just now',
      type: rewardWasRedeemed ? 'REWARD_APPLIED_AND_CLOSED' : 'CHECK_CLOSED',
      table: 'Terminal 01',
      amount: `$${finalTotal.toFixed(2)} ${discount > 0 ? `(-$${discount.toFixed(2)} perk)` : ''}`,
      guest: `${member.name} (${member.phone})`,
      action: rewardWasRedeemed ? 'Redeemed reward & updated card' : '+1 stamp posted to guest balance',
      status: 'SUCCESS',
    }

    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === member.id ? updatedMember : m)),
      toastLogs: [newLog, ...s.toastLogs.slice(0, 15)],
      activity: [
        {
          person: 'Marcus Vance',
          text: `Completed checkout for ${member.name} ($${finalTotal.toFixed(2)})`,
          when: 'Just now',
          kind: 'approved',
          initial: 'M',
        },
        ...s.activity,
      ],
    }))

    addToast({
      title: 'Toast Checkout Complete! 🧾',
      message: `${member.name}'s receipt closed ($${finalTotal.toFixed(2)}) & loyalty updated.`,
      type: 'success',
    })
  }

  // TEAM ACTIONS
  function handleAddTeamMember(newMember) {
    setState((s) => ({
      ...s,
      team: [...s.team, newMember],
    }))
    setTeamModalOpen(false)
    addToast({
      title: 'Invitation Sent',
      message: `Workspace invite dispatched to ${newMember.email}.`,
      type: 'success',
    })
  }

  function handleDeleteTeamMember(memberId) {
    setState((s) => ({
      ...s,
      team: s.team.filter((m) => m.id !== memberId),
    }))
    addToast({
      title: 'Access Revoked',
      message: 'Teammate removed from workspace.',
      type: 'warning',
    })
  }

  // CONNECTED ACCOUNTS ACTIONS
  function handleToggleConnection(platformKey) {
    setState((s) => ({
      ...s,
      connected: {
        ...s.connected,
        [platformKey]: !s.connected[platformKey],
      },
    }))
    addToast({
      title: state.connected[platformKey] ? 'Account Disconnected' : 'Account Connected via OAuth',
      message: `${platformKey.toUpperCase()} integration status updated.`,
      type: 'info',
    })
  }

  // RULES ACTIONS
  function handleSaveRules(newRules) {
    setState((s) => ({ ...s, rules: newRules }))
    setRuleModalOpen(false)
    addToast({
      title: 'Guardrails Saved',
      message: 'House Rewards rules updated.',
      type: 'success',
    })
  }

  // LANGUAGE TOGGLE
  function handleToggleLanguage() {
    const nextLang = state.language === 'en' ? 'es' : 'en'
    setState((s) => ({ ...s, language: nextLang }))
    addToast({
      title: nextLang === 'es' ? 'Idioma: Español' : 'Language: English',
      message: nextLang === 'es' ? 'Interfaz traducida al español.' : 'Interface updated to English.',
      type: 'info',
    })
  }

  // RESET
  function handleResetData() {
    resetAllStorage()
    setState(loadInitialState())
    addToast({
      title: 'Workspace Reset',
      message: 'Default sample data restored.',
      type: 'warning',
    })
  }

  const pendingApprovalsCount = state.posts.filter((p) => p.status === 'Needs review').length
  const publishedCount = state.posts.filter((p) => p.status === 'Published').length

  return (
    <div className={`app-shell ${previewMode ? 'preview-mode' : ''}`}>
      {/* Toast Alert Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        approvalsCount={pendingApprovalsCount}
        publishedCount={publishedCount}
        language={state.language}
        t={t}
      />

      {/* Main Content Area */}
      <main className="main-area">
        {/* Boss Preview Banner */}
        {previewMode && (
          <div className="preview-banner" role="status">
            <Icon name="lock" size={15} />
            <strong>{t.previewModeBanner}</strong>
            <span>{t.previewModeDesc}</span>
          </div>
        )}

        {/* Golden Waffle Day Urgency Ribbon */}
        {goldenWaffleActive && (
          <div className="golden-day-banner">
            <span className="banner-star">🌟</span>
            <strong>GOLDEN WAFFLE DAY IS LIVE!</strong>
            <span>Every entree earns DOUBLE loyalty stamps today in Providence.</span>
            <button
              className="banner-action-btn"
              onClick={() => handleNavigate('club')}
            >
              View Rewards
            </button>
          </div>
        )}

        {/* Top Header */}
        <Header
          previewMode={previewMode}
          language={state.language}
          onToggleLanguage={handleToggleLanguage}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          activeUser={state.activeUser}
          onChangeUser={(uid) => setState((s) => ({ ...s, activeUser: uid }))}
          onTogglePreview={() => setPreviewMode((m) => !m)}
          activity={state.activity}
          onResetData={handleResetData}
        />

        {/* View Containers */}
        <div className="content-wrap">
          {activeView === 'overview' && (
            <OverviewView
              posts={filteredPosts}
              allPosts={state.posts}
              selectedPost={selectedPost}
              selectedPostId={selectedPostId}
              onSelectPost={setSelectedPostId}
              platformFilter={platformFilter}
              setPlatformFilter={setPlatformFilter}
              activity={state.activity}
              connected={state.connected}
              onOpenCreatePost={() => setPostModal({ isOpen: true, initial: null })}
              onOpenEditPost={(post) => setPostModal({ isOpen: true, initial: post })}
              onPublishPost={handlePublishPost}
              onNavigate={handleNavigate}
              previewMode={previewMode}
              membersCount={state.members.length + 1245}
              t={t}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              posts={state.posts}
              onOpenCreatePost={(seed) => setPostModal({ isOpen: true, initial: seed || null })}
              onOpenEditPost={(post) => setPostModal({ isOpen: true, initial: post })}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'media' && (
            <MediaView
              media={state.media}
              onAddMedia={handleAddMedia}
              onUseInPost={handleUseMediaInPost}
              onDeleteMedia={handleDeleteMedia}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'approvals' && (
            <ApprovalsView
              posts={state.posts}
              onApprovePost={handleApprovePost}
              onRequestChanges={handleRequestChanges}
              onPublishPost={handlePublishPost}
              onOpenEditPost={(post) => setPostModal({ isOpen: true, initial: post })}
              onOpenCreatePost={() => setPostModal({ isOpen: true, initial: null })}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'published' && (
            <PublishedView
              posts={state.posts}
              onRepost={(post) =>
                setPostModal({
                  isOpen: true,
                  initial: { ...post, id: null, status: 'Needs review', date: 'Today' },
                })
              }
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'analytics' && <AnalyticsView t={t} />}

          {activeView === 'club' && (
            <HouseRewardsView
              members={state.members}
              rules={state.rules}
              onAddMember={handleSaveMember}
              onUpdateMember={handleSaveMember}
              onOpenAddMemberModal={() => setMemberModalOpen(true)}
              onOpenRuleModal={() => setRuleModalOpen(true)}
              onActivateGoldenWaffleDay={handleActivateGoldenWaffleDay}
              goldenWaffleActive={goldenWaffleActive}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'team' && (
            <TeamView
              team={state.team}
              onOpenInviteModal={() => setTeamModalOpen(true)}
              onDeleteMember={handleDeleteTeamMember}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'accounts' && (
            <AccountsView
              connected={state.connected}
              onToggleConnection={handleToggleConnection}
              previewMode={previewMode}
              t={t}
            />
          )}

          {activeView === 'toast' && (
            <ToastView
              members={state.members}
              toastLogs={state.toastLogs}
              onSimulateOrder={handleSimulateIncomingOrder}
              onApplyRewardAndCloseCheck={handleApplyRewardAndCloseCheck}
              previewMode={previewMode}
              t={t}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[
          ['overview', 'Overview', 'home'],
          ['calendar', 'Calendar', 'calendar'],
          ['media', 'Media', 'image'],
          ['approvals', 'Approvals', 'file'],
          ['more', 'More', 'dots'],
        ].map(([id, label, icon]) => (
          <button
            key={id}
            className={activeView === id ? 'active' : ''}
            onClick={() => (id === 'more' ? setMenuOpen(true) : handleNavigate(id))}
          >
            <Icon name={icon} size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* MODALS */}
      {!previewMode && postModal.isOpen && (
        <PostModal
          initial={postModal.initial}
          mediaLibrary={state.media}
          onClose={() => setPostModal({ isOpen: false, initial: null })}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
        />
      )}

      {!previewMode && teamModalOpen && (
        <TeamModal
          onClose={() => setTeamModalOpen(false)}
          onSave={handleAddTeamMember}
        />
      )}

      {!previewMode && memberModalOpen && (
        <MemberModal
          onClose={() => setMemberModalOpen(false)}
          onSave={handleSaveMember}
        />
      )}

      {!previewMode && ruleModalOpen && (
        <RuleModal
          initialRules={state.rules}
          onClose={() => setRuleModalOpen(false)}
          onSave={handleSaveRules}
        />
      )}

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        posts={state.posts}
        media={state.media}
        members={state.members}
        team={state.team}
        onSelectPost={(post) => {
          setSelectedPostId(post.id)
          handleNavigate('overview')
        }}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
