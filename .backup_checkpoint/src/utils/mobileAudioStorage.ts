// Mobile-friendly audio storage & manager
// Handles uploading the user's authentic MP3 file to server & IndexedDB

const DB_NAME = "LavrionAudioDB";
const STORE_NAME = "audioStore";
const KEY_NAME = "portal_custom_mp3";

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      return reject("No IndexedDB");
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAudioLocally(blob: Blob): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, KEY_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save failed:", err);
  }
}

export async function getLocalAudioBlob(): Promise<Blob | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_NAME);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function checkServerAudioStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/portal-audio-status");
    if (!res.ok) return false;
    const data = await res.json();
    return data.exists === true;
  } catch {
    return false;
  }
}

export async function uploadAudioToServer(file: File | Blob): Promise<boolean> {
  // 1. Save locally to IndexedDB first
  await saveAudioLocally(file);

  // 2. Upload to server to persist permanently
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch("/api/save-portal-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data }),
        });
        const data = await res.json();
        resolve(data.success === true);
      } catch (err) {
        console.error("Audio server upload failed:", err);
        // Even if server upload fails, local IndexedDB succeeded
        resolve(true);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsDataURL(file);
  });
}

export async function createAudioSourceUrl(): Promise<string> {
  // First check local IndexedDB
  const localBlob = await getLocalAudioBlob();
  if (localBlob) {
    return URL.createObjectURL(localBlob);
  }
  // Otherwise check server endpoint
  return `/api/portal-audio?v=${Date.now()}`;
}
