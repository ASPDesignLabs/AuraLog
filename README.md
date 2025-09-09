# 🧑‍⚕️ Auralog  
**Personal Wellness & Accessible Health Tracking PWA**

Auralog is a **privacy‑first health and wellness tracker** built to empower individuals managing symptoms, routines, lifestyle habits, and accessibility needs. It runs as a **Progressive Web App (PWA)**, works offline, stores all data locally, and is being developed toward **HIPAA alignment**.

---

## 🌱 Wellness Focus

- **Holistic Tracking:** Log symptoms, nutrition, medication compliance, work, sleep, weight, and nicotine consumption.  
- **Accessibility First:** Stimming tools, live transcription, and theme customization (Light ☀️, Dark 🌙, HEV Mk III 🟧, Cyberpunk V 💾).  
- **Supportive Companion:** Auralog is *not a medical device*, but a self‑reflection tool to help patients and caregivers communicate better.  

---

## 🔒 Security & HIPAA Compliance Journey

Auralog is engineered around **HIPAA Security Rule safeguards (45 CFR §164.312)**.  

### ✅ Implemented
- AES‑256‑GCM encrypted records (no plaintext at rest).  
- PBKDF2‑hardened PIN unlock (310k iterations + unique salt).  
- Passkey/Biometric unlock (FaceID/TouchID/Windows Hello).  
- Idle timeout → auto‑lock.  
- Encrypted append‑only **audit trail** (ADD, READ, LOGIN, LOGOUT, EXPORT).  

### 🚧 Pending
- Immutable audit replication/archival.  
- Cloud transmission security (TLS + BAA) if sync added.  
- Secure wipe guarantee.  
- Administrative/organizational controls documentation.  

---

## 🛡️ HIPAA Compliance Roadmap (45 CFR §164.312)

| Safeguard | Requirement | Current Implementation | Status |
|-----------|-------------|------------------------|--------|
| **Access Control (§164.312(a))** | Unique ID, auto logoff, encryption | PIN/Passkey auth, idle auto‑lock, AES‑GCM enc, DEK in memory only | ✅ |
| **Audit Controls (§164.312(b))** | Record/examine ePHI activity | Local encrypted audit logs: ADD, READ, EXPORT; LOGIN/LOGOUT | ✅ local 🚧 immutable off‑device |
| **Integrity (§164.312(c))** | Prevent improper alteration | AES‑GCM auth tags; append‑only logs | ✅ basic 🚧 tamper‑proof external retention |
| **Authentication (§164.312(d))** | Verify users/entities | PBKDF2 PIN + Passkeys/Biometrics | ✅ |
| **Transmission Security (§164.312(e))** | Protect ePHI in transit | Local‑only now; will require TLS + BAA for any sync | 🚧 pending |

Legend: ✅ Implemented — 🚧 Pending milestone  

---

## 💻 Requirements / Prerequisites

To build and run locally you’ll need:

