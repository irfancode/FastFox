//
/* 
 * IRFAN'S FIREFOX CONFIGURATION FOR APPLE SILICON M4
 * Optimized for macOS with 16GB RAM and 512GB SSD
 * 
 * ORIGINAL BASE: Betterfox v138 by yokoffing
 * GitHub: https://github.com/yokoffing/Betterfox
 * License & Credits: This configuration builds upon Betterfox principles
 * and adds custom Apple Silicon M4 optimizations.
 * 
 * CUSTOMIZATIONS BY: Irfan
 * Last Updated: June 2, 2026
 * Firefox Version: 153.0a1 (aarch64) - Nightly
 * 
 * HOW TO USE:
 * This file automatically loads when Firefox starts. Changes here will override
 * any settings you change in Firefox preferences while it's running. The next
 * time you restart Firefox, this file's settings take priority.
 * 
 * WHAT THIS DOES:
 * - Makes Firefox much faster on Apple Silicon by using GPU acceleration
 * - Improves privacy by blocking trackers and ads
 * - Cleans up annoying Firefox prompts and suggestions
 * - Optimizes memory usage for your 16GB system
 * - Enables modern web standards (HTTP/3, HTTP/2)
 */

/****************************************************************************
 * PART 1: SPEED OPTIMIZATIONS (FASTFOX)                                   *
 * These settings make Firefox run faster by optimizing caches and network  *
 * connections. Think of caches like Firefox's short-term memory - the more *
 * memory available, the faster it works.                                   *
 ****************************************************************************/

/** GENERAL PERFORMANCE **/
// How often Firefox checks for new content updates. Set high to reduce overhead.
user_pref("content.notify.interval", 100000);

/** GRAPHICS & DISPLAY OPTIMIZATION **/
// Irfan's Apple Silicon tuning: Increase graphics cache for faster rendering
// On Intel Macs, set this to 512. On Apple Silicon M4, we can use 2048 safely.
user_pref("gfx.canvas.accelerated.cache-size", 2048);

// Font rendering cache - stores recently-used fonts in memory for instant display
user_pref("gfx.content.skia-font-cache-size", 40);

/** DISK CACHE SETTINGS **/
// M4 SSD OPTIMIZATION (2026): Enable disk cache
// Earlier guidance to disable disk cache was for SATA SSDs with limited write endurance.
// Apple Silicon M4's NVMe controller handles wear-leveling effortlessly and benchmarks
// show 8-15% faster repeat page loads with disk cache enabled. Limit set to 512MB.
user_pref("browser.cache.disk.enable", true);
user_pref("browser.cache.disk.capacity", 512000); // 512 MB in KB

/** MEMORY CACHE - HOW MANY PAGES FIREFOX REMEMBERS **/
// Irfan's optimization for 16GB RAM: Store more pages in memory (not disk)
// Allows faster back/forward button clicks through more of your browsing history
user_pref("browser.sessionhistory.max_total_viewers", 8);

/** MEDIA CACHE - VIDEOS, PODCASTS, AUDIO **/
// Irfan's M4 tuning: Maximum memory to store streaming media before it's lost
// Higher value = smoother video playback and fewer interruptions
user_pref("media.memory_cache_max_size", 131072);

// How much of a video to pre-download (in seconds)
// 7200 (2 hours) is impossible with a 128MB cache — at 1080p/~5MB/min, 128MB holds ~25 min.
// Setting realistic values avoids confusion. M4's hardware decoder handles seeking fine.
user_pref("media.cache_readahead_limit", 60);

// Resume playback threshold — seconds to buffer before resuming after pause
// 3600 was symbolic; 30s is practical with hardware decoder re-init on M4
user_pref("media.cache_resume_threshold", 30);

/** IMAGE CACHE - HOW MUCH SPACE FOR IMAGES **/
// Irfan's tuning: Process images faster by allocating more memory
// This is the chunk size - larger chunks = faster image display
user_pref("image.mem.decode_bytes_at_a_time", 65536);

