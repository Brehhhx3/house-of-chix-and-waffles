import { WEEKLY_CADENCE } from '../constants/data'

/**
 * Generates tailored copy for all 4 major platforms following the
 * House of Chicken & Waffles Social Media Game Plan guidelines.
 */
export function generatePlatformCopy({ title, promptText, category = 'food', dayOfWeek = 'Friday' }) {
  const seed = `${title} ${promptText}`.trim()
  const lower = seed.toLowerCase()

  // Detect food details
  const isWaffle = lower.includes('waffle') || lower.includes('batter') || lower.includes('iron')
  const isSpicy = lower.includes('spicy') || lower.includes('honey') || lower.includes('hot')
  const isDeal = lower.includes('deal') || lower.includes('special') || lower.includes('box') || lower.includes('double') || lower.includes('reward')
  const isBts = lower.includes('behind') || lower.includes('prep') || lower.includes('morning') || category === 'bts'
  const isStaff = lower.includes('chef') || lower.includes('crew') || lower.includes('staff') || category === 'staff'

  // Determine optimal schedule based on cadence
  const cadenceMatch = WEEKLY_CADENCE.find((c) => c.day.toLowerCase() === dayOfWeek.toLowerCase()) || WEEKLY_CADENCE[4]

  // 1. Facebook: Community & Conversation
  let fbText = ''
  if (isDeal) {
    fbText = `Providence family, this weekend is about good food and great company! 🍗🧇\n\nWe’ve got ${title || 'our signature feast'} ready for you. Made fresh to order, seasoned inside and out, and served with pure warm maple syrup and house honey butter.\n\nQuick question for our regulars: Do you prefer your chicken tenders dipped on the side, or smothered right over the waffle? Tell us below in the comments! 👇\n\n📍 House of Chicken & Waffles — Providence, RI\n📞 Call ahead or order online for direct pickup.\n🌟 House Rewards members: ask Marcus at the counter for your visit stamp!`
  } else if (isBts) {
    fbText = `Ever wonder why our waffles come out so crisp with that airy center? 🧇✨\n\nIt starts right here at sunrise with our scratch buttermilk batter. Chef Darnell doesn't take shortcuts, and neither does the crew.\n\nWho in Providence needs a fresh waffle breakfast this morning? Tag them and make breakfast plans!\n\n📍 House of Chicken & Waffles — Downtown Providence\n⏰ Breakfast & Lunch daily`
  } else if (isStaff) {
    fbText = `Meet the faces behind your favorite plate! 👋\n\nChef Darnell and our kitchen crew have been perfecting this crisp for months. Great food builds stronger communities, and our team is proud to serve Providence every single day.\n\nDrop some love for the crew in the comments! What is your all-time favorite order when you visit? 👇`
  } else {
    fbText = `Sunday family brunch or Friday night comfort food — nothing beats a hot plate of fresh chicken and waffles right here in Providence! 🍗🧇\n\nCrispy, seasoned to perfection, and paired with golden waffles made to order. Who are you bringing along on your next visit? Tag your brunch partner below! 👇\n\n📍 House of Chicken & Waffles, Providence RI\n🕒 Open daily · Dine-in & direct takeout`
  }

  // 2. Instagram: Appearance & Branding
  let igText = ''
  if (isSpicy) {
    igText = `Hot honey drizzle meets 24-hour seasoned crisp. ✨\n\nEvery single plate is cooked to order so that first bite is always steaming and crunchy. If you haven’t experienced the House combo yet, consider this your sign.\n\n🧇 Golden Belgian ridges\n🍗 3-piece double-dredged chicken\n🍯 House hot honey drizzle\n\n📍 Providence, RI · Link in bio to order direct & skip the wait.`
  } else if (isBts) {
    igText = `The 6:00 AM iron reveal. 🧇💨\n\nScratch buttermilk batter. Blazing cast iron. Pure culinary rhythm.\n\nSave this for your next weekend brunch craving.\n\n📍 House of Chicken & Waffles · Providence, RI`
  } else {
    igText = `Crispy chicken. Golden waffle. Zero compromises. 🔥\n\nProvidence, this is what comfort food is meant to feel like. Golden on the outside, juicy on the inside, and dripping in real syrup.\n\n👉 Tag your food crew\n📌 Save this for this weekend’s brunch plans\n🔗 Link in bio to view full menu`
  }
  const igHashtags = '#ProvidenceEats #ChickenAndWaffles #PVDfood #HouseOfChicken #RIFoodies #CrispyChicken #ProvidenceBrunch #BestOfRI #EatLocalPVD #SoulFoodEats'

  // 3. TikTok: Entertainment & Discovery (Fast Hook + Audio suggestion)
  let ttText = ''
  let ttHook = ''
  let ttSound = 'Trending: Soul / R&B Acoustic Vibe (Lo-fi Brunch Beats)'
  if (isBts) {
    ttHook = '“You didn’t know Providence had waffle steam like THIS.”'
    ttText = `Wait until the waffle iron opens at the 5-second mark! 🧇👀 Scratch batter every single morning in Providence, RI.\n\nSound on for the crunch! 🔊`
    ttSound = 'Original Sound - House of Chicken Kitchen Rhythm (ASMR)'
  } else if (isDeal) {
    ttHook = '“This is the biggest chicken & waffle box in Rhode Island for under $25.”'
    ttText = `Look at everything packed inside this box. 4 jumbo tenders, 2 golden waffles, loaded fries, and double sauces. Would you finish this solo? 🍗🔥\n\n📍 House of Chicken & Waffles, Providence RI`
    ttSound = 'Trending TikTok Hip-Hop Beat / Upbeat Foodie Audio'
  } else {
    ttHook = '“POV: You found the spot in Providence where the chicken actually crunches like this.”'
    ttText = `First bite test never lies! 🤤 Golden waffle + triple-seasoned crispy chicken + hot honey. Who’s pulling up this weekend?\n\n📍 House of Chicken & Waffles`
    ttSound = 'FoodTok Viral Audio (ASMR Crunch)'
  }

  // 4. Google Business Profile: Local Search & Direct Conversion
  let gbpText = ''
  if (isDeal) {
    gbpText = `Weekend Special at House of Chicken & Waffles in Providence, RI! Enjoy our signature ${title || 'Chicken & Waffle Combo'}, freshly fried and served with hot syrup. House Rewards members earn visit stamps toward free waffles. Dine in or order direct online for faster curbside pickup. Call (401) 555-CHICKEN or visit us today!`
  } else {
    gbpText = `Fresh, authentic Chicken and Waffles in Providence, Rhode Island. Open today for dine-in, takeout, and local catering. Made from scratch daily using our signature house recipe. Click 'Order Online' or 'Get Directions' to visit us today at House of Chicken & Waffles.`
  }

  return {
    title: title || 'Fresh House Feature',
    suggestedFormat: isBts ? 'Video · 9:16 Reel' : 'Photo / Short Reel',
    recommendedTime: cadenceMatch.time,
    recommendedDay: cadenceMatch.day,
    recommendedPlatform: cadenceMatch.bestPlatform,
    platformCaptions: {
      facebook: fbText,
      instagram: `${igText}\n\n${igHashtags}`,
      tiktok: `${ttHook}\n\n${ttText}`,
      google: gbpText,
    },
    tiktokNotes: {
      hook: ttHook,
      audio: ttSound,
      editingTip: 'Open immediately on the crunch or steam within 1.5 seconds. Cut rapidly between sauce pour and plate reveal.',
    },
    hashtags: igHashtags,
  }
}
