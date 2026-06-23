# FastFox 🦊⚡

> A privacy-first, performance-tuned Firefox configuration for **Apple Silicon Macs**.
> Optimized for macOS Sequoia + M4, compatible with all modern Firefox versions (120+).

---

## What is FastFox?

FastFox is a drop-in Firefox profile enhancement that combines three layers of optimization into a single, portable, version-controlled package:

| Layer | File | What it does |
|---|---|---|
| **Performance & Privacy** | `user.js` | 176 Firefox preferences — network tuning, GPU acceleration, telemetry blocking, DNS-over-HTTPS, memory management, smooth scrolling, and more |
| **Visual Design** | `chrome/userChrome.css` | macOS-native UI — system fonts, rounded corners, frosted glass popups, minimalist chrome |
| **Content Styling** | `chrome/userContent.css` | Cleaner new tab page, add-ons manager, and preferences pages |
| **Bookmarks** | `bookmarks.html` | Curated, deduplicated bookmark library (808 links) organized into 13 categories by frequency of use |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/irfancode/FastFox.git ~/FastFox

# 2. Find your Firefox profile
ls ~/Library/Application\ Support/Firefox/Profiles/
# → xxxxxxxx.default-release  (your current profile)
# → yyyyyyyy.FastFox          (if you already created one)

# 3. Create a dedicated FastFox profile
/Applications/Firefox.app/Contents/MacOS/firefox -CreateProfile "FastFox"