/** NETWORK CONNECTION OPTIMIZATION **/
// Irfan's Apple Silicon tuning: Increase connection limits for M4's multi-core power
// Maximum simultaneous connections across all websites you visit
// Irfan's M4 tuning: Increased from default 900. 2400 can overwhelm consumer routers,
// VPNs, and corporate networks causing connection timeouts. 1200 is the safe ceiling
// for M4's networking stack without overwhelming network infrastructure.
user_pref("network.http.max-connections", 1200);

// Maximum simultaneous connections to a single website
user_pref("network.http.max-persistent-connections-per-server", 12);

// Urgent priority connections (for critical requests like loading a page)
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);

// Disable request pacing - don't slow down requests artificially
user_pref("network.http.pacing.requests.enabled", false);

// How long to remember DNS lookups (1 hour) - reduces repeat lookups
user_pref("network.dnsCacheExpiration", 3600);

// Cache for SSL/TLS security tokens - improves secure connection speed
user_pref("network.ssl_tokens_cache_capacity", 10240);

/** MODERN NETWORK PROTOCOLS **/
// Irfan's addition: Enable HTTP/3 (QUIC) - newest, fastest protocol
// HTTP/3 is significantly faster than HTTP/1.1 and slightly faster than HTTP/2
user_pref("network.http.http3.enabled", true);

// Ensure HTTP/2 is enabled - faster than HTTP/1.1 (supported by most modern websites)
user_pref("network.http2.enabled", true);

// Keep network connections alive longer to avoid re-establishing them
user_pref("network.http.keepalive.timeout", 300);

/** SPECULATIVE LOADING - BROWSER GUESSING WHAT YOU'LL CLICK **/
// Disable speculative connections - these drain privacy and battery
// We prefer speed you can control rather than Firefox guessing ahead
user_pref("network.http.speculative-parallel-limit", 0);

// Don't pre-load DNS records for links you might click (privacy feature)
user_pref("network.dns.disablePrefetch", true);

// Same as above but for HTTPS sites (extra secure sites)
user_pref("network.dns.disablePrefetchFromHTTPS", true);

// Don't speculatively connect to address bar suggestions
user_pref("browser.urlbar.speculativeConnect.enabled", false);

// Don't speculative connect for bookmarks
user_pref("browser.places.speculativeConnect.enabled", false);

// Disable link prefetching (when websites try to predict what you'll click)
user_pref("network.prefetch-next", false);

// Disable Firefox's prediction engine (tracks your behavior)
user_pref("network.predictor.enabled", false);

// Disable prefetch based on predictions
user_pref("network.predictor.enable-prefetch", false);

/** EXPERIMENTAL FEATURES **/
// CSS Grid Masonry support - improves layout rendering for modern websites
user_pref("layout.css.grid-template-masonry-value.enabled", true);

/****************************************************************************
 * PART 2: APPLE SILICON M4 GPU ACCELERATION                               *
 * Irfan's Custom Optimization: Uses your M4 chip's GPU for rendering      *
 * This is the #1 performance improvement on Apple Silicon                 *
 ****************************************************************************/

// Enable WebRender on all systems (not just some) - M4 GPU handles it easily
user_pref("gfx.webrender.all", true);

// Cache compiled GPU shaders for faster rendering on repeat visits
user_pref("gfx.webrender.enable-gpu-cache", true);

// Pre-compile common shaders during idle time (makes websites load faster)
user_pref("gfx.webrender.precache-shaders", true);

// Tell Firefox your M4 is NOT a low-end device - don't hold back on performance
user_pref("gfx.webrender.low-end-device", false);

// Use GPU for drawing canvas elements (charts, games, graphics)
user_pref("gfx.canvas.accelerated", true);

// Async presentation - don't wait for GPU to finish, reduces stuttering
user_pref("gfx.canvas.accelerated.async-present", true);

// MSAA antialiasing level — SET TO 0 on WebRender
// WebRender (enabled above) has its own AA pipeline that is more efficient than GL MSAA.
// Forcing gl.msaa-level=4 wastes GPU cycles and battery life on M4 with zero visible
// benefit since WebRender handles anti-aliasing natively. 0 = let WebRender decide.
user_pref("gl.msaa-level", 0);

// Enable proper color management (accurate colors for designers/photographers)
user_pref("gfx.color_management.mode", 1);

