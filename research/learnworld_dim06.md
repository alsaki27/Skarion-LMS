## Dim 06: Mobile-First & Offline-First Architecture

### PWA Strategy (why PWA over native for affordability)

In 2026, Progressive Web Apps (PWAs) have reached near-native capability on both iOS and Android, making them the optimal strategic choice for Learnworld. Building and maintaining separate native iOS and Android apps typically costs $60,000–$250,000+ and requires ongoing app store approvals, while a PWA reduces development costs by 30–50% with a single codebase serving all platforms [^1]. For LMS/education platforms specifically, white-label native apps from competitors like Thinkific and Kajabi cost $199+/month—expenses that directly erode creator margins. A PWA approach eliminates app store commissions, enables instant updates without review delays, and provides full SEO discoverability [^2].

PWAs bridge the gap between web and native without separate codebases. They support installability on home screens, offline functionality, push notifications, and hardware access (camera, microphone, geolocation) through modern browser APIs [^3]. For content-heavy platforms like Learnworld—where the primary interaction is consuming courses, videos, PDFs, and quizzes—the PWA covers 95%+ of required features at a fraction of native cost [^4].

Key metrics from real-world PWA deployments reinforce this choice: Twitter Lite reduced data usage by 70% and increased pages per session by 65%; Starbucks' PWA is 99.84% smaller than its iOS app and drove a 23% increase in daily active users; Pinterest saw a 60% engagement increase and 44% ad revenue growth after launching their PWA [^5].

| Factor | PWA | Native (iOS + Android) |
|--------|-----|------------------------|
| Development Cost | $15K–$90K | $120K–$250K+ |
| Codebase | Single | Separate per platform |
| Update Deployment | Instant | 1–7 days app store review |
| App Store Commission | $0 for digital goods | 15–30% |
| Install Friction | Low (browser prompt) | High (store download) |
| SEO/Discoverability | Full web indexing | App store only |

### Offline Storage Architecture (IndexedDB, OPFS, Cache API)

Learnworld's offline-first architecture requires a tiered storage strategy combining multiple browser APIs:

**Cache API** — The foundation for offline serving. Service workers intercept network requests and cache responses. The Cache API is ideal for static assets (app shell, CSS, JS, HTML) and API responses. Chrome allows up to ~60% of available disk space per origin; Firefox up to ~50%; Safari is more restrictive [^6].

**IndexedDB** — A structured, asynchronous object store ideal for application data: user profiles, course progress, quiz scores, metadata, and JSON content. Practical limits reach multiple GB on desktop Chrome, but iOS Safari caps usage more aggressively. IndexedDB works well for structured data but has overhead for binary file operations [^7].

**Origin Private File System (OPFS)** — The newest and most powerful storage primitive. OPFS provides a real sandboxed file system with byte-level read/write access, directories, and files. It is 3–4x faster than IndexedDB for large file operations and is ideal for storing video files, PDFs, and large binary content [^8]. OPFS synchronous access handles are only available in Web Workers, so the database layer must run in a Worker and communicate via `postMessage` or Comlink [^9].

**Recommended Storage Allocation for Learnworld:**

| Content Type | Storage API | Rationale |
|--------------|-------------|-----------|
| App shell, CSS, JS | Cache API | Fast retrieval, versioned by service worker |
| Course metadata, quiz data, progress | IndexedDB | Structured queries, indexes, transactional |
| Video files, PDFs, large binaries | OPFS | High-performance streaming, large file support |
| User settings, auth tokens | localStorage | Simple key-value, small footprint |

**Storage Quotas (2026):**
- Chrome/Edge: ~60% of available disk space per origin
- Firefox: ~50% of disk after persistence request
- Safari: Dynamic, but effectively 50MB cap in many scenarios; aggressive cleanup under storage pressure [^10]

To prevent data loss, call `navigator.storage.persist()` to request persistent storage, which prevents automatic eviction under disk pressure (though browsers may still clear data in private browsing or aggressive iOS cleanup). Always use `navigator.storage.estimate()` to monitor usage and quota [^11].

### Background Sync & Conflict Resolution

The Background Sync API queues failed requests and retries when connectivity returns. However, critical platform limitations exist:

- **Android/Chrome**: Full Background Sync support. Periodic Background Sync also works for scheduled updates.
- **iOS Safari**: **Background Sync is NOT supported** as of 2026. Failed requests must be queued manually and retried on `online` events or when the app regains visibility [^12].

