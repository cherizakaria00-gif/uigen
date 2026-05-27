// Simple utility to track if anonymous user has created work
const STORAGE_KEY = "uigen_has_anon_work";
const DATA_KEY = "uigen_anon_data";

export function setHasAnonWork(messages: any[], fileSystemData: any) {
  if (typeof window === "undefined") return;
  
  // Only set if there's actual content
  if (messages.length > 0 || Object.keys(fileSystemData).length > 1) { // > 1 because root "/" always exists
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem(DATA_KEY, JSON.stringify({ messages, fileSystemData }));
  }
}

export function getHasAnonWork(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function getAnonWorkData(): { messages: any[], fileSystemData: any } | null {
  if (typeof window === "undefined") return null;
  
  const data = localStorage.getItem(DATA_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearAnonWork() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DATA_KEY);
}