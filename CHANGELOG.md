# 📝 Change Log — Auralog

All notable changes to Auralog.

---

## v17 — [Current]
- 🔐 Encrypt Everything — AES‑256‑GCM on all tables
- 🔑 PIN hardened (PBKDF2 with salt, 310k iterations)
- 📜 Encrypted append‑only audit log (ADD, READ, LOGIN, LOGOUT, EXPORT)
- 🕒 Idle timeout auto‑lock (10 mins)
- ⚠️ Schema reset: legacy plaintext data purged
- ✨ UI polish: SymptomForm, MedicationReminder, DataManager, LogViewer themed with HEV/V

## v16
- Introduced secure audit logs table
- Wired `secureAdd` to start writing encrypted blocks
- Added Audit Viewer section to Data Manager

## v15
- Integrated encryption wrappers across trackers
- Added basic audit logging support
- Updated SecurityGate for stronger lock controls

## v14 & earlier
- Plaintext Dexie schemas
- Calorie/Weight/Sleep/Work loggers reactive but not secured
- First UX iterations with HEV Mk III / V themes
- Introduced StimmingSurface and Transcription
- Forge PWA cache, offline HTML