For Learnworld, implement a **write-behind queue** pattern: all offline writes (quiz submissions, progress updates, notes) are stored in IndexedDB with a `pending_sync` flag. When the app detects `navigator.onLine` or the `visibilitychange` event fires to `visible`, drain the queue in order. Use idempotent operations to prevent duplicates on retry [^13].

**Conflict Resolution Strategy:**
For an LMS where learners primarily write their own progress/quiz data and read course content, conflicts are typically low-frequency. A **Last-Write-Wins (LWW)** strategy with server-side timestamps is sufficient for most use cases. For collaborative features (shared notes, group projects), adopt **CRDT-based merge** (see next section) or implement:
1. Timestamp-based reconciliation (server clock wins)
2. Per-field merge logic (e.g., quiz scores accumulate rather than overwrite)
3. Tombstones for deletions (never hard-delete offline, mark as deleted and sync)

**Sync Integrity:** Implement payload checksums/ETags, retry with exponential backoff (capped at 24 hours), and surface a subtle UI indicator for pending syncs. Never block the UI on sync—that defeats the purpose of offline-first [^14].

### Offline Video & Content Delivery

Video is the largest and most challenging content type for offline LMS use. Modern approaches include:

**HLS/DASH Segment Caching**: Most educational video is delivered via HLS (HTTP Live Streaming) using `.m3u8` manifests and small `.ts` or `.m4s` segments. The service worker can intercept segment requests and cache them. For offline playback, pre-cache the manifest and all segments for a selected lesson, or cache segments as the learner watches (progressive caching) [^15].

**OPFS for Video Storage**: Store downloaded video segments as actual files in OPFS rather than IndexedDB blobs. This enables streaming playback via Media Source Extensions (MSE) directly from OPFS file handles, avoiding memory bloat. OPFS provides 3–4x better sequential write performance than IndexedDB, critical for multi-GB course downloads [^16].

**Background Fetch API**: For large video downloads initiated by the user (e.g., "Download this course for offline"), use the Background Fetch API. It delegates downloading to the browser engine, allowing pause/resume on flaky connections, progress UI in the browser's download manager, and completion even if the PWA is closed. **Limitation**: Background Fetch is not supported on iOS Safari [^17].

**Adaptive Quality Selection**: For offline downloads, allow learners to choose quality (e.g., 720p vs 1080p). A 10-minute 1080p video may be ~500MB; the same at 720p may be ~250MB. Present storage estimates before download [^18].

**Recommended Architecture:**
1. User selects "Make available offline" for a course
2. App fetches the HLS manifest, parses available renditions
3. User selects quality level; app calculates total size
4. App downloads segments via service worker + Cache API or OPFS
5. For playback offline, read segments from cache/OPFS and feed to MSE or a custom video player
6. When online, prefer network streaming but keep offline cache as fallback

### Real-Time Sync When Online (CRDT, Yjs, differential sync)

When learners are online, Learnworld can provide real-time features: live Q&A, collaborative notes, shared annotations, or instructor-led sessions. For these scenarios, **CRDTs (Conflict-Free Replicated Data Types)** provide the mathematically robust foundation.

**CRDTs** guarantee that all replicas converge to the same state without requiring a central coordination server. They are ideal for offline-first apps because changes made locally always converge correctly when synced [^19].

**Yjs** is the most performant sequence CRDT for JavaScript, built for shared text editing and ideal for collaborative documents, notes, and annotations. It uses a binary encoding with garbage collection, making it more memory-efficient than JSON-based CRDTs like Automerge for large documents. Yjs supports multiple network providers (WebSocket, WebRTC) and has a massive ecosystem [^20].

**For Learnworld's specific needs:**
- **Quiz/Assessment progress**: Differential sync with delta updates. Only sync changed fields (e.g., `question_3_answer: "B"`) rather than full documents. Use a sync cursor or vector clock to track what's already been sent.
- **Collaborative notes/whiteboards**: Yjs with `Y.Text`, `Y.Map`, or `Y.Array` depending on data structure. Use `y-websocket` provider for server relay or `y-webrtc` for peer-to-peer.
- **General course data**: For non-collaborative, user-specific data (progress, bookmarks), a simple **operation-based sync** with a local-first queue is lighter than full CRDTs. Libraries like **RxDB** or **PowerSync** offer pre-built sync engines with offline-first guarantees and conflict resolution [^21].

