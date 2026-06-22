## Dim 05: Next-Gen Content Architecture

### Content Model Evolution (SCORM → xAPI → JSON-native)

**SCORM is legacy — the standard has been frozen since 2009.** SCORM 2004 4th Edition remains the most widely deployed e-learning standard in 2026, but ADL has confirmed no further SCORM versions will be developed[^1]. The fundamental limitations are severe: browser-only runtime, same-origin restrictions, 64 KB `suspend_data` ceilings, no offline support, and no ability to track anything outside the course window[^2].

**xAPI (Experience API / Tin Can) 2.0** is the ADL's 2013 successor to SCORM. Instead of a JavaScript runtime tied to an LMS, xAPI is an HTTP-based REST API that records learning experiences as statements — Actor + Verb + Object + Result + Context — sent to a Learning Record Store (LRS)[^3]. xAPI can track: mobile apps, VR/AR simulations, on-the-job performance, external content (books, conferences), offline learning synced later, and cross-system learning journeys[^4].

**The critical gap in pure xAPI:** it does not define LMS launch behavior, course structure, or completion semantics. This is where **cmi5** becomes essential. cmi5 is an xAPI *profile* (not a separate standard) finalized in 2016 that adds SCORM-style course structure, a launch protocol, standardized completion verbs (`launched`, `initialized`, `completed`, `passed`, `failed`, `terminated`), and completion rules to xAPI[^5]. The US Department of Defense — the same organization that created SCORM — is promoting cmi5 as the official SCORM successor[^6]. In short: **cmi5 = xAPI's flexibility + SCORM's course structure**[^2].

**JSON-native content models** represent the next architectural leap beyond even cmi5. H5P content is a collection of HTML, CSS, and JavaScript files packaged as a ZIP archive (`.h5p`) with JSON semantics files defining the authoring interface and content structure[^7]. ObojoboNext (from UCF) delivers "every paragraph by individual modular plugins" — images, math, questions, widgets, videos — enabling JSON-driven course composition[^8]. The Open edX Blockstore project explored a deeply versioned, JSON-native content repository where learning objects are stored as typed data rather than HTML blobs[^9]. Modern Content Operating Systems (e.g., Sanity, Contentful) store content as strictly typed JSON, enabling granular access to specific fields for AI agents, translation bots, and compliance tools without parsing HTML markup[^10].

**Recommendation for Learnworld:**
1. Support SCORM 1.2/2004 as a *legacy compatibility layer* (iframe + API shim)
2. Adopt **cmi5** as the default content packaging standard for new content
3. Build a **JSON-native content engine** where lessons, quizzes, and interactive blocks are typed JSON documents with plugin-based renderers
4. Emit xAPI statements to a built-in LRS for all learning activities

---

### Video Architecture (AV1, WebRTC, ABR, Edge Delivery)

**AV1 (AOMedia Video 1)** is an open, royalty-free video codec developed by the Alliance for Open Media (Google, Netflix, Amazon, Cisco, Intel, Mozilla)[^11]. Key specifications for LMS platforms:

| Dimension | AV1 | H.264 (Current) | H.265/HEVC |
|---|---|---|---|
| Compression vs. H.264 | 30–50% better | Baseline | ~50% better |
| Licensing | Royalty-free | MPEG LA fees | Variable patent pools |
| Browser support | Chrome, Firefox, Edge natively | Universal | Limited |
| Hardware encode | Intel Tiger Lake+, NVIDIA RTX 30+, AMD RDNA2+ | Universal | Near-universal |
| Real-time encode | CPU-intensive; GPU-accelerated on new chips | Fast | Moderate |

AV1 is already being rolled out by Netflix and YouTube for select content. For cloud VSaaS (Video Surveillance as a Service), AV1 slashes upload volumes by up to 50% versus H.265, directly reducing bandwidth costs[^11]. For LMS platforms, the primary benefit is delivering high-quality educational video at lower bitrates — critical for learners on constrained networks in developing markets.

