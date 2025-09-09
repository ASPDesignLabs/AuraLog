# 🧑‍⚕️ Auralog  
**Personal Wellness & Accessible Health Tracking PWA**

Auralog is a **privacy‑first health and wellness tracker** built for individuals managing symptoms, routines, lifestyle habits, and accessibility needs. It is designed as a **Progressive Web App (PWA)** that works offline, stores all data locally, and is being developed toward **HIPAA alignment**.

---

## 🌱 Wellness Focus

- **Holistic Tracking:**  
  Track symptoms, nutrition, medication compliance, work, sleep, weight, and nicotine consumption.

- **Accessibility First:**  
  - 🎛️ Stimming tools  
  - 🎙️ Live transcription for auditory support  
  - 🎨 Multiple themes: Light, Dark, HEV Mk III (amber), and Cyberpunk V  

- **Supportive Companion:**  
  Auralog supports reflection and clinical conversations but is **not a medical device**.

---

## 🔒 Security & HIPAA Compliance Journey

Auralog is engineered to meet **HIPAA Security Rule technical safeguards**.

### ✅ Implemented:
- AES‑256‑GCM encrypted storage (no plaintext at rest).  
- PIN unlock (PBKDF2, 310k iterations, salted).  
- Passkey/Biometric unlock (FaceID, TouchID, Windows Hello).  
- Idle timeout → auto lock after inactivity.  
- Encrypted append‑only audit trail: ADD, READ, LOGIN/LOGOUT, EXPORT events.  
- Export logging: JSON + PDF exports are audit‑logged.

### 🚧 Pending Milestones:
- Immutable off‑device audit archival.  
- Cloud transmission security with TLS + BAA.  
- Documented admin safeguards (risk management, policy docs).  
- Secure wipe guarantees beyond IndexedDB `.clear()` limitations.

---

## 🛡️ HIPAA Compliance Roadmap  
*(45 CFR §164.312 Technical Safeguards)*

| Safeguard (HIPAA)                   | Requirement Summary                                                   | Current Implementation                                               | Status |
|-------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------|--------|
| **Access Control (§164.312(a))**    | Unique ID, emergency access, auto logoff, encryption/decryption      | PIN/Passkey unique auth, idle auto‑lock, AES‑256‑GCM, memory DEK only| ✅ |
| **Audit Controls (§164.312(b))**    | Record & examine system activity involving ePHI                      | Encrypted append‑only logs: ADD, READ, EXPORT, LOGIN/LOGOUT          | ✅ Phase 1; 🚧 Immutable off‑device archival |
| **Integrity (§164.312(c)(1))**      | Protect ePHI from improper alteration/destruction                    | AES‑GCM auth tags; append‑only logs                                  | ✅ basic; 🚧 external tamper‑proof backups |
| **Person/Entity Auth (§164.312(d))**| Verify persons accessing ePHI                                        | PIN (PBKDF2 strengthened), Passkeys/Biometrics                       | ✅ |
| **Transmission Security (§164.312(e))** | Protect ePHI when transmitted                                       | Local‑only PWA; no transmissions. 🚧 TLS + BAAs required if syncing  | 🚧 future |

**Legend:** ✅ Implemented — 🚧 Pending  

---

## 🧩 Current Modules

- 🔒 Security Gate (PIN/Passkey unlock)  
- 📊 Trackers: Calories, Weight, Sleep, Work, Nicotine  
- 🩺 Symptom Form  
- 💊 Medication Reminder  
- 🎛️ Stimming Surface  
- 🎙️ Transcription  
- 📄 Data Management (export, import, reset, passkey registration, audit viewer)  
- 📑 Log Viewer (theme‑aware cards with icons 🩺 🍽️ 🛏️ 💼 ⚖️ 🚬 💊)  
- 📄 PDF Exporter (structured report with audit logging)

---

## 🔖 Version History

**v17 (Current)**  
- Full AES‑256 encrypted records  
- PBKDF2‑hardened PIN login  
- Encrypted audit log (+ view in Data Manager)  
- Idle timeout auto‑lock  
- UI polish: SymptomForm, MedicationReminder, DataManager, LogViewer themed  

**v16** – Added initial audit log tables, secureAdd migration.  
**v15** – First audit trail writes, encryption wrappers.  
**v14 & earlier** – Plaintext Dexie, baseline PWA + theme polish (Light/Dark/HEV/V), first stimming and transcription tools.

---

## 🚦 Usage

Dev:
```bash
npm install
npm run dev
```

Build & Preview:
```bash
npm run build
npm run preview
```

Reset Database:
- Press “Reset DB” in Data Manager (exports recommended first).  
- Or bump Dexie schema version in `schema.js`.  
- Developer shortcut:  
  ```js
  indexedDB.deleteDatabase("HealthTrackerDB");
  ```

---

## 🙌 Contributing & Credits

Auralog stands entirely on the shoulders of giants. This project’s security, accessibility, and wellness support wouldn’t be possible without the incredible work of open source maintainers:

- **React** — Meta Open Source, core hooks/components.  
- **Vite** — Evan You & team for lightning‑fast PWA builds.  
- **Tailwind CSS** — Tailwind Labs, for design consistency and theme responsiveness.  
- **Dexie.js** — David Fahlander & contributors, for IndexedDB abstraction.  
- **Chart.js** — Chart.js community maintainers.  
- **jsPDF** — James Hall & contributors, for local PDF reports.  
- **Three.js** — Ricardo Cabello (mrdoob) & team, for beautiful meters.  
- **vite-plugin-pwa** — Anthony Fu, for offline readiness.  
- **Workbox** — Google Chrome team, for reliable service workers.  
- **react-speech-recognition** — James Brill & contributors, for accessibility.

💡 **Overwhelming credit goes to these authors and their communities**, whose free contributions have made it possible to deliver a HIPAA‑aimed, privacy‑centric wellness tracker in the open source spirit.

---

## ⚖️ Disclaimer

Auralog is **not a medical device**. It is intended for self‑tracking and self‑management, and to complement — not replace — medical guidance from professionals.

---