**Metadata Bloat Warning**: CRDTs track history and unique IDs for every piece of data, which can cause metadata to grow to 10x the data size under high-concurrency move operations. Implement periodic garbage collection and compaction, but balance this against the need to sync devices that have been offline for extended periods [^22].

### Push Notifications & Engagement

Push notifications are critical for re-engagement: course deadlines, new content alerts, instructor announcements, and study reminders.

**Android/Chrome**: Web Push API + Firebase Cloud Messaging (or VAPID directly) works reliably with 90–95% delivery rates. Rich notifications with actions and images are supported [^23].

**iOS Safari**: 
- Supported on iOS 16.4+ (March 2023) **only after the user installs the PWA to the home screen**.
- Delivery rates are approximately 70–85% compared to Android, due to stricter background process management and subscription loss after prolonged inactivity [^24].
- iOS cancels the push subscription if the service worker receives push events but does not display a notification. Always call `showNotification` inside `event.waitUntil` [^25].

**EU Digital Markets Act (DMA) Impact**: As of iOS 17.4 (March 2024), Apple removed standalone PWA support in the EU. PWAs in EU countries open in Safari tabs, and push notifications do not work. This is a major strategic consideration: EU iOS users will need an alternative engagement channel (email, SMS) or a native app wrapper [^26].

**Best Practices:**
- Use two-step consent: ask in-app first, then trigger the browser permission prompt. Single-stage prompts get rejected more often.
- Check subscription validity on every app launch and re-subscribe if needed.
- For iOS, show clear "Add to Home Screen" instructions; there is no automatic install prompt.
- Implement a notification preference center so users can control which alerts they receive.

### Capacitor Fallback (for native features if needed)

While a PWA-first strategy covers the vast majority of Learnworld's needs, there are scenarios where a thin native wrapper is beneficial:

1. **EU iOS users** who need push notifications and home screen app behavior
2. **App Store discoverability** as a secondary acquisition channel
3. **Native hardware features** not available to PWAs (advanced biometrics, Bluetooth, NFC)
4. **Deep iOS integration** (widgets, Siri shortcuts, live activities)

**Capacitor** (by Ionic) is the recommended fallback. It is not a simple wrapper—it generates real native iOS/Android projects with a WebView, then bridges web code to native APIs via plugins. Key advantages:
- **Same codebase**: 90%+ code reuse between PWA and native apps
- **Native plugins**: Camera, filesystem, push notifications, biometrics, secure storage, and 100+ community plugins
- **App store distribution**: Native binaries for Apple App Store and Google Play
- **PWA built-in**: Capacitor has first-class PWA support; the same plugins work across web and native contexts with identical APIs [^27]

**Migration path**: Build the PWA first. If iOS limitations or business needs demand it, initialize Capacitor in the existing project (`npx cap init`), add iOS/Android, and sync web assets. Only add native plugins where needed. This "PWA-first, native-later" approach validates the market before committing to native build costs [^28].

Alternative: **Bubblewrap** (Trusted Web Activity) for Android-only store presence. It is lighter than Capacitor but only provides web APIs with no native bridge [^29].

### iOS-specific considerations

iOS remains the most restrictive platform for PWAs. In 2026, the following limitations directly impact Learnworld's architecture:

| Feature | iOS Status | Impact on Learnworld |
|---------|------------|----------------------|
| Service Workers | Supported | Core caching works |
| Push Notifications | iOS 16.4+, home screen install required | Re-engagement possible but lower delivery rates |
| Background Sync | **Not supported** | Must sync on `online`/`visibilitychange` events |
| Background Fetch | **Not supported** | Large video downloads must happen while app is open |
| Storage Quota | ~50MB effective cap | Limits offline content volume per course |
| 7-Day Cache Expiry | All cached data deleted after 7 days inactivity | Offline content must be re-downloaded; learners on vacation lose caches |
| Standalone Mode | Works (non-EU) | App-like feel after home screen install |
| Web Bluetooth / NFC | Not supported | Not needed for core LMS |
| EU (DMA) | No standalone, no push, opens in Safari | EU iOS users get degraded experience |