**Adaptive Bitrate Streaming (ABR)** is the standard for modern video delivery. The process involves encoding video at multiple bitrates (an "ABR ladder": 144p @ 250 kbps → 4K @ 15 Mbps), segmenting into small chunks (2–10 seconds), and serving a manifest file (HLS `.m3u8` or MPEG-DASH `.mpd`) that the player uses to switch quality dynamically based on bandwidth[^12]. **70% of viewers abandon a stream after just two buffering events** — making ABR implementation non-negotiable[^13].

**Content Delivery Networks (CDNs)** are essential for ABR. Modern CDN architectures for education should include:
- **Edge computing / MEC (Multi-Access Edge Computing):** Processing and caching at network edges reduces latency by up to 30% compared to traditional cloud-centric models[^14]
- **SDN-assisted routing:** Software-defined networking can optimize video segment selection based on real-time network conditions, improving QoE by 40% and reducing bandwidth usage by 63%[^15]
- **Hybrid P2P-CDN frameworks:** For live events, combining peer-to-peer delivery with CDN fallback can reduce backhaul traffic by 30%[^15]

**WebRTC for video** is a low-latency protocol (sub-200ms) ideal for live classrooms, but it is not a complete streaming solution. For Learnworld's video architecture, the recommended layered approach is:

| Use Case | Technology | Latency |
|---|---|---|
| On-demand course video | AV1 + HLS/DASH + CDN | 3–8s (acceptable) |
| Live lecture (1:100) | WebRTC SFU + simulcast | <500ms |
| Live classroom (interactive) | WebRTC SFU | <150ms |
| Large broadcast (>1000 viewers) | WebRTC ingest → RTMP → HLS | 3–8s |

**Recommended Learnworld video stack:**
- Encode source to AV1 (primary) + H.264 (fallback) + H.265 (middle-ground)
- Serve via HLS/DASH with Bunny.net or similar CDN
- For live sessions: WebRTC SFU (LiveKit or mediasoup) with simulcast
- Implement server-side recording via FFmpeg composite pipeline
- Store recordings in object storage with lifecycle policies (hot → cold tiers)

---

### Interactive Content (H5P, Custom Interactive Components, Simulations)

**H5P (HTML5 Package)** is an open-source, MIT-licensed framework for creating portable interactive content. It is arguably the most mature JSON-native interactive content architecture available today[^7].

**H5P Architecture:**
- Content is packaged as a ZIP archive (`.h5p`) containing HTML, JSON, JavaScript, and media files
- A `content.json` file defines the exercise content
- A `semantics.json` specification defines the authoring interface widgets
- The authoring interface is dynamically populated from the semantics file, making all content types configurable without code changes[^16]
- H5P content can be exported and reused across any H5P-compatible system (Drupal, WordPress, Moodle, Canvas, Brightspace, Blackboard)[^7]

**H5P Standalone:** The `h5p-standalone` library enables displaying H5P content *without* an H5P server — purely client-side with frame JS/CSS bundles and local content folders[^17]. This is critical for embedding H5P content in a custom LMS like Learnworld without requiring a full PHP/Node H5P backend.

**Content Types:** H5P supports 40+ content types including interactive video, branching scenarios, 360° virtual tours, AR scavenger hunts, drag-and-drop, timelines, crossword puzzles, and interactive books[^18]. Custom content types can be derived from existing ones by modifying JavaScript implementations and semantics files[^16].

**Beyond H5P:** Modern platforms are moving toward **component-based interactive architectures** where:
- Each interactive element (quiz, simulation, poll) is a self-contained JavaScript component
- Components communicate via xAPI statements to a central LRS
- Components expose a JSON schema for configuration
- Rendering is decoupled from tracking — any component can be replaced without affecting analytics

**Recommended Learnworld interactive stack:**
1. **H5P integration:** Use `h5p-standalone` to render H5P content as a first-class content block type
2. **Custom React/Vue interactive components:** Build native components (polls, simulations, code playgrounds) that emit xAPI statements
3. **xAPI statement normalization:** All interactive components (H5P + native) emit standardized xAPI to the Learnworld LRS
4. **Plugin registry:** Allow third-party developers to register interactive components via a JSON manifest + JS bundle

---

### Real-Time Collaborative Course Building (CRDTs, Yjs, Presence)

