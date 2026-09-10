import { GrammatariSavedRecord } from "../types";

const GRAMMATARI_STORAGE_KEY = "grammatari_database_records_v1";

/**
 * Load all saved Grammatari research records from persistent local storage
 */
export function loadGrammatariRecords(): GrammatariSavedRecord[] {
  try {
    const raw = localStorage.getItem(GRAMMATARI_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error loading Grammatari database records:", err);
    return [];
  }
}

/**
 * Save or update a Grammatari record into the dedicated database
 */
export function saveGrammatariRecord(
  data: Omit<GrammatariSavedRecord, "id" | "createdAt">
): GrammatariSavedRecord {
  const records = loadGrammatariRecords();
  
  // Check if identical source phrase already exists to update or prepend
  const existingIdx = records.findIndex(
    (r) => r.sourcePhrase.trim().toUpperCase() === data.sourcePhrase.trim().toUpperCase() &&
           r.minLen === data.minLen &&
           r.maxLen === data.maxLen
  );

  const newRecord: GrammatariSavedRecord = {
    ...data,
    id: existingIdx >= 0 ? records[existingIdx].id : `grammatari_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: existingIdx >= 0 ? records[existingIdx].createdAt : new Date().toISOString(),
  };

  let updated: GrammatariSavedRecord[];
  if (existingIdx >= 0) {
    updated = [...records];
    updated[existingIdx] = newRecord;
  } else {
    updated = [newRecord, ...records];
  }

  try {
    localStorage.setItem(GRAMMATARI_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving Grammatari record to localStorage:", err);
  }

  return newRecord;
}

/**
 * Delete a single Grammatari record by ID
 */
export function deleteGrammatariRecord(id: string): GrammatariSavedRecord[] {
  const records = loadGrammatariRecords();
  const updated = records.filter((r) => r.id !== id);
  try {
    localStorage.setItem(GRAMMATARI_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error deleting Grammatari record:", err);
  }
  return updated;
}

/**
 * Clear all records from the Grammatari database
 */
export function clearAllGrammatariRecords(): void {
  try {
    localStorage.removeItem(GRAMMATARI_STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing Grammatari database:", err);
  }
}