**Mitigation Strategies:**
1. **Re-cache on every launch**: On `load`, check if critical caches exist and re-populate them. Do not assume cached data persists.
2. **Server-side truth**: Treat the server as the source of truth. Client cache is a performance optimization, not durable storage. Sync progress aggressively when online.
3. **Storage awareness**: Show the learner how much storage is available (`navigator.storage.estimate()`). Allow them to manage downloaded content and delete completed courses to free space.
4. **Quality selection**: Default to lower video quality for offline download on iOS to maximize available content within 50MB.
5. **Prompt for home screen install**: Provide clear, step-by-step UI guidance for iOS users to "Add to Home Screen"—there is no native prompt.
6. **Capacitor bridge for EU iOS**: If the EU market is significant, a Capacitor-native app is the only way to deliver push notifications and standalone mode to EU iOS users.

### Real-World LMS/Education PWA Precedents

- **Moodle**: The open-source LMS has integrated PWA capabilities for offline access and mobile learning, demonstrating growing academic acceptance [^30].
- **EdTech PWA case study**: An offline-capable PWA boosted learner retention by 35% in documented education deployments [^31].
- **Field-based LMS**: Organizations using PWAs for distributed retail teams and sales enablement report that service workers + IndexedDB are sufficient for microlearning and compliance training, though iOS limitations require workarounds for heavy offline video [^32].
- **xAPI-enabled sync**: Modern mobile LMS apps use xAPI (Experience API) with local data queues to track learner actions offline, syncing to the Learning Record Store (LRS) when online. This is a proven pattern for enterprise learning ecosystems [^33].

### How Much Content Can Be Stored Offline?

The practical answer depends on the browser and device:

- **Android/Chrome**: 1GB to 50GB+ possible depending on device free space. Chrome allocates up to 60% of disk space per origin. A learner could theoretically download dozens of hours of 720p video.
- **iOS Safari**: Effectively 50MB. While Safari supports IndexedDB and Cache API, aggressive Intelligent Tracking Prevention (ITP) and storage pressure policies make it unreliable for more than lightweight app shells and metadata. Large video offline libraries are not practical on iOS PWA.
- **Desktop (all browsers)**: Multiple GB are typical. OPFS + persistent storage can hold full course libraries.

**Recommendation**: Design for a tiered model:
- **Always available**: Course structure, text content, quiz metadata, user progress (under 10MB total)
- **On-demand download**: Video lessons, PDFs, large assets (user-initiated, with storage warnings)
- **Streaming preferred**: Live content, supplementary videos, community discussions

### How to Handle Video Sync When Offline → Online

When a learner goes from offline to online, the sync strategy for video content must be carefully architected:

1. **Do not sync video files**: Video content is typically read-only and instructor-generated. It does not change based on learner actions. The only sync needed is the learner's **progress timestamp** (e.g., "watched up to 12:34 of Lesson 3"). This is a tiny JSON payload.
2. **Progress-first sync**: When connectivity returns, immediately sync progress timestamps, quiz submissions, and completion flags. These are small, high-priority operations.
3. **Content update detection**: On reconnect, check if course content has been updated by the instructor. If so, invalidate cached segments and notify the learner. Use ETags or content hashes to detect changes efficiently.
4. **Resume downloads**: If a video download was interrupted by going offline, resume from the last fetched segment using HTTP Range requests. The service worker or OPFS can track which segments are already stored.
5. **Background sync for progress**: On Android, use Background Sync to upload progress even if the app is closed. On iOS, progress uploads only happen when the app is opened and online.

### Citations