**The Core Problem:** When multiple users edit a document simultaneously, their operations must merge without data loss. Two fundamental approaches exist: **Operational Transformation (OT)** and **Conflict-free Replicated Data Types (CRDTs)**[^19].

**Operational Transformation (OT):** Used by Google Docs, Google Sheets, and Microsoft Office Online. OT transforms incoming operations before applying them to account for concurrent edits. The Jupiter model — a server-centric variant used by Google Docs — requires a central server to define canonical ordering[^20].

**CRDTs:** Used by Figma, Linear, Notion, Apple Notes, and Yjs-based apps. CRDTs are data structures designed so concurrent updates can be merged without needing a central server. Every update carries enough metadata (vector clocks or unique ID tags) that any two replicas can compute the same merged state independently[^19].

**Key comparison:**

| Dimension | OT (Google Docs) | CRDTs (Figma, Yjs) |
|---|---|---|
| Central server | Required | Not required |
| Offline support | Limited — needs rebase on reconnect | Excellent — automatic merge on reconnect |
| Implementation | High complexity (transform functions) | Moderate — libraries exist |
| Memory overhead | Low | Higher (tombstones, unique IDs) |
| Rich text | Mature | Improving (Yjs + Peritext) |
| Best for | Server-centric, always-online | Offline-first, peer-to-peer, local-first |

**Yjs** is the fastest CRDT implementation for web-based applications, created by Kevin Jahns. Performance: 26K to 156K operations per second for text editing. Uses the YATA algorithm and columnar encoding[^21]. Yjs provides:
- Rich editor bindings: CodeMirror, Monaco, Quill, ProseMirror, Tiptap
- Offline editing support via IndexedDB persistence (`y-indexeddb`)
- Version snapshots and undo/redo
- Shared cursors for multiplayer editing via the Awareness protocol
- WebSocket provider (`y-websocket`) and WebRTC provider (`y-webrtc`) for peer-to-peer sync[^22]

**ProseMirror/Tiptap Integration:** Learnworld already uses Tiptap for rich text. The `y-prosemirror` binding synchronizes ProseMirror's document state with Yjs's shared XML type. However, a 2026 controversy from Moment.dev highlighted that `y-prosemirror` destroys and recreates the entire DOM on every keystroke, impacting 60fps performance. An alternative is a 40-line server-authoritative approach using `prosemirror-collab` for simpler use cases[^23].

**Presence (Cursors, Selections, User Avatars):** Presence is *much easier* than document sync because it does not need convergence guarantees. Cursor position updates are ephemeral pub/sub messages — the newest one simply wins. This separation of concerns is critical: document content needs CRDT/OT, but presence needs only a lightweight pub/sub channel[^20].

**Recommended Learnworld collaborative stack:**
1. **Yjs + Tiptap/ProseMirror** for real-time collaborative text editing in course builder
2. **WebSocket provider** with Redis pub/sub for multi-server sync (a single Node.js process handles ~10K–15K concurrent WebSocket connections)
3. **Awareness protocol** for user presence, cursor positions, and selection highlights
4. **IndexedDB persistence** for offline editing — instructors can edit course content offline and sync on reconnection
5. **Document sharding** for large courses — split content into multiple Yjs documents per chapter/section

**Figma/Notion/Google Docs patterns applicable to course building:**
- **Optimistic local updates, server reconciliation:** Apply user edits immediately, send to server, rebase against concurrent changes[^20]
- **Separate channels by consistency requirement:** Course content (CRDT/strong), presence (pub/sub), chat messages (append-only log)
- **Event sourcing / operation log:** Store the complete ordered sequence of operations; the current document is a materialized view[^20]
- **Snapshot + log compaction:** Periodically freeze a checkpoint to avoid replaying the full history on load

---

### Live Session Architecture (Native WebRTC, Breakout Rooms, Whiteboard)

**Current State:** Most LMS platforms embed Google Meet or Microsoft Teams via iframe — this is not a native learning experience. It prevents real-time learning data capture (attendance, engagement, assessment) and breaks the pedagogical flow[^24].

**WebRTC Virtual Classroom Architecture:**