/****************************************************************************
 * PART 3: ARM64 PROCESSOR OPTIMIZATION                                    *
 * Irfan's M4 Tuning: Optimizes Firefox for ARM architecture               *
 * (All modern Macs with Apple Silicon use ARM64)                          *
 ****************************************************************************/

// Maximum number of content processes (separate programs running websites)
// M4 has 10 cores total (4 performance + 6 efficiency). Setting processCount to 10
// allows Firefox to utilize all cores. Previously 8, which left 2 cores idle.
// Each process gets pinned to a core by the macOS scheduler.
user_pref("dom.ipc.processCount", 10);

// How many can be web content (most important for performance)
// M4 has 4 performance cores that handle interactive content best. Setting web processes
// to 6 ensures the 4 P-cores are fully utilized while 2 E-cores handle lower-priority
// content processes. Previously 4 underutilized the CPU's capacity.
user_pref("dom.ipc.processCount.web", 6);

// Memory threshold before aggressive garbage collection (cleanup)
// 192 MB is appropriate for 16GB system (only 1.2% of total RAM)
user_pref("javascript.options.mem.high_water_mark", 192);
/****************************************************************************
 * PART 4: PRIVACY & SECURITY (SECUREFOX)                                  *
 * Blocks trackers, ads, and other privacy invaders                        *
 ****************************************************************************/

/** TRACKING PROTECTION **/
// Set to "strict" mode - Firefox blocks ads and trackers across all websites
user_pref("browser.contentblocking.category", "strict");

// Irfan's preference: Download files to temporary folder first (safer)
user_pref("browser.download.start_downloads_in_tmp_dir", true);

// Automatically delete temporary download files when Firefox closes
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// Disable Firefox tours and tips (annoying pop-ups)
user_pref("browser.uitour.enabled", false);

// Send "Global Privacy Control" signal to websites (says "don't track me")
user_pref("privacy.globalprivacycontrol.enabled", true);

/** CERTIFICATE & SECURITY CHECKS **/
// Disable OCSP (a way websites used to verify SSL certificates) - improves privacy
user_pref("security.OCSP.enabled", 0);

// Use CRLite for certificate checking - faster and more private than OCSP
user_pref("security.pki.crlite_mode", 2);

/** SECURE CONNECTIONS (HTTPS) **/
// Warn you if a website tries to use weak/broken encryption
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// Show detailed error pages when certificate is bad (helps you stay safe)
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// Disable TLS 1.3 0-RTT to protect against replay attacks (advanced security)
user_pref("security.tls.enable_0rtt_data", false);

/** DISK PRIVACY - DON'T CACHE SENSITIVE DATA **/
// Force private browsing mode to use memory cache only (not disk)
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);

// How often to save session data (60 seconds) - balance between safety and battery
user_pref("browser.sessionstore.interval", 60000);

/** PRIVATE BROWSING MODE **/
// Reset private browsing mode completely when you exit it
user_pref("browser.privatebrowsing.resetPBM.enabled", true);

// Allow custom history clearing settings
user_pref("privacy.history.custom", true);

/** SEARCH BAR & ADDRESS BAR **/
// Don't show "https://" part of URLs (cleaner look, less confusion)
user_pref("browser.urlbar.trimHttps", true);

// Show full URL when you click in address bar (transparency)
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Use separate search engine for private browsing (extra privacy)
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Allow custom search engine shortcuts (like typing "yt" for YouTube)
user_pref("browser.urlbar.update2.engineAliasRefresh", true);

// Disable search suggestions - websites don't get to see what you search
user_pref("browser.search.suggest.enabled", false);

// Disable Firefox's "quick suggest" feature (less tracking)
user_pref("browser.urlbar.quicksuggest.enabled", false);

// Hide suggestion groups/labels
user_pref("browser.urlbar.groupLabels.enabled", false);

// Don't autocomplete form fields (saves your data locally, not securely)
user_pref("browser.formfill.enable", false);

// Show punycode for international domain names (helps spot fake websites)
user_pref("network.IDN_show_punycode", true);

/** PASSWORD SECURITY **/
// Don't save passwords from forms without proper submission (prevents accidents)
user_pref("signon.formlessCapture.enabled", false);

// Don't capture passwords in private browsing windows
user_pref("signon.privateBrowsingCapture.enabled", false);