[^1]: GitNexa, "PWA vs Native App Development: Complete 2026 Guide," May 2026. https://www.gitnexa.com/blogs/pwa-vs-native-app-development
[^2]: GemProgrammers, "Progressive Web App Development in Germany (2026 PWA vs Native Guide)," June 2026. https://gemprogrammers.com/pwa-development-germany/
[^3]: Digital Applied, "Progressive Web Apps 2026: Complete Development Guide," January 2026. https://www.digitalapplied.com/blog/progressive-web-apps-2026-complete-development-guide
[^4]: AppForge, "PWA vs Native App in 2026 — Which Should You Choose?," January 2026. https://appforge.hu/en/blog/pwa-vs-native-app-2026/
[^5]: MediaPlus, "What Is a Progressive Web App (PWA)? Complete Guide [2026]," May 2026. https://mediaplus.com.sg/what-is-a-progressive-web-app-pwa/
[^6]: Aunimeda, "PWA vs нативное приложение: что выбрать бизнесу в Бишкеке в 2026," May 2026. https://aunimeda.com/kg/blog/pwa-vs-nativnoe-mobilnoe-prilozhenie-bishkek
[^7]: Grep results from multiple sources on IndexedDB quotas; see also MDN Storage API documentation.
[^8]: RxDB, "Supercharged OPFS Database with RxDB," April 2026. https://rxdb.info/rx-storage-opfs.html
[^9]: GGames, "Why SQLite Is Taking Over the Browser," April 2026. https://ggames.mobi/blog/2026/04/12/why-sqlite-is-taking-over-the-browser/
[^10]: MagicBell, "PWA iOS Limitations and Safari Support [2026]," March 2026. https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide
[^11]: Zhang-Jane, "浏览器端大文件存储指南," April 2026. https://zhang-jane.github.io/post/4c9f2d1a.html
[^12]: Microsoft Edge Docs, "Synchronize and update a PWA in the background," December 2025. https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/background-syncs
[^13]: GTC Systems, "Data Synchronization in PWAs: Offline-First Strategies and Conflict Resolution," June 2026. https://gtcsys.com/insights/blogs/data-synchronization-in-pwas-offline-first-strategies-and-conflict-resolution/
[^14]: Educative, "How to do offline data sync in PWA," August 2023. https://www.educative.io/answers/how-to-do-offline-data-sync-in-pwa
[^15]: Cutfa.st, "How to Download Any HLS Stream From a Website in 2026," May 2026. https://cutfa.st/blog/download-hls-stream-from-website-no-ffmpeg-2026-en
[^16]: Apurv Khare, "OPFS: The Origin Private File System — A Real File System in the Browser," February 2026. http://apurvkhare.com/articles/frontend/web-storage/opfs
[^17]: Microsoft Edge Docs, "Background Fetch API," referenced in December 2025 background sync guide.
[^18]: Eleap Software, "Offline Learning in LMS: Practical Strategies to Teach, Train, and Track Without the Internet," October 2025. https://www.eleapsoftware.com/glossary/offline-learning-in-lms-practical-strategies-to-teach-train-and-track-without-the-internet/
[^19]: Vocal Media, "Mastering Offline First Data Sync with CRDTs in 2026," January 2026. https://vocal.media/01/mastering-offline-first-data-sync-with-crd-ts-in-2026
[^20]: PowerSync, "Why Cinapse Moved Away From CRDTs For Sync," October 2025. https://powersync.com/blog/why-cinapse-moved-away-from-crdts-for-sync
[^21]: SyncedStore, "Introduction to SyncedStore," 2026. https://syncedstore.org/docs/
[^22]: Vocal Media, "Mastering Offline First Data Sync with CRDTs in 2026," January 2026.
[^23]: GemProgrammers, "Progressive Web App Development in Germany (2026 PWA vs Native Guide)," June 2026.
[^24]: Webscraft, "PWA Push Notifications on iOS in 2026: What Really Works," March 2026. https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en
[^25]: Webscraft, "PWA Push Notifications on iOS in 2026: What Really Works," March 2026.
[^26]: MagicBell, "PWA iOS Limitations and Safari Support [2026]," March 2026.
[^27]: CapacitorJS, official documentation. https://capacitorjs.com/
[^28]: Capgo, "Transform Your PWA to a Native App with Capacitor," June 2026. https://capgo.app/blog/transform-pwa-to-native-app-with-capacitor/
[^29]: Flex, "Bubblewrap vs Capacitor: My 2-Year Test Results," February 2026. https://www.flex.com.ph/articles/bubblewrap-vs-capacitor-my-2-year-test-results
[^30]: TheAcademic, "The Role of Progressive Web Apps in Enhancing Educational..." (PDF), July 2025. https://theacademic.in/wp-content/uploads/2025/07/28.pdf
[^31]: Naveck, "Web Development – Education & EdTech." https://www.naveck.com/services/web-development/
[^32]: GO-Globe, "7 Ways To Make Your LMS Perfect For Mobile Users," June 2026. https://www.go-globe.com/ways-to-make-your-lms-perfect-for-mobile-users/
[^33]: GO-Globe, "7 Ways To Make Your LMS Perfect For Mobile Users," June 2026.