**1. Latency Trade-offs:**
- WebRTC peer-to-peer: <200ms latency, but breaks down beyond 6–8 participants
- WebRTC SFU (Selective Forwarding Unit): <300ms, scales to thousands of concurrent learners
- RTMP ingest + HLS delivery: 3–8s latency, acceptable for broadcast-only lectures[^24]
- **Hybrid architectures:** WebRTC for presenters/instructors, HLS for the audience — increasingly common in enterprise deployments[^25]

**2. SFU Selection for Learnworld:**

| SFU | Language | Pros | Cons |
|---|---|---|---|
| LiveKit | Go | Cloud-native, excellent docs, built-in recording, simulcast | Managed service cost |
| mediasoup | Node.js/C++ | Fine-grained control, hundreds of participants per server | Steeper learning curve |
| Janus | C | Extremely fast, battle-tested | Complex configuration |

A single SFU node handling 720p video typically supports 150–300 concurrent streams before CPU/bandwidth saturation. Plan around a **1:200 node-to-user ratio**, with auto-scaling at 60–70% utilization[^25]. Kubernetes-orchestrated media servers with stateless signaling layers allow horizontal scaling without session disruption[^25].

**3. Breakout Room Architecture:**
The correct architectural pattern is a **parent/child session model**, not separate rooms. Key requirements[^24]:
- A main session object contains child room objects
- The host (instructor) has elevated permissions spanning all child rooms
- Room assignments can be random, manual, or pre-set
- A server-side timer auto-closes breakout rooms and returns students to the main session
- The instructor can silently observe breakout rooms without participant notification (a feature Zoom does not offer)
- Each breakout room gets its own WebRTC session, whiteboard, and chat

**4. Real-Time Whiteboard:**
- HTML5 Canvas API renders strokes at 60fps
- Socket.io or WebRTC data channels broadcast coordinate data
- CRDT or Operational Transformation resolves conflicts for multi-user drawing[^24]
- Features: undo/redo, shape tools, text boxes, color palette, follow-teacher mode
- Whiteboard content persists after session for async review
- Server-side composite recording captures teacher video + whiteboard + screen share into a single stream via FFmpeg

**5. Engagement Scoring:**
A production virtual classroom for 10,000+ concurrent users tracked five signals: camera on/off status, quiz response time, chat participation, whiteboard interaction frequency, and attendance duration. Each student gets a 0–100 engagement score per session, with a real-time heatmap showing instructors which students are drifting[^26].

**6. Recording Architecture:**
- 720p H.264 produces ~1.5–2 GB per recorded hour
- Object storage (S3-compatible) with lifecycle policies: hot storage for 30–90 days, then cold tiers
- AI-generated transcripts with keyword search and chapter markers aligned to whiteboard page changes
- Access control via signed URLs tied to RBAC[^25]

**Recommended Learnworld live session stack:**
1. **LiveKit or mediasoup** as the SFU core, deployed on Kubernetes with regional clusters
2. **Hybrid delivery:** WebRTC for interactive sessions (up to 100 participants), HLS for broadcast lectures (>100)
3. **Parent/child session model** for breakout rooms with host monitoring and auto-timer
4. **Canvas-based whiteboard** with WebRTC data channels + CRDT sync layer
5. **FFmpeg composite recording** pipeline for automatic session capture
6. **Engagement scoring engine** tracking attendance, participation, and interaction signals
7. **TURN servers** for restricted networks; adaptive bitrate for low-bandwidth learners

---

### Content Interoperability & Portability

**Interoperability is the linchpin of the Next Generation Digital Learning Environment (NGDLE),** as defined by EDUCAUSE. The NGDLE vision describes a learning ecosystem not as a single monolithic LMS but as a "digital confederation of components" — a "Lego set" where standardized interfaces allow tools to plug in and exchange data[^27].

**Key Standards for Content Interoperability:**

**1. cmi5 (Content Launch & Tracking):**
cmi5 enables content to be hosted anywhere — CDNs, external servers, or cloud services — while the LMS launches it via a standardized protocol. The `cmi5.xml` file replaces the SCORM manifest, describing course structure and metadata. All learning data is sent to an LRS in xAPI format[^6]. This decouples content hosting from the LMS for the first time.