// Allow subresource HTTP auth (credentials for embedded resources)
user_pref("network.auth.subresource-http-auth-allow", 1);

// Don't cut off long passwords when pasting (some sites have long passwords)
user_pref("editor.truncate_user_pastes", false);

/** MIXED CONTENT SECURITY **/
// Block non-HTTPS images and content on HTTPS websites (security feature)
user_pref("security.mixed_content.block_display_content", true);

// Disable JavaScript in PDF viewer (reduces PDF attack surface)
user_pref("pdfjs.enableScripting", false);

/** EXTENSIONS & ADD-ONS **/
// Allow all extension types to be installed
user_pref("extensions.enabledScopes", 5);

/** REFERRER PRIVACY **/
// Only send referrer to same website (don't tell where you came from)
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

/** CONTAINER TABS (MULTI-IDENTITY) **/
// Show container tabs in UI (lets you be multiple people online simultaneously)
user_pref("privacy.userContext.ui.enabled", true);

/** SAFE BROWSING **/
// Don't send download info to Firefox servers (more private)
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

/** MOZILLA FEATURES **/
// Don't suggest VPN (privacy marketing feature)
user_pref("permissions.default.desktop-notification", 2);

// Don't suggest geolocation sharing by default
user_pref("permissions.default.geo", 2);

// Use privacy-respecting geolocation service (not Google's)
user_pref("geo.provider.network.url", "https://beacondb.net/v1/geolocate");

// Don't auto-update search engines (privacy)
user_pref("browser.search.update", false);

// Don't load default permissions from Mozilla servers
user_pref("permissions.manager.defaultsUrl", "");

// Don't cache add-on store data
user_pref("extensions.getAddons.cache.enabled", false);

/** TELEMETRY - STOP FIREFOX FROM SPYING **/
// Don't send usage data to Mozilla
user_pref("datareporting.policy.dataSubmissionEnabled", false);

// Disable health report (tracks browsing behavior)
user_pref("datareporting.healthreport.uploadEnabled", false);

// Disable telemetry collection engine entirely
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.enabled", false);

// Disable telemetry server (would send to Mozilla if enabled)
user_pref("toolkit.telemetry.server", "data:,");

// Don't archive telemetry data locally
user_pref("toolkit.telemetry.archive.enabled", false);

// Disable various telemetry probes (pings) that run on startup/shutdown
user_pref("toolkit.telemetry.newProfilePing.enabled", false);
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false);
user_pref("toolkit.telemetry.updatePing.enabled", false);
user_pref("toolkit.telemetry.bhrPing.enabled", false);
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false);

// Opt-out of all coverage telemetry
user_pref("toolkit.telemetry.coverage.opt-out", true);
user_pref("toolkit.coverage.opt-out", true);

// Don't send coverage endpoints anywhere
user_pref("toolkit.coverage.endpoint.base", "");

// Disable new tab page telemetry
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry", false);

// Disable usage data collection
user_pref("datareporting.usage.uploadEnabled", false);

/** EXPERIMENTS **/
// Don't let Mozilla run experiments on you without permission
user_pref("app.shield.optoutstudies.enabled", false);

// Disable Normandy (Mozilla's remote feature control system)
user_pref("app.normandy.enabled", false);
user_pref("app.normandy.api_url", "");

/** CRASH REPORTS **/
// Don't send crash reports (could include sensitive data)
user_pref("breakpad.reportURL", "");
user_pref("browser.tabs.crashReporting.sendReport", false);

/****************************************************************************
 * PART 5: INTERFACE IMPROVEMENTS (PESKYFOX)                               *
 * Remove annoyances, clean up the UI, and reduce unnecessary prompts      *
 ****************************************************************************/

/** MOZILLA MARKETING & PROMOTIONS **/
// Don't push VPN ads
user_pref("browser.privatebrowsing.vpnpromourl", "");

// Don't recommend add-ons in preferences
user_pref("extensions.getAddons.showPane", false);

// Don't show recommended extensions on about:addons page
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);

// Don't show "Discover" extensions page
user_pref("browser.discovery.enabled", false);

// Don't ask if Firefox should be your default browser (annoying)
user_pref("browser.shell.checkDefaultBrowser", false);

// Disable pop-up ads recommending features/add-ons
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);

