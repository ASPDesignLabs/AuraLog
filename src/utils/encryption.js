import { db } from "../db/schema.js";

/* -------------------------------------------------------------------------- */
/*                            AES-GCM Core Helpers                            */
/* -------------------------------------------------------------------------- */

export async function encryptData(data) {
  if (!window.sessionDEK) throw new Error("DB locked, auth required.");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    window.sessionDEK,
    encoded
  );
  return { iv: Array.from(iv), data: Array.from(new Uint8Array(ciphertext)) };
}

export async function decryptData(encrypted) {
  if (!window.sessionDEK) throw new Error("DB locked, auth required.");

  // ✅ Guard against old plaintext records / malformed rows
  if (!encrypted || !encrypted.iv || !encrypted.data) {
    console.warn("⚠️ Skipping malformed/legacy record:", encrypted);
    return null;
  }

  try {
    const { iv, data } = encrypted;
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      window.sessionDEK,
      new Uint8Array(data)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (err) {
    console.error("❌ Failed to decrypt record", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                          Secure DB Access Wrappers                         */
/* -------------------------------------------------------------------------- */

// ➕ Add new encrypted record
export async function secureAdd(table, payload) {
  const encrypted = await encryptData(payload);
  const id = await db[table].add({ encrypted });
  await secureAuditLog("ADD", { table, id });
  return id;
}

// 🔎 Get single record by id
export async function secureGet(table, id) {
  const row = await db[table].get(id);
  if (!row) return null;
  const decrypted = await decryptData(row.encrypted);
  if (decrypted) await secureAuditLog("READ_ONE", { table, id });
  return decrypted;
}

// 📚 Get all records (use sparingly, logs READ_ALL)
export async function secureAll(table) {
  const rows = await db[table].toArray();
  const decrypted = await Promise.all(rows.map((r) => decryptData(r.encrypted)));
  const cleaned = decrypted.filter(Boolean);
  await secureAuditLog("READ_ALL", { table, count: cleaned.length });
  return cleaned;
}

// 🕐 Get most recent record (recommended for trackers)
export async function secureGetLatest(table) {
  if (!window.sessionDEK) throw new Error("DB locked, auth required.");
  const rows = await db[table].toArray();
  if (rows.length === 0) return null;

  const decryptedRows = (
    await Promise.all(rows.map((r) => decryptData(r.encrypted)))
  ).filter(Boolean);

  if (decryptedRows.length === 0) return null;

  const latest = decryptedRows.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )[0];
  await secureAuditLog("READ_LATEST", { table });
  return latest;
}

/* -------------------------------------------------------------------------- */
/*                         Encrypted Audit Log System                         */
/* -------------------------------------------------------------------------- */

// Append-only audit log
export async function secureAuditLog(action, metadata = {}) {
  if (!window.sessionDEK) return; // silent if locked
  const payload = {
    user: "local-user",
    action,
    timestamp: new Date().toISOString(),
    details: metadata,
  };
  const encrypted = await encryptData(payload);
  return db.auditLogs.add({ encrypted });
}

// Decrypt + load all audit logs
export async function secureAuditAll() {
  const rows = await db.auditLogs.toArray();
  const decrypted = await Promise.all(rows.map((r) => decryptData(r.encrypted)));
  return decrypted.filter(Boolean).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

/* -------------------------------------------------------------------------- */
/*                        Lifecycle Audit Shortcuts                           */
/* -------------------------------------------------------------------------- */

export async function auditLogin(method = "PIN") {
  await secureAuditLog("LOGIN", { method });
}

export async function auditLogout(reason = "manual") {
  await secureAuditLog("LOGOUT", { reason });
}

export async function auditExport(type) {
  await secureAuditLog("EXPORT", { type }); // e.g., type: "JSON" or "PDF"
}

/* -------------------------------------------------------------------------- */
/*                      PIN → Key Derivation (PBKDF2)                         */
/* -------------------------------------------------------------------------- */

export async function deriveSessionKeyFromPin(pin) {
  // Retrieve or generate a unique device salt
  let saltBase64 = localStorage.getItem("pinSalt");
  if (!saltBase64) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    saltBase64 = btoa(String.fromCharCode(...salt));
    localStorage.setItem("pinSalt", saltBase64);
  }
  const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: 310_000,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