**2. LTI 1.3 + LTI Advantage (Tool Integration):**
LTI (Learning Tools Interoperability) from 1EdTech (formerly IMS Global) is the standard for connecting external tools into an LMS. **LTI 1.3** uses OAuth 2.0 + OpenID Connect + JWT for security (replacing the deprecated shared-secret model of LTI 1.1)[^28]. **LTI Advantage** is a set of services on top of LTI 1.3[^29]:
- **Deep Linking 2.0:** Instructors select and insert third-party content into courses with a few clicks
- **Names and Roles Provisioning Services (NRPS):** Secure class roster and role exchange
- **Assignment and Grade Services (AGS):** Rich grade synchronization between tools and LMS gradebooks

As of 2022, 1EdTech deprecated all LTI versions prior to 1.3. Major LMS platforms (Canvas, Blackboard, Moodle 4.0+, Brightspace, Schoology) have all adopted LTI 1.3 + Advantage[^30].

**3. Common Cartridge / Thin Common Cartridge:**
These are content manifest standards from 1EdTech that describe a package of learning assets (some local, some web-accessible). Common Cartridge supports LTI app launch links, enabling mash-ups of content and tools[^31].

**4. NGDLE Five Dimensions:**
EDUCAUSE defines five core functional dimensions that any interoperable learning platform must address[^27]:
1. **Interoperability and integration** — content exchange, tool integration, data aggregation
2. **Personalization** — learner-centric configuration, individual learning paths
3. **Analytics, advising, and learning assessment** — competency-based assessment, progress analytics
4. **Collaboration** — cross-disciplinary, cross-institutional collaboration
5. **Accessibility and universal design** — inclusive design for all learners

**Recommended Learnworld interoperability strategy:**
1. **Implement cmi5 as the default content packaging standard** for native Learnworld content
2. **Become an LTI 1.3 Advantage Tool Provider** — allow other LMS platforms (Canvas, Moodle, Blackboard) to launch Learnworld content and receive grade passback
3. **Become an LTI 1.3 Advantage Platform** — allow external tools (H5P, Turnitin, PhET simulations) to launch inside Learnworld with SSO and grade exchange
4. **Support Common Cartridge import/export** for bulk content migration
5. **Expose a public xAPI LRS endpoint** so external systems can query learning records
6. **Adopt JSON-native content schemas** so content can be programmatically transformed, exported, and indexed

---

### Content Versioning & Branching (Git-like for Courses)

**The Problem:** Current LMS platforms treat courses as monolithic documents. When an instructor makes a change, all learners immediately see the new version — there is no concept of branches, drafts, releases, or learner-bound snapshots. This is especially problematic for:
- Compliance training that must be audited by version
- Courses with active learners who should not see mid-course edits
- A/B testing different content versions
- Multi-tenant deployments where the same course has institution-specific variants

**Git Concepts Applied to Courses:**
Modern platforms are beginning to adopt software-style version control for learning content. The key concepts are[^32]:
- **Branching:** Create a `draft` branch for experimental edits while `main` (published) remains stable
- **Forking:** An institution forks a base course to create a customized variant
- **Merging:** Pull updates from the upstream course into the forked variant
- **Tagging:** Mark specific versions as "v2.3" or "Spring 2026 Release"
- **Commit history:** Full audit trail of who changed what and when
- **Diffs:** Visual comparison between versions

**Open edX's Blockstore and Learning Core:**
Open edX explored a content model with `LearningObject` → `LearningObjectVersion` → `Bundle` → `LearningContextVersion` → `LearningContextBranch`. This enables atomic publishing: changes are built on a staging branch and then flipped live instantly. It also allows multiple versions of the same library to coexist across different courses[^9].

**Event Sourcing for Course Content:**
Google Docs stores not the "current document" but the **operation log** — the complete ordered sequence of every operation ever applied. The current document is a materialized view computed by replaying the log. For courses, this enables:
- Full audit history
- Unlimited undo depth
- Revision history
- Time-travel to any past state
- Rebuilding from scratch if the materialized view is corrupted[^20]

Snapshot + log compaction periodically takes a frozen checkpoint to avoid replaying the full history on every load[^20].