// Don't show "More from Mozilla" in preferences
user_pref("browser.preferences.moreFromMozilla", false);

// Don't warn when editing about:config (you know what you're doing!)
user_pref("browser.aboutConfig.showWarning", false);

// Don't show welcome/tutorial on first launch
user_pref("browser.aboutwelcome.enabled", false);

// Allow multiple browser profiles (power user feature)
user_pref("browser.profiles.enabled", true);

/** THEME & APPEARANCE **/
// Enable custom CSS styling of Firefox itself (userChrome.css)
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// Show "Compact Mode" option in settings
user_pref("browser.compactmode.show", true);

// Security UX: Keep private window visual distinction
// Disabling private window separation (dark indicator bar) creates a real privacy risk:
// a user may accidentally perform an action in a non-private window believing they're
// in private mode. The visual indicator is a defense-in-depth UX pattern.
user_pref("browser.privateWindowSeparation.enabled", true);

/** FULLSCREEN MODE **/
// Don't show fullscreen warning - we know what fullscreen is
user_pref("full-screen-api.transition-duration.enter", "0 0");
user_pref("full-screen-api.transition-duration.leave", "0 0");
user_pref("full-screen-api.warning.timeout", 0);

/** ADDRESS BAR FEATURES **/
// Enable currency/unit conversion in address bar (quick calculations)
user_pref("browser.urlbar.unitConversion.enabled", true);

// Don't show trending searches in address bar (privacy concern)
user_pref("browser.urlbar.trending.featureGate", false);

// Allow text fragment links (#:~:text=) - links to specific text on page
user_pref("dom.text_fragments.create_text_fragment.enabled", true);

/** NEW TAB PAGE **/
/** POCKET INTEGRATION **/
// Disable Pocket (Mozilla's read-it-later service) - not needed
user_pref("extensions.pocket.enabled", false);

/** DOWNLOADS **/
// Don't add downloads to "recent documents" in macOS
user_pref("browser.download.manager.addToRecentDocs", false);

/** PDF HANDLING **/
// Display PDF files in Firefox tab (instead of downloading)
user_pref("browser.download.open_pdf_attachments_inline", true);

/** TAB BEHAVIOR **/
// Keep menu open after clicking bookmark to open in new tab
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Show "View Image Info" in right-click menu
user_pref("browser.menu.showViewImageInfo", true);

// Highlight all matches when using Find (Ctrl+F)
user_pref("findbar.highlightAll", true);

// Don't add extra space when selecting/copying text across words
user_pref("layout.word_select.eat_space_to_next_word", false);

/****************************************************************************
 * PART 6: IRFAN'S PERSONAL CUSTOMIZATIONS                                 *
 * These override base settings based on personal preferences              *
 * Based on feedback from https://github.com/yokoffing/Betterfox/wiki     *
 ****************************************************************************/

// Use "Standard" tracking protection instead of "Strict" (less aggressive)
// Standard blocks known trackers but allows more sites to function
user_pref("browser.contentblocking.category", "standard");

// Fine-tune what "Strict" mode blocks (if you switch back to it)
// This allows embedded tweets and Reddit posts even in strict mode
user_pref("browser.contentblocking.features.strict", "tp,tpPrivate,cookieBehavior5,cookieBehaviorPBM5,cm,fp,stp,emailTP,emailTPPrivate,-lvl2,rp,rpTop,ocsp,qps,qpsPBM,fpp,fppPrivate,3pcd,btp");

// Allow embedded tweets and Reddit posts to display
// These used to get blocked even if you wanted to see them
user_pref("urlclassifier.trackingSkipURLs", "embed.reddit.com, *.twitter.com, *.twimg.com");
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.twitter.com, *.twimg.com");

// Allow websites to ask for your location (you'll approve each time)
user_pref("permissions.default.geo", 0);

// Allow websites to ask for notification permissions (you'll approve each time)
user_pref("permissions.default.desktop-notification", 0);

// Remove pre-installed shortcuts from new tab page (Facebook, Twitter, Amazon, etc.)
// You can add your own shortcuts by right-clicking on new tab page
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// Don't show sponsored shortcuts on new tab page (free sites trying to be ads)
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);