- **Node.js** v18+ (with npm/yarn/pnpm).  
- **Git** (to clone repository).  
- **A modern browser** with PWA, service worker, and WebAuthn support.  
- Recommended dev tools:  
  - [VS Code](https://code.visualstudio.com/) + Tailwind IntelliSense  
  - [React DevTools](https://react.dev/tools)  
  - `gh-pages` for GitHub Pages deployment (`npm install gh-pages --save-dev`).  

---

## 🌐 HTTPS Requirement

PWAs require HTTPS for installation and sensitive APIs:

- **Local dev** (`npm run dev`): works on `http://localhost` (special secure context).  
- **Deployment**: you must serve via **HTTPS** (GitHub Pages, Netlify, Vercel, or your SSL server).  

Without HTTPS:
- Service workers (offline/download) won’t run.  
- Install prompt (“Add to Home Screen”) won’t appear.  
- Passkeys/biometric login won’t function.  

⚠️ HIPAA note: Transmission Security (§164.312(e)) requires TLS for any remote sync.  

---

## 🧩 Current Modules

- 🔒 **SecurityGate**: PIN/Passkey unlock, idle auto‑lock  
- 📊 **Meters**: Calories (Three.js ring), Weight (progress bar), Sleep, Work, Nicotine  
- 🩺 **Symptom Form** (pain, HR, emotional, sensory, meds, notes)  
- 💊 **Medication Reminder**  
- 🎛️ **Stimming Surface** (haptic profiles)  
- 🎙️ **Transcription** for auditory support  
- 📄 **Data Manager** (export/import, reset, passkey register, install/update, cache offline, audit trail)  
- 📑 **Log Viewer** (theme‑aware cards with icons 🩺 🍽️ 🛏️ 💼 ⚖️ 🚬 💊)  
- 📄 **PDF Exporter** (secure report generation, audit logged)  

---

## 🔖 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed technical history.  

**v17 (Current):**  
- Full AES‑256 encryption, PBKDF2 PIN derivation  
- Idle timeout auto‑lock  
- Encrypted audit logs + Audit Trail viewer  
- HEV/V theme polish across SymptomForm, MedicationReminder, DataManager, LogViewer  

---

## 💻 Requirements / Dependencies

To build and run Auralog you need:

### System Prerequisites
- **Node.js v18+** — JavaScript runtime needed for Vite, React build tools.  
- **npm** (bundled with Node) or **yarn/pnpm** — dependency manager.  
- **Git** — to clone the repository.  
- **A modern browser** (Chrome, Firefox, Safari) with support for:
  - Service Workers (for offline/PWA install),
  - WebAuthn/Passkeys (for biometric login).

### Runtime Dependencies (used in the app)
These packages are installed under `"dependencies"` in `package.json`:

- **react** / **react-dom**: React core libraries for UI and rendering.  
- **dexie**: IndexedDB wrapper used as Auralog’s encrypted local database.  
- **crypto-js**: Used for PIN hashing (SHA‑256) before key derivation.  
- **chart.js**: Graphing library for metrics visualization (calories, sleep, etc).  
- **jspdf**: Generate encrypted PDF health reports locally, no server round‑trip.  
- **html2canvas**: Capture DOM elements for export/report visuals.  
- **three**: 3D visualization library (calorie ring, weight bar progress meter).  
- **react-speech-recognition**: Provides microphone transcription hooks for accessibility.  
- **workbox-build**: Used to build service workers for caching/offline PWA support.

### Development Dependencies (tooling for dev/build/lint)
These packages live under `"devDependencies"`:

- **vite**: Modern dev server + bundler.  
- **@vitejs/plugin-react**: Adds React fast refresh support to Vite.  
- **vite-plugin-pwa**: PWA manifest + service worker auto‑integration.  
- **tailwindcss**: Utility‑first CSS framework for responsive theming.  
- **postcss**: CSS transformer required by Tailwind.  
- **autoprefixer**: Adds vendor prefixes to CSS.  
- **typescript**: TypeScript support.  
- **@types/react** / **@types/react-dom**: TypeScript React typings.  
- **eslint**: Linter for quality control.  
- **@eslint/js**: ESLint recommended base rules.  
- **typescript-eslint**: ESLint TypeScript integration.  
- **eslint-plugin-react-hooks**: Ensures proper hook usage.  
- **eslint-plugin-react-refresh**: Ensures React Fast Refresh compatibility.  
- **globals**: Predefined ESLint globals list.

---

## ⚙️ Install & Run

Clone and install all dependencies:

```bash
git clone https://github.com/ASPDesignLabs/auralog.git
cd auralog
npm install
```

Run locally for development:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
npm run preview
```

---

## 🌐 HTTPS Requirement

PWAs require HTTPS (or `localhost`) for install:

- Local dev: `http://localhost:5173` works fine.  
- Production: deploy to **HTTPS URL** (GitHub Pages, Netlify, Vercel, or server with SSL).  

Without HTTPS Auralog cannot be installed, service workers won’t run, and passkeys won’t work.
```

Reset DB if schema migrated:

```bash
indexedDB.deleteDatabase("HealthTrackerDB");
```

or press “Reset Database” in Data Manager (export first!).  

---

## 🙌 Contributing & Credits

Auralog exists because of the open source community. Enormous thanks to the maintainers of:

- [**React**](https://react.dev/) — Meta Open Source  
- [**Vite**](https://vitejs.dev/) — Evan You & Vite team  
- [**Tailwind CSS**](https://tailwindcss.com/) — Tailwind Labs  
- [**Dexie.js**](https://dexie.org/) — David Fahlander & contributors  
- [**Chart.js**](https://www.chartjs.org/) — Chart.js community  
- [**jsPDF**](https://github.com/parallax/jsPDF) — James Hall & contributors  
- [**Three.js**](https://threejs.org/) — Ricardo Cabello (mrdoob) & core team  
- [**Vite Plugin PWA**](https://vite-pwa-org.netlify.app/) — Anthony Fu  
- [**Workbox**](https://developer.chrome.com/docs/workbox/) — Chrome team  
- [**react-speech-recognition**](https://www.npmjs.com/package/react-speech-recognition) — James Brill & contributors  

💡 This project amplifies their generosity. **Credit belongs to them.**  

---

## ⚖️ Disclaimer

Auralog is not FDA‑cleared or a medical device. It is **for self‑management & reflection**, and should **complement — not replace — professional medical guidance**.