**DominKnow | ONE LCMS Pattern:**
DominKnow uses "reuse with linking (not copying)." When a shared item (topic, graphic, glossary, simulation) changes, all linked courses inherit the update. Authors can create audience or modality variants from the same source without maintaining separate clones. For localization, multiple languages live within a single course structure[^33].

**Mexty / Authoring Platform Pattern:**
Modern authoring platforms support "co-creation, versioning, and reusable libraries." Updates can be pushed without disrupting learners already in progress[^32].

**Recommended Learnworld versioning architecture:**
1. **Git-native course storage:** Every course is a repository of JSON files + assets
2. **Branch model:** `main` (published), `draft` (authoring), `preview` (review), and institution-specific forks
3. **Content as event log:** Store every edit as an operation; the course is a materialized view
4. **Snapshot + compaction:** Daily checkpoints for fast loading; full log for audit trail
5. **Learner-bound versions:** When a learner enrolls, they are pinned to a course version. They see updates only when the instructor publishes a new release and opts them in
6. **Linked assets:** Shared components (disclaimers, question banks, media) are referenced by ID, not copied. Updates propagate automatically to all linked courses
7. **Diff visualization:** Instructors can see side-by-side comparisons before publishing
8. **Rollback:** One-click revert to any previous tagged version

---

### Citations

[^1]: "SCORM vs xAPI vs LTI: Which Standard Do You Need?" *Of Ash and Fire*, Feb 14, 2026. https://www.ofashandfire.com/blog/scorm-vs-xapi-vs-lti-elearning-standards-guide

[^2]: "SCORM 2004 vs xAPI (cmi5): Which E-Learning Standard Should Your LMS Use in 2026?" *T-Square*, May 13, 2026. https://tsquare.com.tr/scorm-2004-vs-xapi-cmi5-2026/

[^3]: "SCORM, xAPI, And LTI: What Every LMS Buyer Needs To Know In 2025." *eLearning Industry*, Aug 18, 2025. https://elearningindustry.com/scorm-xapi-and-lti-what-every-lms-buyer-needs-to-know

[^4]: "SCORM vs xAPI: which standard to choose." *isEazy*, Jun 10, 2026. https://www.iseazy.com/blog/scorm-vs-xapi/

[^5]: "cmi5: what is this new e-learning standard?" *Didask*, Mar 11, 2026. https://www.didask.com/en/post/cmi5-quel-est-ce-nouveau-standard-du-e-learning

[^6]: "SCORM, xAPI & LTI Explained: Standards Every Training Company Must Know." *Treesha Infotech*, Apr 21, 2026. https://treeshainfotech.com/blog/scorm-xapi-lti-explained-standards-training-companies

[^7]: "H5P - Portable Interactive Content in Drupal." *Group42*, https://www.group42.ca/h5p_portable_interactive_content_in_drupal

[^8]: "Next Generation Course Content for your LMS." *Obojobo*, https://next.obojobo.ucf.edu/

[^9]: "Determine LMS Content Data Model Design." *Open edX Core*, GitHub Issue #1, Feb 6, 2022. https://github.com/openedx/openedx-core/issues/1

[^10]: "AI CMS Architecture Explained." *LLM CMS*, Nov 29, 2025. https://www.llmcms.org/guides/ai-cms-architecture-explained

[^11]: "AV1 vs. H.264: The Ultimate Video Codec Comparison for 2025." *VideoSDK*, Jul 31, 2025. https://www.videosdk.live/developer-hub/social/av1-vs-h264

[^12]: "Adaptive Streaming Over CDN: What You Need to Know." *Blazing CDN*, May 16, 2024. https://blog.blazingcdn.com/en-us/adaptive-streaming-over-cdn-what-you-need-to-know

[^13]: "Adaptive Bitrate Streaming with CDN." *Blazing CDN*, Oct 22, 2025. https://blog.blazingcdn.com/en-us/adaptive-bitrate-streaming-with-cdn

[^14]: "Content Delivery Networks (CDNs) and live streaming." *WJARR*, 2025. https://wjarr.com/sites/default/files/fulltext_pdf/WJARR-2025-1849.pdf

[^15]: "Network-Assisted Delivery of Adaptive Video Streaming Services through CDN, SDN, and MEC." *ATHENA / Universität Klagenfurt*, Aug 22, 2023. https://athena.itec.aau.at/2023/11/network-assisted-delivery-of-adaptive-video-streaming-services-through-cdn-sdn-and-mec/