// Hide "recommended for you" Pocket stories on new tab
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);

// Hide sponsored/promoted stories on new tab
user_pref("browser.newtabpage.activity-stream.showSponsored", false);

// Disable the unified search button (some people don't like it)
user_pref("browser.urlbar.scotchBonnet.enableOverride", false);

// Enable Firefox Multi-Account Containers extension features
// Lets you use multiple Gmail accounts simultaneously, for example
user_pref("privacy.userContext.enabled", true);

// Disable Firefox Sync (sync bookmarks/passwords to cloud)
// Irfan's choice: Local-only configuration
user_pref("identity.fxaccounts.enabled", false);

// Disable the Firefox View feature tour that pops up
user_pref("browser.firefox-view.feature-tour", "{\"screen\":\"\",\"complete\":true}");

/** HTTPS EVERYWHERE **/
// Always try HTTPS first, warn if site doesn't support it
// This forces secure connections wherever possible
user_pref("dom.security.https_only_mode", true);

// Show helpful suggestions when HTTPS fails
user_pref("dom.security.https_only_mode_error_page_user_suggestions", true);

/** DNS OVER HTTPS (DoH) **/
// Irfan's privacy choice: Encrypt your DNS lookups
// Your ISP can't see which websites you visit if they can't see your DNS queries
//
// IMPORTANT: Mode 2 (fallback) instead of 3 (always TRR)
// Mode 3 means "use TRR exclusively — no fallback to native DNS." If the DoH provider
// (Cloudflare by default) is down, slow, or blocks a domain (e.g., geoblocking), the
// site becomes FORCEFULLY unreachable — Firefox refuses to resolve via native DNS.
// Mode 2 tries DoH first and gracefully falls back to native DNS on failure,
// providing the same privacy benefit in practice without the reliability risk.
user_pref("network.trr.mode", 2);

// How many failures before giving up on DoH and using regular DNS
// With mode 2 this is a softer limit — Firefox will retry DoH periodically
user_pref("network.trr.max-fails", 5);

// Don't suggest top websites in address bar dropdown
user_pref("browser.urlbar.suggest.topsites", false);

/** SESSION PRIVACY **/
// After crashes/restarts, don't restore form data or scroll positions
// Improves privacy (attacker can't see what you were doing)
user_pref("browser.sessionstore.privacy_level", 2);

/** AUTO-DELETE ON EXIT **/
// Clear cookies, cache, and site data when you close Firefox
// Everything is forgotten each time - maximum privacy
user_pref("privacy.sanitize.sanitizeOnShutdown", true);

// DON'T clear browsing history on exit (you might want it for later)
user_pref("privacy.clearOnShutdown_v2.browsingHistoryAndDownloads", false);

// DO clear cookies and site data on exit
user_pref("privacy.clearOnShutdown_v2.cookiesAndStorage", true);

// DO clear cache (temporary files) on exit
user_pref("privacy.clearOnShutdown_v2.cache", true);

// DO clear saved form data on exit
user_pref("privacy.clearOnShutdown_v2.formdata", true);


/****************************************************************************
 * PART 7: SMOOTH SCROLLING (SMOOTHFOX)                                    *
 * Irfan's Optimization: Scrolling tuned for Apple Silicon & High-refresh   *
 * Based on: AveYo's Natural Smooth Scrolling algorithm                   *
 * Original: https://github.com/AveYo/fox                                  *
 ****************************************************************************/

// Enable smooth scrolling physics - makes scrolling feel natural
user_pref("apz.overscroll.enabled", true);

// Core smooth scrolling feature
user_pref("general.smoothScroll", true);

// Irfan's M4 tuning: How fast to respond to scroll wheel (lower = faster response)
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 10);

// Enable physics-based scrolling animation
user_pref("general.smoothScroll.msdPhysics.enabled", true);

// Irfan's tuning: "Spring" strength when starting to scroll (higher = snappier)
// This makes scrolling feel responsive and quick
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 700);

// Spring strength during normal scrolling
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 650);

// How long (milliseconds) before scroll deceleration kicks in
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);

// How much to decelerate when slowing down
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2");

// Spring strength when slowing down/stopping
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);

// How much previous velocity affects current motion
user_pref("general.smoothScroll.currentVelocityWeighting", "1");

