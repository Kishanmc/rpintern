import { MindmapNode } from '@/types/mindmap';

const STORAGE_KEY = 'mindmap-data';
const STORAGE_VERSION_KEY = 'mindmap-version';

export interface StoredMindmap {
  data: MindmapNode;
  version: number;
  lastSaved: string;
}

export const saveToLocalStorage = (data: MindmapNode): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored: StoredMindmap = {
      data,
      version: Date.now(),
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    localStorage.setItem(STORAGE_VERSION_KEY, stored.version.toString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): MindmapNode | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed: StoredMindmap = JSON.parse(stored);
    return parsed.data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const getLastSavedVersion = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    return version ? parseInt(version, 10) : null;
  } catch (error) {
    console.error('Failed to get version from localStorage:', error);
    return null;
  }
};

export const hasUnsavedChanges = (currentVersion: number): boolean => {
  const savedVersion = getLastSavedVersion();
  return savedVersion === null || currentVersion !== savedVersion;
};

export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