[^16]: "Combining Automatic Generation of Form-based Grammar Exercises from Authentic Texts with Language Aware Text Search." *Heck-21*, IWM Tübingen. https://sifnos.iwm-tuebingen.de/dm/papers/Heck-21.pdf

[^17]: "h5p-standalone: Display H5P content without the need for an H5P server." *GitHub / tunapanda*, Mar 24, 2026. https://github.com/tunapanda/h5p-standalone

[^18]: "Use H5P to create interactive content." *University of Warwick*, Mar 6, 2026. https://warwick.ac.uk/services/digitallearning/support/guides/moodle-guides/mdl-82/

[^19]: "Real-Time Collaborative Editing: OT and CRDTs Explained." *HashHackers*, Aug 15, 2023. https://blog.hashhackers.com/blog/realtime-collaborative-editing/

[^20]: "How Google Docs Real-Time Collaboration Works — OT vs CRDTs, Architecture, and the Engineering Nobody Explains." *Akshay Ghalme*, Apr 12, 2026. https://akshayghalme.com/blogs/how-google-docs-real-time-collaboration-works/

[^21]: "CRDTs and Real-Time Collaboration: Building Conflict-Free Distributed Systems." *Zylos Research*, Jan 29, 2026. https://zylos.ai/research/2026-01-29-crdt-real-time-collaboration

[^22]: "Offline, Peer-to-Peer, Collaborative Editing using Yjs." *ProseMirror Discuss*, Jan 27, 2020. https://discuss.prosemirror.net/t/offline-peer-to-peer-collaborative-editing-using-yjs/2488

[^23]: "Yjs Controversy: Are CRDTs Overkill for Collaboration?" *ByteIota*, Mar 16, 2026. https://byteiota.com/yjs-controversy-are-crdts-overkill-for-collaboration/

[^24]: "Building a Virtual Classroom Platform: Video, Whiteboard, Breakout Rooms, and Attendance Tracking." *Acquaint Soft*, May 20, 2026. https://acquaintsoft.com/blog/building-virtual-classroom-platform

[^25]: "Technical Requirements for Virtual Classroom Software." *WTT Solutions*, https://wtt-solutions.com/blog/virtual-classroom-software-development-complete-guide-to-building-educational-platforms

[^26]: "How We Built a Virtual Classroom Platform for 10,000+ Concurrent Users." *Geminate Solutions*, Mar 29, 2026. https://geminatesolutions.com/case-study/virtual-classroom-platform

[^27]: "The Next Generation Digital Learning Environment: A Report on Research." *EDUCAUSE / ELI*, https://www.digitallernen.ch/wp-content/uploads/eli3035.pdf

[^28]: "The history of LTI (Learning Tools Interoperability)." *Ed.link*, Feb 11, 2026. https://ed.link/community/the-history-of-lti-learning-tools-interoperability/

[^29]: "Learning Tools Interoperability (LTI): The Key to Seamless LMS Integration." *eLeaP Software*, Oct 24, 2025. https://www.eleapsoftware.com/glossary/learning-tools-interoperability-lti-the-key-to-seamless-lms-integration-and-smarter-learning-experiences/

[^30]: "LTI 1.1 and 1.3 with Advantage Compliant LMS Platforms." *CompTIA Help*, Mar 31, 2026. https://help.comptia.org/hc/en-us/articles/29155732825364-LTI-1-1-and-1-3-with-Advantage-Compliant-LMS-Platforms

[^31]: "Deeper dive on next generation digital learning environment (NGDLE) interoperability." *IMS Global Learning Consortium*, https://www.imsglobal.org/blog?p=254&page=8

[^32]: "Version Control in Training Design: Best Practices, Strategies, Tools, and What's Next." *Learning Elements*, May 20, 2026. https://learningelements.com.au/version-control-in-training-design-best-practices-strategies-tools/

[^33]: "11 Must-Know eLearning Authoring Tools… Revealed." *dominKnow*, May 14, 2026. https://dominknow.com/blog/10-must-know-elearning-authoring-tools-revealed