# 4. Copy files into the new profile
PROFILE=~/Library/Application\ Support/Firefox/Profiles/  # find the new one
PROFILE=$(ls -d ~/Library/Application\ Support/Firefox/Profiles/*.FastFox | head -1)

cp ~/FastFox/user.js           "$PROFILE/"
cp ~/FastFox/bookmarks.html    "$PROFILE/"
cp ~/FastFox/chrome/userChrome.css  "$PROFILE/chrome/"
cp ~/FastFox/chrome/userContent.css "$PROFILE/chrome/"

# 5. Launch FastFox
/Applications/Firefox.app/Contents/MacOS/firefox -P FastFox

# 6. (Optional) Import bookmarks if not copied:
#    Library → Bookmarks → Import and Backup → Import Bookmarks from HTML
#    → Select bookmarks.html from the profile folder
```

---

## Installation Details

### Prerequisites

- **Firefox 120+** (Nightly, Developer, Beta, or Release)
- **macOS 14+** (optimized for Sequoia 15, works on Ventura+)
- **Apple Silicon Mac** (M1/M2/M3/M4 — ARM64 optimizations included)
- Intel Macs work too — some GPU pref values may differ (see comments in `user.js`)

### Manual Install (No Repo)

If you prefer not to clone the repo, you can copy individual files:

```bash
# Create profile
/Applications/Firefox.app/Contents/MacOS/firefox -CreateProfile "FastFox"

# Find it
ls ~/Library/Application\ Support/Firefox/Profiles/*.FastFox

# Copy files in
cp /path/to/user.js "$PROFILE/"
mkdir -p "$PROFILE/chrome"
cp /path/to/userChrome.css "$PROFILE/chrome/"
cp /path/to/userContent.css "$PROFILE/chrome/"
cp /path/to/bookmarks.html "$PROFILE/"
```

### Resetting

Delete the profile folder and re-create it. Keep a backup of `user.js`, `chrome/`, and `bookmarks.html`.

```bash
# Back up first
cp -r "$PROFILE" ~/Desktop/FastFox-backup

# Delete profile folder
rm -rf "$PROFILE"

# Create fresh
/Applications/Firefox.app/Contents/MacOS/firefox -CreateProfile "FastFox"
```

---

## File Reference

### `user.js` — The Engine

176 preference overrides divided into 8 parts:

| Part | Section | Key optimizations |
|---|---|---|
| 1 | Speed | Disk cache enabled (512 MB), connection pool 1200, HTTP/3, media cache tuned for M4, DNS cache 1 hour |
| 2 | GPU Acceleration | WebRender forced on, Metal shader cache, canvas acceleration, GPU process enabled |
| 3 | ARM64 | 10 content processes (all M4 cores), 6 web processes, optimized GC watermark |
| 4 | Privacy | Telemetry fully disabled, CRLite cert checking, DNS-over-HTTPS (Cloudflare), HTTPS-only mode, Global Privacy Control |
| 5 | UI | No Pocket, no VPN ads, no sponsored content, compact mode enabled |
| 6 | Personal | Tracking protection "standard", geo/notifications = ask, session privacy level 2, clear cookies/cache on shutdown |
| 7 | Scrolling | MSD physics tuned for 120Hz+ displays, smooth overscroll |
| 8 | macOS/M4 | Metal API, hardware video decoding, Core Animation, UMA optimizations |

Key decisions documented in comments — every non-default value has a rationale.

### `chrome/userChrome.css` — The Look

- **System font** (`-apple-system` / San Francisco Pro) throughout
- **Clean nav bar** — forward, home, library, sidebar, downloads buttons hidden; back button visible
- **Rounded URL bar** (10px pill) with macOS focus ring
- **Native tab styling** with hover and selected states
- **Frosted glass popups** (`backdrop-filter: blur`) matching macOS Sequoia
- **Thin scrollbars** matching system style
- **Sidebar styling** ready for Sidebery/Tree Style Tab (CSS included, commented out)
- **Dark mode** respected via `prefers-color-scheme`

No layout restructuring — no `position: fixed`, no `margin` offsets. Just surface styling on native Firefox chrome.

### `bookmarks.html` — The Content

808 curated bookmarks from an original set of 32,971. Processing pipeline:

```
32,971 raw bookmarks
  → 24,586 removed (non-HTTPS)
    → 7,560 deduplicated
      → 17 dead links removed
        → 808 curated bookmarks
```

**Category breakdown:**

| Category | Count | Highlights |
|---|---|---|
| 🤖 AI & ML | 3 | ChatGPT, Perplexity |
| 💻 Dev & Tech | 36 | GitHub, Stack Overflow, AWS/GCP/Azure, Docker, Kubernetes |
| 📰 News | 69 | FT, Bloomberg, NLB eNewspaper, NYT, NPR |
| 📱 Social Media | 51 | Reddit, LinkedIn, Instagram, X, WhatsApp |
| 🎬 Entertainment | 28 | YouTube, Vimeo |
| 📚 Books & Reading | 27 | OverDrive, PressReader, Wikipedia |
| 🎓 Learning | 21 | Coursera, SRE resources |
| 💼 Work & Career | 9 | LinkedIn Jobs, Indeed |
| ⚡ Productivity | 8 | OneDrive, Google Calendar |
| ✉️ Email | 10 | Gmail, Proton Mail, Outlook |
| 🛒 Shopping | 5 | Amazon |
| 💰 Finance | 4 | — |
| 📌 Other | 559 | Misc |

---

## Vertical Tabs (Optional)

FastFox ships with support for **Sidebery** — the gold standard for vertical tabs in Firefox.

### Setup

1. Install [Sidebery](https://addons.mozilla.org/en-US/firefox/addon/sidebery/)
2. Open Sidebery settings → **Layout** → Choose **Vertical**
3. Uncomment the vertical tabs block at the bottom of `chrome/userChrome.css`:

```css
/* ~ line 195 in userChrome.css */
#TabsToolbar {
  visibility: collapse !important;
}
#titlebar { -moz-appearance: none !important; }
#sidebar-box { min-width: 260px !important; }
```

4. Restart Firefox

### Why Sidebery instead of pure CSS?

| Approach | Stability | Features | Maintenance |
|---|---|---|---|
| **Sidebery** | ✅ Bulletproof | Tab groups, bookmarks panel, containers, themes | Zero maintenance |
| **Pure CSS vertical tabs** | ❌ Breaks every ~6 weeks | Minimal | High — each Firefox update may move XUL elements |

---

## Pros & Cons

### FastFox

| Pro | Con |
|---|---|
| **Privacy-first**: Telemetry disabled, DoH enabled, OCSP → CRLite, HTTPS-only mode | **OCSP disabled**: CRLite is more private but less widely deployed. Some enterprises may require OCSP |
| **Performance**: WebRender, GPU process, Metal API, HTTP/3, hardware video decode | **Aggressive connection pool** (1200): Some consumer routers or VPNs may struggle; reduce to 600 if you see timeouts |
| **Memory tuned**: bfcache, 10 content processes, 192 MB GC watermark | **Session cleared on shutdown**: Cookies, cache, form data wiped every exit. If you want persistent sessions, set `privacy.sanitize.sanitizeOnShutdown` to `false` |
| **Zero SSD wear**: Disk cache limited to 512 MB, memory cache preferred | **Cold starts**: With disk cache disabled for media (128 MB limit), repeat visits to heavy sites reload all assets |
| **macOS-native UI**: System fonts, frosted glass, proper dark mode, thin scrollbars | **Chrome modifications**: Firefox updates occasionally deprecate CSS selectors. The `userChrome.css` is intentionally conservative to minimize breakage |
| **Curated bookmarks**: 808 deduplicated, categorized, cleaned | **Bookmark import required**: `bookmarks.html` must be imported via Library → Bookmarks. Not automatic |
| **M4-optimized**: Hardware video decode, 10-core process allocation, Metal GPU | **Intel Macs**: Some GPU and process-count defaults differ. Adjust `dom.ipc.processCount.web` to your core count |
| **Portable**: Git-tracked config. Clone and copy to any Mac for identical setup | **Firefox-specific**: This is not a cross-browser config. Only applies to Firefox |

### Sidebery (Vertical Tabs)

| Pro | Con |
|---|---|
| Native-feeling vertical tabs with auto-hide | Additional extension running in the sidebar |
| Tab groups, snapshots, bookmarks panel | Slight memory overhead (~50 MB) |
| Container support (Multi-Account Containers) | Learning curve for settings |
| Active development, frequent updates | CSS for hiding native tabs needs uncommenting |

---

## Comparison: Betterfox vs FastFox

| Aspect | Betterfox (base) | FastFox |
|---|---|---|
| Base | General Firefox optimization | Betterfox + Apple Silicon M4 tuning |
| Platform | Cross-platform | macOS-specific (ARM64 optimizations) |
| GPU | Generic WebRender | Metal API, Core Animation, UMA tuning |
| Video | Software VP9 (ffvpx) | Hardware decoding via VideoToolbox |
| Bookmark curation | None | 32,971 → 808 curated bookmarks |
| Visual theme | None | macOS-native CSS styling (optional) |
| Vertical tabs | Not included | Sidebery-ready (CSS pre-written) |
| Maintenance | Community-driven | Personal config, updated manually |

---

## FAQ

### Q: Will this work on Firefox Release (non-Nightly)?

Yes. The `user.js` and CSS files work on Firefox 120+ regardless of channel (Release, Beta, Developer, Nightly). Some `user.js` prefs may be Nightly-only — they'll simply be ignored on other channels.

### Q: How do I update FastFox?

```bash
cd ~/FastFox
git pull
# Copy updated files into your profile (see Quick Start step 4)
```

### Q: A Firefox update broke something. What do I do?

1. Check if the breakage is in `user.js` (settings) or `userChrome.css` (visuals)
2. For CSS issues: remove or comment out the problematic block
3. For `user.js` issues: comment out the offending pref and restart
4. [Open an issue](https://github.com/irfancode/FastFox/issues) describing the breakage

### Q: Can I use FastFox with an existing profile?

Yes, but prefer a **new profile**. Applying `user.js` to an existing profile that has years of accumulated `prefs.js` entries may cause conflicts. A fresh FastFox profile is:

```bash
/Applications/Firefox.app/Contents/MacOS/firefox -CreateProfile "FastFox"
```

### Q: The URL bar focus ring / popup looks wrong.

Ensure `toolkit.legacyUserProfileCustomizations.stylesheets` is `true` (it's set in `user.js`). If you applied `userChrome.css` without `user.js`, set this pref manually in `about:config`.

---

## License

MIT — use freely, modify freely, share freely.

Built on the shoulders of [Betterfox](https://github.com/yokoffing/Betterfox) by yokoffing.