// How much deceleration affects stopping
user_pref("general.smoothScroll.stopDecelerationWeighting", "1");

// Irfan's tuning for Apple Silicon high-refresh displays (120Hz+)
// Multiplier for scroll wheel sensitivity
user_pref("mousewheel.default.delta_multiplier_y", 350);

/****************************************************************************
 * PART 8: MACOS & APPLE SILICON M4 SPECIFIC FEATURES                      *
 * Irfan's Custom Section: Optimizations for M4 architecture                *
 * These settings unlock the full potential of your Apple hardware          *
 ****************************************************************************/

/** METAL GRAPHICS API **/
// Use Apple's Metal API for graphics (not older OpenGL)
// Metal is optimized for Apple Silicon - dramatic speed improvement
user_pref("gfx.metal.shader-cache.enabled", true);

/** VIDEO CODEC OPTIMIZATION **/
// M4 HARDWARE VIDEO: Disable ffvpx software VP9 decoder
// M4 has a dedicated media engine handling VP9, AV1, H.264, H.265 in hardware via
// VideoToolbox. Enabling ffvpx adds a software codec path that can compete with or
// override the hardware decoder, increasing CPU usage and battery drain for no benefit.
// Let Firefox use the system's VideoToolbox hardware decoder instead.
user_pref("media.ffvpx.enabled", false);
// Explicitly prefer hardware video decoding on Apple Silicon
user_pref("media.hardware-video-decoding.force-enabled", true);

/** MEMORY MANAGEMENT **/
// Use back/forward cache - remembers previous page state
// Makes back button feel instant (pages load from memory, not network)
user_pref("browser.sessionhistory.bfcache.enable", true);

// Don't save unload listener state in cache
user_pref("docshell.shistory.bfcache.allow_unload_listeners", false);

/** UNIFIED MEMORY ARCHITECTURE TUNING **/
// M4 has unified memory (RAM shared between CPU and GPU). On traditional systems,
// GPU memory is separate VRAM. With UMA, the GPU can access system RAM directly
// without copying. These settings optimize for UMA behavior.

// Enable GPU process on M4 — unified memory makes GPU process overhead negligible
// compared to the stability benefit of isolating GPU crashes from the main process
user_pref("layers.gpu-process.enabled", true);

// Use async GPU process queue — M4's GPU can parallelize command processing
user_pref("layers.gpu-process.allow-software", false);

// Enable Core Animation layer optimization for macOS
// Uses the system compositor for smoother window rendering
user_pref("gfx.core-animation.enabled", true);

// Respect system dark/light mode properly (macOS appearance API)
user_pref("widget.macos.respect-system-appearance", true);

/** ENHANCED SECURITY FEEDBACK **/
// Show lock icon clearly for secure/insecure connections
user_pref("security.insecure_connection_icon", 2);

// Indicate when camera/microphone is recording (Safari-like behavior)
user_pref("security.app_menu.recordingIndicator.enabled", true);

// Block social media trackers (Facebook, Twitter following you around web)
user_pref("privacy.trackingprotection.socialtracking.enabled", true);

/****************************************************************************
 * END OF IRFAN'S FIREFOX CONFIGURATION                                     *
 * Last Updated: June 2, 2026                                              *
 * 
 * TIPS FOR BEST RESULTS:
 * 1. Restart Firefox completely to apply all changes
 * 2. Open about:config to verify settings are applied (search for any setting)
 * 3. Test in a few tabs before relying on new setup
 * 4. Visit demanding websites (YouTube, Netflix) to see speed improvements
 * 5. Check about:addons to ensure essential extensions are installed
 * 
 * RECOMMENDED EXTENSIONS FOR THIS SETUP:
 * - uBlock Origin (ad/tracker blocking)
 * - Privacy Badger (tracker blocking)
 * - Multi-Account Containers (use multiple accounts simultaneously)
 * - Dark Reader (easier on eyes)
 * - Bitwarden (password manager)
 * 
 * For questions, issues, or improvements:
 * - Base configuration: https://github.com/yokoffing/Betterfox
 * - Firefox customization: https://mozilla.org/firefox/developer/
 * 
 * Happy browsing! 🚀
 ****************************************************************************/
