import {
  SEED_POSTS,
  SEED_MEDIA,
  SEED_MEMBERS,
  SEED_TEAM,
  SEED_ACTIVITY,
  SEED_TOAST_LOGS,
  PLATFORMS,
} from '../constants/data'

const STORAGE_KEYS = {
  POSTS: 'hocw_posts_v2',
  MEDIA: 'hocw_media_v2',
  MEMBERS: 'hocw_members_v2',
  TEAM: 'hocw_team_v2',
  ACTIVITY: 'hocw_activity_v2',
  TOAST_LOGS: 'hocw_toast_logs_v2',
  CONNECTED: 'hocw_connected_v2',
  RULES: 'hocw_loyalty_rules_v2',
  LANGUAGE: 'hocw_language_v2',
  ACTIVE_USER: 'hocw_active_user_v2',
}

export const DEFAULT_RULES = {
  stampRequirement: '1 qualifying meal or entree',
  perk3Stamps: 'Free fountain drink or side add-on ($3.50 value)',
  reward6Stamps: 'Free Classic Waffle or $12 meal credit',
  goldenWaffleMultiplier: 2,
  allowDeliveryStamps: false,
  reviewIncentiveAllowed: false, // Explicitly forbidden per PDF guardrails!
}

function normalizeAssetPath(path) {
  if (typeof path !== 'string') return path
  if (path.startsWith('/assets/')) return '.' + path
  return path
}

function normalizeChicken(text) {
  if (typeof text !== 'string') return text
  return text
    .replace(/House of Chix & Waffles/gi, 'House of Chicken & Waffles')
    .replace(/House of Chix/gi, 'House of Chicken')
    .replace(/Chix & Waffles/gi, 'Chicken & Waffles')
    .replace(/@houseofchixandwaffles/gi, '@houseofchickenandwaffles')
    .replace(/houseofchix\.com/gi, 'houseofchicken.com')
}

export function loadInitialState() {
  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : fallback
    } catch {
      return fallback
    }
  }

  const initialConnected = Object.fromEntries(PLATFORMS.map((p) => [p.key, true]))

  const rawPosts = getStored(STORAGE_KEYS.POSTS, SEED_POSTS)
  const posts = Array.isArray(rawPosts)
    ? rawPosts.map((p) => ({
        ...p,
        title: normalizeChicken(p.title),
        caption: normalizeChicken(p.caption),
        image: normalizeAssetPath(p.image),
        platformCaptions: p.platformCaptions
          ? Object.fromEntries(
              Object.entries(p.platformCaptions).map(([k, v]) => [k, normalizeChicken(v)])
            )
          : undefined,
      }))
    : SEED_POSTS

  const rawMedia = getStored(STORAGE_KEYS.MEDIA, SEED_MEDIA)
  const media = Array.isArray(rawMedia)
    ? rawMedia.map((m) => ({
        ...m,
        name: normalizeChicken(m.name),
        image: normalizeAssetPath(m.image),
      }))
    : SEED_MEDIA

  const rawTeam = getStored(STORAGE_KEYS.TEAM, SEED_TEAM)
  const team = Array.isArray(rawTeam)
    ? rawTeam.map((t) => ({
        ...t,
        email: normalizeChicken(t.email),
      }))
    : SEED_TEAM

  return {
    posts,
    media,
    members: getStored(STORAGE_KEYS.MEMBERS, SEED_MEMBERS),
    team,
    activity: getStored(STORAGE_KEYS.ACTIVITY, SEED_ACTIVITY),
    toastLogs: getStored(STORAGE_KEYS.TOAST_LOGS, SEED_TOAST_LOGS),
    connected: getStored(STORAGE_KEYS.CONNECTED, initialConnected),
    rules: getStored(STORAGE_KEYS.RULES, DEFAULT_RULES),
    language: getStored(STORAGE_KEYS.LANGUAGE, 'en'),
    activeUser: getStored(STORAGE_KEYS.ACTIVE_USER, 'owner'),
  }
}

export function saveStateToStorage(state) {
  try {
    if (state.posts) localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(state.posts))
    if (state.media) localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(state.media))
    if (state.members) localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(state.members))
    if (state.team) localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(state.team))
    if (state.activity) localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(state.activity))
    if (state.toastLogs) localStorage.setItem(STORAGE_KEYS.TOAST_LOGS, JSON.stringify(state.toastLogs))
    if (state.connected) localStorage.setItem(STORAGE_KEYS.CONNECTED, JSON.stringify(state.connected))
    if (state.rules) localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(state.rules))
    if (state.language) localStorage.setItem(STORAGE_KEYS.LANGUAGE, JSON.stringify(state.language))
    if (state.activeUser) localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(state.activeUser))
  } catch (err) {
    console.warn('Could not save to localStorage:', err)
  }
}

export function resetAllStorage() {
  Object.values(STORAGE_KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k)
    } catch {}
  })
}
