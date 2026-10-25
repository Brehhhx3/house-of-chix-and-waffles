# House of Chicken & Waffles | Social Hub & Operational Shell

Modern, interactive, and automated React + Vite dashboard shell engineered specifically for **House of Chicken & Waffles** (Providence, RI).

Implements the complete **90-Day Social Media Game Plan** and **House Rewards** loyalty strategy in a unified, error-free workspace.

---

## ⚡ Key Capabilities

### 1. ⚡ Automatic Multi-Platform AI Copywriter
- **One Capture → 4 Platform Edits**: Automatically generates 4 distinct platform-tailored copy variations adhering to the restaurant's core strategy:
  - **Facebook**: Community & conversation, storytelling, question hook to invite comments, local Providence tags, and direct CTA.
  - **Instagram**: Polished beauty shot aesthetic, sensory descriptions, clean spacing, and 10+ targeted Providence foodie hashtags (`#ProvidenceEats #PVDfoodie`).
  - **TikTok**: High-energy first 3-second hook (*"You didn't know Providence had THIS"*), trending kitchen audio vibes, and fast-cut pacing tips.
  - **Google Business Profile**: Local search optimization, operating hours, direct phone call `(401) 555-CHICKEN`, and "Order Online" conversion buttons.
- Pre-loaded with signature concept starters (*Friday Boss Box, Morning Batter Sizzle, Golden Waffle Day, Chef Darnell's Secret Order*).

### 2. 📱 High-Fidelity Social Mockup Previews
- Toggle between live **Instagram Reel**, **Facebook Sponsored Post**, **TikTok Video**, and **Google Business Update** directly in the dashboard to review exactly how customers see the content before publishing.

### 3. 🧇 House Rewards Loyalty Engine
- **Simple Visit Rewards**:
  - 1 stamp for each qualifying entrée or meal.
  - 3 stamps: Instant fountain drink or side upgrade perk.
  - 6 stamps: Free classic waffle ($12 value) or approved meal credit.
- **Interactive Digital Punch Card**: Live animated stamp slots with "+ Add Visit Stamp (+1)" and "Redeem Perk" controls.
- **🌟 1-Click Golden Waffle Day Automation**: Instantly activates 2x double stamps across the restaurant and auto-schedules promotional announcement drafts for Instagram Stories and Facebook.
- **Operational Guardrails**: Owner-approved margins and strict anti-bribery protections (no paid/incentivized reviews).

### 4. 🧾 Toast POS Integration & Checkout Simulator
- **Interactive POS Screen**: Simulate Marcus looking up a guest by phone at the Providence register.
- **Automatic Discount & Stamp Calculation**: Real-time receipt calculation with Rhode Island meals tax (8%), House Rewards discounts, and asynchronous stamp posting upon payment.
- **Live Webhook Stream**: Real-time JSON event feed displaying incoming checks and loyalty sync events.
- **"⚡ Simulate Live POS Order"**: Generates realistic counter transactions on the fly.

### 5. 📅 Content Calendar & 7-Day Cadence
- Maps scheduled posts to the strategic weekly rhythm:
  - **Monday**: Food close-up or featured menu item
  - **Tuesday**: Behind-the-scenes / 6 AM scratch batter prep
  - **Wednesday**: Staff & chef personality
  - **Thursday**: Customer spotlight / first-bite reactions
  - **Friday**: High-energy Boss Box Reel / TikTok
  - **Saturday**: Weekend brunch atmosphere
  - **Sunday**: Community specials & the week ahead

### 6. 🔍 Global Spotlight Search (`⌘K`)
- Instant search palette across scheduled posts, media files, House Rewards members, and team members.

### 7. 🌐 Bilingual Support (English / Español)
- 1-click toggle in the top bar translating the workspace between English and Spanish for kitchen and front-of-house staff.

### 8. 🛡️ Role Switcher & Boss Preview Mode
- Switch between **Jasmine Carter (Owner)**, **Maya Rivers (Creator)**, **Darnell King (Reviewer)**, and **Marcus Vance (Cashier)**.
- **Boss Preview Mode** (`?preview=1`): Safe evaluation mode that keeps all views and simulations interactive while locking destructive edits and live publishing.

---

## 🚀 Running Locally

```bash
pnpm install
pnpm dev
```

If Node/pnpm is running in a sandbox or isolated runtime, use:
```bash
PATH="/Users/brehhhx3/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/Users/brehhhx3/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm dev
```

To build for production:
```bash
PATH="/Users/brehhhx3/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/Users/brehhhx3/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm build
```

---

## 📁 Architecture

```
src/
├── App.jsx                     # Central reactive state, keyboard shortcuts, modals
├── main.jsx                    # React 18 DOM mount
├── styles.css                  # Modern restaurant brand styles & responsive rules
├── constants/
│   └── data.js                 # Initial seed posts, media, team, members, cadence
├── utils/
│   ├── aiGenerator.js          # Platform copy adapter (Facebook, IG, TikTok, Google)
│   ├── storage.js              # Safe LocalStorage persistence
│   └── translations.js         # Bilingual dictionary (EN / ES)
└── components/
    ├── Header.jsx              # Search trigger, unread alerts, language & profile switch
    ├── Sidebar.jsx             # Dark culinary sidebar with live badge counts
    ├── common/
    │   ├── Icon.jsx            # Lightweight SVG icon collection
    │   ├── BrandMark.jsx       # House of Chicken & Waffles official crest
    │   ├── PlatformBadge.jsx   # Social network icons
    │   ├── StatusBadge.jsx     # Status indicators
    │   └── Toast.jsx           # Floating animated notification alerts
    ├── previews/
    │   └── SocialPreview.jsx   # Native UI preview for IG, FB, TikTok, Google
    ├── modals/
    │   ├── PostModal.jsx       # Post composer with AI adapter & live mockup tabs
    │   ├── TeamModal.jsx       # Workspace member invite modal
    │   ├── MemberModal.jsx     # Loyalty member enrollment modal
    │   ├── RuleModal.jsx       # Operational guardrails editor
    │   └── SearchModal.jsx     # Spotlight Cmd+K quick search palette
    └── views/
        ├── OverviewView.jsx    # Publishing queue, live preview & weekly pulse
        ├── CalendarView.jsx    # 7-day marketing rhythm calendar
        ├── MediaView.jsx       # Searchable asset library with upload & "Use in Post"
        ├── ApprovalsView.jsx   # Review queue, batch approve, change request notes
        ├── PublishedView.jsx   # Live post log & performance viewer
        ├── AnalyticsView.jsx   # 7D / 30D / 90D interactive metric sparklines
        ├── HouseRewardsView.jsx# Loyalty directory, digital punch card & Golden Waffle Day
        ├── TeamView.jsx        # Staff roles & permissions matrix
        ├── AccountsView.jsx    # OAuth connected account credentials
        └── ToastView.jsx       # Interactive POS terminal & webhook event stream
```
